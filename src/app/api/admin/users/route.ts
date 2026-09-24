import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find({ role: "admin" }).select("-password");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { username, password } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
