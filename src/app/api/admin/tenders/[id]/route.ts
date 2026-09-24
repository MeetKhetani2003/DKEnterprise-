import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
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

    if (user.role !== "superadmin" && tender.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedTender = await Tender.findByIdAndUpdate(params.id, data, { new: true });
    
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

    if (user.role !== "superadmin" && tender.createdBy.toString() !== user.id) {
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
