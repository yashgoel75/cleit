import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Assuming 'register' is your DB connection function
// import { register } from "@/lib/db"; 

// --- Mongoose Schemas (for context) ---
const { Schema } = mongoose;

const team = new Schema({
  name: String,
  designation: String,
  mobile: String,
  email: String,
});
const eventContact = new Schema({
  name: String,
  designation: String,
  mobile: String,
  email: String,
});
const social = new Schema({
  name: String,
  handle: String,
});
const eligibility = new Schema({
  name: String,
});
const event = new Schema({
  title: String,
  type: String,
  startDate: String,
  endDate: String,
  venue: String,
  time: String,
  about: String,
  contact: [eventContact],
  socialGroup: String,
})
const society = new Schema({
  name: String,
  username: String,
  logo: String,
  email: String,
  password: String,
  about: String,
  website: String,
  team: [team],
  social: [social],
  events: [event],
  auditionOpen: Boolean,
  eligibility: [eligibility],
  type: String,
});
const user = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  branch: String,
  batchStart: Number,
  batchEnd: Number,
  wishlist: [{ societyUsername: String }],
  reminders: [{ societyUsername: String }],
});

// Mock DB connection function if you don't have one
async function register() {
  // In a real app, this would connect to MongoDB
  // console.log("Connecting to DB...");
}


const Society = mongoose.models.Society || mongoose.model("Society", society);

// --- Modified API Route ---

export async function GET(req: NextRequest) {
  try {
    await register();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase();

    // Define the fields to exclude. This includes nested fields in the 'team' array.
    const fieldsToExclude = "-password -email -team.mobile -team.email";

    if (!username) {
      // When fetching all societies, apply the projection to exclude sensitive data
      const societies = await Society.find().select(fieldsToExclude);
      return NextResponse.json({ societies }, { status: 200 });
    }

    // When fetching a single society, also apply the projection
    const society = await Society.findOne({ username }).select(fieldsToExclude);

    if (!society) {
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return NextResponse.json({ society }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch society" },
      { status: 500 }
    );
  }
}