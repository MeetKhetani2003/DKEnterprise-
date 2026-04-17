import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";

import { careerSchema } from "@/lib/form-schemas";
import { createSubmissionPdf, sendNotificationEmail } from "@/lib/form-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MONGODB_URI =
  "mongodb+srv://mkdigital:MvM2323@cluster0.pmw3ac4.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "dk-enterprise";
const COLLECTION_NAME = "career_applications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let client: MongoClient | null = null;
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
    if (resume instanceof File && resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Resume must be under 5MB." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    let resumeFileId = null;

    // Store resume using GridFS if present
    if (resume instanceof File) {
      const bucket = new GridFSBucket(db, { bucketName: "resumes" });
      const uploadStream = bucket.openUploadStream(resume.name, {
        contentType: resume.type,
        metadata: {
          originalName: resume.name,
          size: resume.size,
          uploadedAt: new Date(),
        },
      });

      const buffer = await resume.arrayBuffer();
      await new Promise((resolve, reject) => {
        uploadStream.end(Buffer.from(buffer), (error) => {
          if (error) reject(error);
          else resolve(undefined);
        });
      });

      resumeFileId = uploadStream.id;
    }

    // Prepare data for MongoDB
    const applicationData = {
      ...parsed.data,
      resumeFileId,
      submittedAt: new Date(),
    };

    // Insert into MongoDB
    const insertResult = await collection.insertOne(applicationData);

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

    return NextResponse.json({
      success: true,
      message:
        "Application submitted successfully. Your acknowledgement PDF is downloading now.",
      emailStatus: emailResult.sent
        ? "Notification email delivered to the configured recruitment inbox."
        : "Email notification skipped because SMTP is not configured yet.",
      pdfBase64: pdfBuffer.toString("base64"),
      pdfFileName: "dk-enterprise-career-application.pdf",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while processing your application.",
      },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
