import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";

import { contactSchema } from "@/lib/form-schemas";
import { createSubmissionPdf, sendNotificationEmail } from "@/lib/form-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MONGODB_URI =
  "mongodb+srv://mkdigital:MvM2323@cluster0.pmw3ac4.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "dk-enterprise";
const COLLECTION_NAME = "contact_enquiries";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let client: MongoClient | null = null;
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

    const attachment = formData.get("attachment");
    if (attachment instanceof File && attachment.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Attachment must be under 5MB." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    let attachmentFileId = null;

    // Store attachment using GridFS if present
    if (attachment instanceof File) {
      const bucket = new GridFSBucket(db, { bucketName: "attachments" });
      const uploadStream = bucket.openUploadStream(attachment.name, {
        contentType: attachment.type,
        metadata: {
          originalName: attachment.name,
          size: attachment.size,
          uploadedAt: new Date(),
        },
      });

      const buffer = await attachment.arrayBuffer();
      await new Promise((resolve, reject) => {
        uploadStream.end(Buffer.from(buffer), (error) => {
          if (error) reject(error);
          else resolve(undefined);
        });
      });

      attachmentFileId = uploadStream.id;
    }

    // Prepare data for MongoDB
    const enquiryData = {
      ...parsed.data,
      attachmentFileId,
      submittedAt: new Date(),
    };

    // Insert into MongoDB
    await collection.insertOne(enquiryData);

    const fields = {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      Company: parsed.data.companyName || "N/A",
      "Company Size": parsed.data.companySize || "N/A",
      Country: parsed.data.country,
      State: parsed.data.state || "N/A",
      City: parsed.data.city || "N/A",
      "Inquiry Reason": parsed.data.inquiryReason,
      Service: parsed.data.service,
      Message: parsed.data.message,
    };

    const pdfBuffer = await createSubmissionPdf(
      "Contact Enquiry Summary",
      fields,
    );
    const emailResult = await sendNotificationEmail({
      title: "New Contact Enquiry",
      subject: `Contact Enquiry | ${parsed.data.service}`,
      fields,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your enquiry has been submitted successfully. The summary PDF is downloading now.",
      emailStatus: emailResult.sent
        ? "Notification email delivered to the configured business inbox."
        : "Email notification skipped because SMTP is not configured yet.",
      pdfBase64: pdfBuffer.toString("base64"),
      pdfFileName: "dk-enterprise-contact-enquiry.pdf",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while sending your enquiry.",
      },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
