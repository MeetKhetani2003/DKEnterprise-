import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lead from "@/lib/models/Lead";
import { getUserFromCookie } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const query: any = { _id: params.id };
    if (user.role !== "superadmin") {
      query.createdBy = user.id;
    }

    const updatedLead = await Lead.findOneAndUpdate(
      query,
      { $set: data },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ message: "Lead not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead updated successfully", lead: updatedLead });
  } catch (error) {
    console.error("Update lead error:", error);
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
    const { reason } = await req.json();

    const query: any = { _id: params.id };
    if (user.role !== "superadmin") {
      query.createdBy = user.id;
    }

    const deletedLead = await Lead.findOneAndUpdate(
      query,
      {
        $set: {
          isDeleted: true,
          deleteReason: reason,
          deletedBy: user.id,
          deletedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!deletedLead) {
      return NextResponse.json({ message: "Lead not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
