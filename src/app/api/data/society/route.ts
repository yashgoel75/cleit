import { NextResponse } from "next/server";
import { Society } from "../../../../../db/schema";

export async function GET() {
  try {
    const societies = await Society.find({}, "-password");

    return NextResponse.json(
      {
        success: true,
        data: societies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching societies:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch societies",
      },
      { status: 500 }
    );
  }
}
