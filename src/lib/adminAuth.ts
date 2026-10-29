import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

/** Authentification admin par mot de passe en variable d'environnement. */

export const COOKIE_NAME = "rm_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 h

export function adminPassword(): string | undefined {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length >= 4 ? pw : undefined;
}

export function adminToken(pw: string): string {
  return createHash("sha256").update(`rm-admin::${pw}`).digest("hex").slice(0, 32);
}

export function isAdmin(req: NextRequest): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return req.cookies.get(COOKIE_NAME)?.value === adminToken(pw);
}

export function setSessionCookie(res: NextResponse, pw: string): NextResponse {
  res.cookies.set(COOKIE_NAME, adminToken(pw), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
