import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../db/schema";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
  const {
    name,
    username,
    email,
    password,
    mobile,
    startYear,
    endYear,
    department,
  } = (await req.json()) as any;
  try {
    if (!name || !username || !email || !password || !mobile || !startYear || !endYear || !department) {
      console.error("Missing entries");
      return NextResponse.json("Invalid Entry");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json("Invalid Email Format!");
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile)) {
      return NextResponse.json("Invalid Phone Number");
    }

    const user = await User.create({
      name,
      username,
      mobile,
      email,
      password: await argon2.hash(password),
      batchStart: parseInt(startYear),
      batchEnd: parseInt(endYear),
      branch: department,
    });
    console.log(user);

    return NextResponse.json({ ok: true });
  }
  catch (e) {
    console.log(e);
    return NextResponse.json({ ok: false });
  }

}
