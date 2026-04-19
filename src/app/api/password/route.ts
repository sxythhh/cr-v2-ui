import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = "100";
const COOKIE_NAME = "site-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, SITE_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
