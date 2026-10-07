import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/lib/models/Company";
import { getUserFromCookie } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const company = await Company.findByIdAndDelete(params.id);
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete company error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
