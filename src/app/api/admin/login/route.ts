import { NextRequest, NextResponse } from "next/server";
import { adminPassword, adminLooksValid, COOKIE_NAME, COOKIE_MAX_AGE, createSessionToken } from "@/lib/adminAuth";
import { rateLimit, ipOf, TOO_MANY } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Limiteur : 5 tentatives / 5 min / IP */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

/** POST { password } → cookie httpOnly de session admin (12 h, jeton HMAC signé). */
export async function POST(req: NextRequest) {
  const rl = await rateLimit("admin-login", ipOf(req), LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: TOO_MANY, retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const pw = adminPassword();
  if (!pw) {
    // Aucun mot de passe valide configuré : le site fonctionne en mode démo public.
    // (12 caractères minimum enforced dans adminPassword → fail closed)
    return NextResponse.json({ error: "not-configured" }, { status: 400 });
  }

  const given = String((body as { password?: unknown })?.password ?? "");
  if (!adminLooksValid(given) || given !== pw) {
    return NextResponse.json({ error: "bad-password" }, { status: 401 });
  }

  const { token, maxAge } = createSessionToken(pw);
  const res = NextResponse.json({ ok: true, expiresIn: maxAge }, { status: 200 });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
