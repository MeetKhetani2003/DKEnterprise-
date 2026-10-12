import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
import User from "@/lib/models/User";
import { getUserFromCookie } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const tender = await Tender.findById(params.id);
    if (!tender) {
      return NextResponse.json({ message: "Tender not found" }, { status: 404 });
    }

    const hasAccess = user.role === "superadmin" || 
      tender.createdBy?.toString() === user.id || 
      tender.assignedAdmin?.toString() === user.id ||
      (tender.assignedAdmins && tender.assignedAdmins.some((a: any) => (a._id || a).toString() === user.id));

    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (data.assignedAdmin === "") {
      data.assignedAdmin = null;
    }
    if (data.assignedAdmins && Array.isArray(data.assignedAdmins)) {
      data.assignedAdmins = data.assignedAdmins.filter(Boolean);
    }

    const tenderNoTrimmed = data.tenderNo ? String(data.tenderNo).trim() : "";
    if (tenderNoTrimmed && tenderNoTrimmed.toUpperCase() !== tender.tenderNo?.toUpperCase()) {
      const escaped = tenderNoTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingTender = await Tender.findOne({
        _id: { $ne: params.id },
        tenderNo: { $regex: new RegExp(`^${escaped}$`, 'i') },
        isDeleted: { $ne: true }
      });
      if (existingTender) {
        return NextResponse.json({ message: "TENDER NUMBER IS ALREADY EXIST" }, { status: 400 });
      }
    }
    if (data.tenderNo) {
      data.tenderNo = tenderNoTrimmed;
    }

    const updatedTender = await Tender.findByIdAndUpdate(params.id, data, { new: true })
      .populate({ path: "createdBy", select: "username role", strictPopulate: false })
      .populate({ path: "assignedAdmin", select: "username role", strictPopulate: false })
      .populate({ path: "assignedAdmins", select: "username role", strictPopulate: false });
    
    return NextResponse.json({ message: "Tender updated successfully", tender: updatedTender });
  } catch (error) {
    console.error("Update tender error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const tender = await Tender.findById(params.id);
    if (!tender) {
      return NextResponse.json({ message: "Tender not found" }, { status: 404 });
    }

    const hasDeleteAccess = user.role === "superadmin" || 
      tender.createdBy?.toString() === user.id || 
      tender.assignedAdmin?.toString() === user.id ||
      (tender.assignedAdmins && tender.assignedAdmins.some((a: any) => (a._id || a).toString() === user.id));

    if (!hasDeleteAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    tender.isDeleted = true;
    tender.deleteReason = data.reason || "";
    tender.deletedBy = user.id as any;
    tender.deletedAt = new Date();
    
    await tender.save();
    
    return NextResponse.json({ message: "Tender deleted successfully" });
  } catch (error) {
    console.error("Delete tender error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
