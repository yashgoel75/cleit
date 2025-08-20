import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../db/schema";
import { register } from "@/instrumentation";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function GET(req: NextRequest) {
  try {
    await register();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
    }
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await register();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { userEmail, updates, wishlistAdd } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Missing userEmail" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (updates) {
      const allowedFields = ["name", "username", "branch", "batchStart", "batchEnd"];
      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          existingUser[field] = updates[field];
        }
      });
    }

    if (wishlistAdd) {
      const alreadyInWishlist = existingUser.wishlist.some(
        (item: { societyUsername: string }) => item.societyUsername === wishlistAdd
      );

      if (!alreadyInWishlist) {
        existingUser.wishlist.push({ societyUsername: wishlistAdd });
      }
    }

    await existingUser.save();

    return NextResponse.json({ success: true, user: existingUser }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { "Internal Server Error": "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await register();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userEmail, societyUsername } = await req.json();

    if (!userEmail || !societyUsername) {
      return NextResponse.json(
        { error: "userEmail and societyUsername are required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { wishlist: { societyUsername } } }, // Match societyUsername field
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found or society not in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Society removed from wishlist", user },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting society from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove society from wishlist" },
      { status: 500 }
    );
  }
}