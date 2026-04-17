import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://mkdigital:MvM2323@cluster0.pmw3ac4.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "dk-enterprise";
const COLLECTION_NAME = "career_applications";

export const runtime = "nodejs";

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const applications = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // Convert MongoDB documents to plain objects
    const result = applications.map((app) => ({
      _id: app._id.toString(),
      salutation: app.salutation,
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth,
      email: app.email,
      phone: app.phone,
      gender: app.gender,
      currentEmployer: app.currentEmployer,
      currentDesignation: app.currentDesignation,
      totalWorkExperience: app.totalWorkExperience,
      highestQualification: app.highestQualification,
      skills: app.skills,
      resumeFileId: app.resumeFileId,
      submittedAt: app.submittedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch career applications" },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
