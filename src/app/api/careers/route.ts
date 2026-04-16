import { NextResponse } from 'next/server';

import { careerSchema } from '@/lib/form-schemas';
import { createSubmissionPdf, sendNotificationEmail } from '@/lib/form-utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = careerSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      location: formData.get('location'),
      experience: formData.get('experience'),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Please review the form and try again.',
        },
        { status: 400 },
      );
    }

    const resume = formData.get('resume');
    if (resume instanceof File && resume.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'Resume must be under 5MB.' }, { status: 400 });
    }

    const fields = {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Department: parsed.data.department,
      Preferred_Location: parsed.data.location,
      Experience: parsed.data.experience,
      Resume: resume instanceof File ? resume.name : 'Not attached',
    };

    const pdfBuffer = await createSubmissionPdf('Career Application Summary', fields);
    const emailResult = await sendNotificationEmail({
      title: 'New Career Application',
      subject: `Career Application | ${parsed.data.name}`,
      fields,
      attachment:
        resume instanceof File
          ? {
              filename: resume.name,
              content: Buffer.from(await resume.arrayBuffer()),
              contentType: resume.type || 'application/octet-stream',
            }
          : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. Your acknowledgement PDF is downloading now.',
      emailStatus: emailResult.sent
        ? 'Notification email delivered to the configured recruitment inbox.'
        : 'Email notification skipped because SMTP is not configured yet.',
      pdfBase64: pdfBuffer.toString('base64'),
      pdfFileName: 'dk-enterprise-career-application.pdf',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Something went wrong while processing your application.' }, { status: 500 });
  }
}
