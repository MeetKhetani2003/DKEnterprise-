export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
import User from "@/lib/models/User";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const userObjectId = mongoose.Types.ObjectId.isValid(user.id)
      ? new mongoose.Types.ObjectId(user.id)
      : null;

    const query: any = user.role === "superadmin" 
      ? { isDeleted: { $ne: true } } 
      : { 
          isDeleted: { $ne: true }, 
          $or: [
            ...(userObjectId ? [
              { createdBy: userObjectId },
              { assignedAdmins: userObjectId },
              { assignedAdmin: userObjectId },
            ] : []),
            { createdBy: user.id },
            { assignedAdmins: user.id },
            { assignedAdmin: user.id }
          ] 
        };
    
    // Fetch and populate createdBy, assignedAdmin, and assignedAdmins with lean() for fast serialization
    const tenders = await Tender.find(query)
      .populate({ path: "createdBy", select: "username role", strictPopulate: false })
      .populate({ path: "assignedAdmin", select: "username role", strictPopulate: false })
      .populate({ path: "assignedAdmins", select: "username role", strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(tenders, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    console.error("Fetch tenders error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    if (data.assignedAdmin === "") {
      data.assignedAdmin = null;
    }
    if (data.assignedAdmins && Array.isArray(data.assignedAdmins)) {
      data.assignedAdmins = data.assignedAdmins.filter(Boolean);
    }
    const companies = data.companies || [];

    const tenderNoTrimmed = data.tenderNo ? String(data.tenderNo).trim() : "";
    if (tenderNoTrimmed) {
      const escaped = tenderNoTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingTender = await Tender.findOne({
        tenderNo: { $regex: new RegExp(`^${escaped}$`, 'i') },
        isDeleted: { $ne: true }
      });
      if (existingTender) {
        return NextResponse.json({ message: "TENDER NUMBER IS ALREADY EXIST" }, { status: 400 });
      }
    }

    const newTender = new Tender({
      ...data,
      tenderNo: tenderNoTrimmed,
      companies,
      createdBy: user.id,
    });
    await newTender.save();
    return NextResponse.json({ message: "Tender created successfully", tender: newTender }, { status: 201 });
  } catch (error) {
    console.error("Create tender error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
