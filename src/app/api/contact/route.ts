import { NextResponse } from 'next/server';

import { contactSchema } from '@/lib/form-schemas';
import { createSubmissionPdf, sendNotificationEmail } from '@/lib/form-utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = contactSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
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

    const attachment = formData.get('attachment');
    if (attachment instanceof File && attachment.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'Attachment must be under 5MB.' }, { status: 400 });
    }

    const fields = {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Subject: parsed.data.subject,
      Message: parsed.data.message,
      Attachment: attachment instanceof File ? attachment.name : 'Not attached',
    };

    const pdfBuffer = await createSubmissionPdf('Contact Enquiry Summary', fields);
    const emailResult = await sendNotificationEmail({
      title: 'New Contact Enquiry',
      subject: `Contact Enquiry | ${parsed.data.subject}`,
      fields,
      attachment:
        attachment instanceof File
          ? {
              filename: attachment.name,
              content: Buffer.from(await attachment.arrayBuffer()),
              contentType: attachment.type || 'application/octet-stream',
            }
          : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been submitted successfully. The summary PDF is downloading now.',
      emailStatus: emailResult.sent
        ? 'Notification email delivered to the configured business inbox.'
        : 'Email notification skipped because SMTP is not configured yet.',
      pdfBase64: pdfBuffer.toString('base64'),
      pdfFileName: 'dk-enterprise-contact-enquiry.pdf',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Something went wrong while sending your enquiry.' }, { status: 500 });
  }
}
