import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/lib/models/Company";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const companies = await Company.find({}).sort({ name: 1 });
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Fetch companies error:", error);
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
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Company name is required" }, { status: 400 });
    }

    // Check if it exists
    let company = await Company.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!company) {
      company = new Company({ name });
      await company.save();
    }

    return NextResponse.json({ message: "Company created successfully", company }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
