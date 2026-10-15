import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import ContactEnquiry from "@/lib/models/ContactEnquiry";
import { getUserFromCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const enquiries = await ContactEnquiry.find().sort({ submittedAt: -1 }).lean();
    
    return NextResponse.json(enquiries, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error fetching contact enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact enquiries" },
      { status: 500 },
    );
  }
}
