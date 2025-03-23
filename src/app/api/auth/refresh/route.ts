import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserSession } from "../../lib/models/userSession.model";
import { User } from "../../lib/models/user.model";

// Helper function to clear cookies and logout
function clearCookiesAndLogout() {
  const response = NextResponse.json(
    { message: "Session expired. Please login again." },
    { status: 401 }
  );

  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });

  return response;
}

const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return clearCookiesAndLogout();
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    const session = await UserSession.findOne({ refreshToken });

    if (!session) {
      return clearCookiesAndLogout();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return clearCookiesAndLogout();
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );
    const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    session.refreshToken = newRefreshToken;
    await session.save();

    const response = NextResponse.json({ message: "Token refreshed" });
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1d
    });
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return response;
  } catch {
    return clearCookiesAndLogout();
  }
}
