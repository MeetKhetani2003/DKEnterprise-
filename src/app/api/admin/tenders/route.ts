import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tender from "@/lib/models/Tender";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const query: any = user.role === "superadmin" ? { isDeleted: { $ne: true } } : { createdBy: user.id, isDeleted: { $ne: true } };
    
    // Fetch and populate createdBy if you want to show who created it
    const tenders = await Tender.find(query).populate("createdBy", "username role").sort({ createdAt: -1 });

    return NextResponse.json(tenders);
  } catch (error) {
    console.error("Fetch tenders error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const newTender = new Tender({
      ...data,
      createdBy: user.id,
    });

    await newTender.save();
    return NextResponse.json({ message: "Tender created successfully", tender: newTender }, { status: 201 });
  } catch (error) {
    console.error("Create tender error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
