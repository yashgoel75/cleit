import { NextRequest, NextResponse } from "next/server";
import { Society } from "../../../../db/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const society = await Society.findOne({ username }).select("-password -email");

    if (!society) {
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return NextResponse.json({ society }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch society", details: error.message },
      { status: 500 }
    );
  }
}
