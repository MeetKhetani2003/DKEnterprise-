import { NextResponse } from "next/server";
import { careerSchema } from "@/lib/form-schemas";
import { createSubmissionPdf, sendNotificationEmail } from "@/lib/form-utils";
import dbConnect from "@/lib/mongoose";
import CareerApplication from "@/lib/models/CareerApplication";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = careerSchema.safeParse({
      salutation: formData.get("salutation") || undefined,
      fullName: formData.get("fullName"),
      dateOfBirth: formData.get("dateOfBirth"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      currentEmployer: formData.get("currentEmployer") || undefined,
      currentDesignation: formData.get("currentDesignation"),
      totalWorkExperience: formData.get("totalWorkExperience"),
      highestQualification: formData.get("highestQualification"),
      skills: formData.get("skills"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Please review the form and try again.",
        },
        { status: 400 },
      );
    }

    const resume = formData.get("resume");

    const fields = {
      Salutation: parsed.data.salutation || "N/A",
      "Full Name": parsed.data.fullName,
      "Date of Birth": parsed.data.dateOfBirth,
      "Email ID": parsed.data.email,
      "Phone Number": parsed.data.phone,
      Gender: parsed.data.gender,
      "Current Employer": parsed.data.currentEmployer || "N/A",
      "Current Designation": parsed.data.currentDesignation,
      "Total Work Experience": parsed.data.totalWorkExperience,
      "Highest Qualification": parsed.data.highestQualification,
      Skills: parsed.data.skills,
      Resume: resume instanceof File ? resume.name : "Not attached",
    };

    const pdfBuffer = await createSubmissionPdf(
      "Career Application Summary",
      fields,
    );

    let emailSent = false;
    let emailStatus = "Email notification skipped because SMTP is not configured yet.";

    try {
      const emailResult = await sendNotificationEmail({
        title: "New Career Application",
        subject: `Career Application | ${parsed.data.fullName}`,
        fields,
        attachment:
          resume instanceof File
            ? {
                filename: resume.name,
                content: Buffer.from(await resume.arrayBuffer()),
                contentType: resume.type || "application/octet-stream",
              }
            : undefined,
      });
      emailSent = emailResult.sent;
      if (emailSent) {
        emailStatus = "Notification email delivered to the configured recruitment inbox.";
      }
    } catch (emailError) {
      console.error("Error sending career notification email:", emailError);
      emailStatus = "Notification email delivery failed (check SMTP settings).";
    }

    let resumeFileId = null;

    if (resume instanceof File) {
      const conn = await dbConnect();
      const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
        bucketName: "resumes",
      });
      const uploadStream = bucket.openUploadStream(resume.name, {
        metadata: { contentType: resume.type || "application/octet-stream" },
      });
      const arrayBuffer = await resume.arrayBuffer();
      uploadStream.end(Buffer.from(arrayBuffer));
      
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });
      resumeFileId = uploadStream.id.toString();
    } else {
      await dbConnect();
    }

    const applicationDoc = new CareerApplication({
      salutation: parsed.data.salutation,
      fullName: parsed.data.fullName,
      dateOfBirth: parsed.data.dateOfBirth,
      email: parsed.data.email,
      phone: parsed.data.phone,
      gender: parsed.data.gender,
      currentEmployer: parsed.data.currentEmployer,
      currentDesignation: parsed.data.currentDesignation,
      totalWorkExperience: parsed.data.totalWorkExperience,
      highestQualification: parsed.data.highestQualification,
      skills: parsed.data.skills,
      resumeFileId: resumeFileId,
    });

    await applicationDoc.save();

    return NextResponse.json({
      success: true,
      message:
        "Application submitted successfully. Your acknowledgement PDF is downloading now.",
      emailStatus,
      pdfBase64: pdfBuffer.toString("base64"),
      pdfFileName: "dk-enterprise-career-application.pdf",
    });
  } catch (error) {
    console.error("Careers form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while processing your application.",
      },
      { status: 500 },
    );
  }
}
