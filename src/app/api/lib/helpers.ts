export const runtime = "nodejs";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface IPagination {
  page: number;
  limit: number;
}
export function getPaginationParams(url: URLSearchParams): IPagination {
  const urlParams = new URLSearchParams(url);
  const page = parseInt(urlParams.get("page") || "1");
  const limit = parseInt(urlParams.get("limit") || "10");
  return { page, limit };
}

const SECRET = process.env.JWT_SECRET as string;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export function withAuthentication(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, SECRET);

      if (typeof decoded === "object" && "id" in decoded) {
        return handler(req); // ✅ If authenticated, execute the API handler
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message || "Something went wrong" },
        { status: 500 }
      );
    }
  };
}
