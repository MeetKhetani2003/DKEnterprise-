import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    const superAdminExists = await User.findOne({ role: "superadmin" });
    if (superAdminExists) {
      return NextResponse.json({ message: "Superadmin already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("superadmin123", 10);
    const superadmin = new User({
      email: "superadmin@dkenterprise.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await superadmin.save();

    return NextResponse.json({ message: "Superadmin created successfully.", email: "superadmin@dkenterprise.com", password: "superadmin123" }, { status: 201 });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
