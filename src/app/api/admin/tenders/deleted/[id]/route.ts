import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
import { getUserFromCookie } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const tender = await Tender.findById(params.id);
    if (!tender) {
      return NextResponse.json({ message: "Tender not found" }, { status: 404 });
    }

    if (user.role !== "superadmin" && tender.createdBy.toString() !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Tender.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Tender permanently deleted successfully" });
  } catch (error) {
    console.error("Delete tender permanently error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
