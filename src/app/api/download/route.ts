import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://mkdigital:MvM2323@cluster0.pmw3ac4.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "dk-enterprise";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const bucketName = searchParams.get("bucket") || "resumes"; // 'resumes' or 'attachments'

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const bucket = new GridFSBucket(db, { bucketName });

    // Get file info
    const files = db.collection(`${bucketName}.files`);
    const file = await files.findOne({ _id: new ObjectId(fileId) });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Create download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    // Collect all chunks
    const chunks: Buffer[] = [];
    await new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      downloadStream.on("end", resolve);
      downloadStream.on("error", reject);
    });

    const buffer = Buffer.concat(chunks);

    // Return file as response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
