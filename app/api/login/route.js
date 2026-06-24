import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_EMAIL, AUTH_PASSWORD } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  if (email !== AUTH_EMAIL || password !== AUTH_PASSWORD) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "authenticated", {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
