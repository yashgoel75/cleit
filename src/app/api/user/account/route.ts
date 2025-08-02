import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../db/schema";

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    const username = searchParams.get("username");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {

  try {
    const body = await req.json();
    const { userEmail, updates } = body;

    if (!userEmail || !updates) {
      return NextResponse.json(
        { error: "Missing userEmail or updates" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allowedFields = ["name", "username", "branch", "batchStart", "batchEnd"];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        existingUser[field] = updates[field];
      }
    });

    await existingUser.save();

    return NextResponse.json({ success: true, user: existingUser }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
