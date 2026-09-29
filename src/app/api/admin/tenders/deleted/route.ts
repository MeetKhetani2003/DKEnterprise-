import { NextResponse } from "next/server";
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
    
    const query: any = user.role === "superadmin" ? { isDeleted: true } : { createdBy: user.id, isDeleted: true };
    
    const tenders = await Tender.find(query).populate("deletedBy", "username role").sort({ deletedAt: -1 });

    return NextResponse.json(tenders);
  } catch (error) {
    console.error("Fetch deleted tenders error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
