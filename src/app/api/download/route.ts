import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const bucketName = searchParams.get("bucket");

  if (!fileId || !bucketName) {
    return NextResponse.json({ error: "Missing fileId or bucket" }, { status: 400 });
  }

  try {
    const conn = await dbConnect();
    const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: bucketName,
    });

    const objectId = new mongoose.Types.ObjectId(fileId);
    
    // Check if file exists
    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(objectId);

    const readable = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => controller.enqueue(chunk));
        downloadStream.on('end', () => controller.close());
        downloadStream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': file.metadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.filename}"`,
      },
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
