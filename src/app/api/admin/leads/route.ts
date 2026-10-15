export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lead from "@/lib/models/Lead";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const query: any = user.role === "superadmin" ? { isDeleted: { $ne: true } } : { createdBy: user.id, isDeleted: { $ne: true } };
    
    const leads = await Lead.find(query)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(leads, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const newLead = new Lead({
      ...data,
      createdBy: user.id,
    });

    await newLead.save();
    return NextResponse.json({ message: "Lead created successfully", lead: newLead }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
