import { NextResponse } from "next/server";
import { User } from "../../lib/models/user.model";
import { hashPassword } from "../../lib/helpers";
import { IError } from "../../lib/interfaces/common.interface";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully",
      status: 200,
      data: newUser,
    });
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
