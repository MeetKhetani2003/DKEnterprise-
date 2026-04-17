import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://mkdigital:MvM2323@cluster0.pmw3ac4.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "dk-enterprise";
const COLLECTION_NAME = "contact_enquiries";

export const runtime = "nodejs";

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const enquiries = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    // Convert MongoDB documents to plain objects
    const result = enquiries.map((enquiry) => ({
      _id: enquiry._id.toString(),
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      subject: enquiry.subject,
      message: enquiry.message,
      attachmentFileId: enquiry.attachmentFileId,
      submittedAt: enquiry.submittedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contact enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact enquiries" },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
