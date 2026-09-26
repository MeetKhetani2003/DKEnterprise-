import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/form-schemas";
import { sendNotificationEmail } from "@/lib/form-utils";
import dbConnect from "@/lib/mongoose";
import ContactEnquiry from "@/lib/models/ContactEnquiry";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      companyName: formData.get("companyName") || undefined,
      companySize: formData.get("companySize") || undefined,
      country: formData.get("country"),
      state: formData.get("state") || undefined,
      city: formData.get("city") || undefined,
      inquiryReason: formData.get("inquiryReason"),
      service: formData.get("service"),
      message: formData.get("message"),
      agreeToTerms: formData.get("agreeToTerms") === "true",
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

    const fields = {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Company: parsed.data.companyName || "N/A",
      "Company Size": parsed.data.companySize || "N/A",
      Country: parsed.data.country || "India",
      State: parsed.data.state || "N/A",
      City: parsed.data.city || "N/A",
      "Inquiry Reason": parsed.data.inquiryReason,
      Service: parsed.data.service,
      Message: parsed.data.message,
    };

    let emailSent = false;
    let emailStatus = "Email notification skipped because SMTP is not configured yet.";

    try {
      const emailResult = await sendNotificationEmail({
        title: "New Contact Enquiry",
        subject: `Contact Enquiry | ${parsed.data.service}`,
        fields,
      });
      emailSent = emailResult.sent;
      if (emailSent) {
        emailStatus = "Notification email delivered to the configured business inbox.";
      }
    } catch (emailError) {
      console.error("Error sending contact notification email:", emailError);
      emailStatus = "Notification email delivery failed (check SMTP settings).";
    }

    let attachmentFileId = null;
    const attachment = formData.get("attachment");

    if (attachment instanceof File) {
      const conn = await dbConnect();
      const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
        bucketName: "attachments",
      });
      const uploadStream = bucket.openUploadStream(attachment.name, {
        metadata: { contentType: attachment.type || "application/octet-stream" },
      });
      const arrayBuffer = await attachment.arrayBuffer();
      uploadStream.end(Buffer.from(arrayBuffer));
      
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });
      attachmentFileId = uploadStream.id.toString();
    } else {
      await dbConnect();
    }

    const enquiryDoc = new ContactEnquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      companyName: parsed.data.companyName,
      companySize: parsed.data.companySize,
      country: parsed.data.country,
      state: parsed.data.state,
      city: parsed.data.city,
      inquiryReason: parsed.data.inquiryReason,
      service: parsed.data.service,
      message: parsed.data.message,
      attachmentFileId: attachmentFileId,
    });

    await enquiryDoc.save();

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      emailStatus,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending your enquiry.",
      },
      { status: 500 },
    );
  }
}
