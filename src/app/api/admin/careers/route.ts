import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import CareerApplication from "@/lib/models/CareerApplication";
import { getUserFromCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const applications = await CareerApplication.find().sort({ submittedAt: -1 });
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch career applications" },
      { status: 500 },
    );
  }
}
