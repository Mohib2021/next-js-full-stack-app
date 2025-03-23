import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { IError } from "../../lib/interfaces/common.interface";
import { User } from "../../lib/models/user.model";
import { verifyPassword } from "../../lib/helpers";
import { UserSession } from "../../lib/models/userSession.model";

const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const userIP =
      req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip");
    const userAgent = req.headers.get("user-agent");

    // Save session to database
    await UserSession.create({
      userId: user._id,
      refreshToken,
      ip: userIP,
      userAgent,
    });

    const response = NextResponse.json({ message: "Token refreshed" });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1d
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return response;
  } catch (error: unknown) {
    const err = error as IError;
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
