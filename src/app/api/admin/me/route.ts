import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { getUserFromCookie } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = getUserFromCookie();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ 
      role: user.role, 
      username: user.username, 
      hasEInvoiceAccess: user.hasEInvoiceAccess,
      hasLeadAccess: user.hasLeadAccess // we might need this soon
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
