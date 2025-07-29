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

  const user = await User.create({
    name,
    username,
    mobile,
    email,
    password: await argon2.hash(password),
    batchStart: startYear,
    batchEnd: endYear,
    branch: department,
  });
  console.log(user);

  return NextResponse.json({ ok: true });
}
