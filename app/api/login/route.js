import { NextResponse } from "next/server";
import { AUTH_COOKIE, createAuthCookieValue, findAccount } from "@/lib/auth";

export async function POST(request) {
  const { email, password } = await request.json();
  const account = findAccount(email, password);

  if (!account) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, account: { label: account.label, role: account.role } });
  response.cookies.set(AUTH_COOKIE, createAuthCookieValue(account), {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
