import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    const superAdminExists = await User.findOne({ role: "superadmin" });
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    if (superAdminExists) {
      superAdminExists.username = "superadmin";
      superAdminExists.password = hashedPassword;
      superAdminExists.set('email', undefined, { strict: false });
      await superAdminExists.save();
      return NextResponse.json({ message: "Superadmin updated successfully.", username: "superadmin", password: "superadmin123" }, { status: 200 });
    }

    const superadmin = new User({
      username: "superadmin",
      password: hashedPassword,
      role: "superadmin",
    });

    await superadmin.save();

    return NextResponse.json({ message: "Superadmin created successfully.", username: "superadmin", password: "superadmin123" }, { status: 201 });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
