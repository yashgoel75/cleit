import { NextRequest, NextResponse } from "next/server";
import { User } from "../../../../../db/schema";
import argon2 from "argon2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    if (email) {
      const userEmailExists = await User.findOne({ email });
      const societyEmailExists = await User.findOne({ email });

      return NextResponse.json({
        emailExists: !!(userEmailExists || societyEmailExists),
      });
    }

    if (username) {
      const userUsernameExists = await User.findOne({ username });
      const societyUsernameExists = await User.findOne({ username });

      return NextResponse.json({
        usernameExists: !!(userUsernameExists || societyUsernameExists),
      });
    }

    return NextResponse.json(
      { error: "Please provide 'username' or 'email' to check." },
      { status: 400 },
    );
  } catch (e) {
    console.error("Validation error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
interface User {
  name: string,
  username: string,
  email: string,
  password: string,
  startYear: number,
  endYear: number,
  department: string
}
export async function POST(req: NextRequest) {
  const { name, username, email, password, startYear, endYear, department } =
    (await req.json()) as User;
  try {
    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !startYear ||
      !endYear ||
      !department
    ) {
      console.error("Missing entries");
      return NextResponse.json("Invalid Entry");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json("Invalid Email Format!");
    }
    // const phoneRegex = /^[6-9]\d{9}$/;
    // if (!phoneRegex.test(mobile)) {
    //   return NextResponse.json("Invalid Phone Number");
    // }

    const user = await User.create({
      name,
      username,
      email,
      password: await argon2.hash(password),
      batchStart: startYear,
      batchEnd: endYear,
      branch: department,
    });
    console.log(user);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ ok: false });
  }
}
