import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { getUserFromCookie } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { username, password } = await req.json();

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (username && username !== targetUser.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
      }
      targetUser.username = username;
    }

    if (password) {
      targetUser.password = bcrypt.hashSync(password, 10);
    }

    await targetUser.save();
    return NextResponse.json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "superadmin") {
      return NextResponse.json({ message: "Cannot delete superadmin" }, { status: 403 });
    }

    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
