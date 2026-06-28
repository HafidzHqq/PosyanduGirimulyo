import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = getAuthSession(cookies());

  return NextResponse.json({
    authenticated: Boolean(session),
    session: session
      ? {
          label: session.label,
          role: session.role,
          posyanduName: session.posyanduName,
        }
      : null,
  });
}
