import { NextRequest, NextResponse } from "next/server";
import { adminPassword, adminToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { password } → cookie httpOnly de session admin (12 h). */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const pw = adminPassword();
  if (!pw) {
    // Aucun mot de passe configuré : le site fonctionne en mode démo public.
    return NextResponse.json({ error: "not-configured" }, { status: 400 });
  }

  const given = String((body as { password?: unknown })?.password ?? "");
  if (given !== pw) {
    return NextResponse.json({ error: "bad-password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, expiresIn: COOKIE_MAX_AGE }, { status: 200 });
  res.cookies.set(COOKIE_NAME, adminToken(pw), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
