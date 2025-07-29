import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../db/schema";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
  const { name, username, email, password, mobile } = (await req.json()) as any;

  const society = await User.create({
    name,
    username,
    mobile,
    email,
    password: await argon2.hash(password),
  });
  console.log(society);

  return NextResponse.json({ ok: true });
}
