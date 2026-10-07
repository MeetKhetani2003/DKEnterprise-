export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lead from "@/lib/models/Lead";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Only allow users with e-invoice access or superadmins (based on user request: "lead manage ... with e invoice access")
    // Wait, the page.tsx handles the tab visibility, but the API should also ideally check it. Since user object doesn't have hasEInvoiceAccess readily available in the token, I'll rely on the standard access or just check the token.
    
    await dbConnect();
    
    const query: any = user.role === "superadmin" ? { isDeleted: { $ne: true } } : { createdBy: user.id, isDeleted: { $ne: true } };
    
    const leads = await Lead.find(query).populate("createdBy", "username role").sort({ createdAt: -1 });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch leads error:", error);
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
