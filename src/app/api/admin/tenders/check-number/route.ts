export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenderNo = searchParams.get("tenderNo")?.trim();
    const excludeId = searchParams.get("excludeId");

    if (!tenderNo) {
      return NextResponse.json({ exists: false });
    }

    await dbConnect();
    const escaped = tenderNo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query: any = {
      tenderNo: { $regex: new RegExp(`^${escaped}$`, 'i') },
      isDeleted: { $ne: true }
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Tender.findOne(query);
    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("Check tender number error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
