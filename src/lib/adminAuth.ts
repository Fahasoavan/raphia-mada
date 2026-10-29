import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

/** Authentification admin — jeton signé (HMAC) avec expiration intégrée. */

export const COOKIE_NAME = "rm_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 h
export const SECRET_SALT = "rm-admin-s::v1";

export function adminPassword(): string | undefined {
  const pw = process.env.ADMIN_PASSWORD;
  // 12 caractères minimum : on refuse un secret trop court (fail closed → mode démo)
  return pw && pw.length >= 12 ? pw : undefined;
}

export function adminLooksValid(pw: string): boolean {
  return pw.length >= 12;
}

/** Secret de signature : lié AUSSI au mot de passe → changer le mot de passe
 *  invalide immédiatement toutes les sessions en cours, même celles non expirées. */
function sessionSecret(pw: string): string {
  const extra = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", `${SECRET_SALT}::${pw}::${extra}`).update("session").digest("hex");
}

function sign(payload: string, pw: string): string {
  return createHmac("sha256", sessionSecret(pw)).update(payload).digest("base64url");
}

/** Crée { exp }.sig, jeton à durée de vie intégrée. */
export function createSessionToken(pw: string): { token: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payload = String(exp);
  const token = `${payload}.${sign(payload, pw)}`;
  return { token, maxAge: COOKIE_MAX_AGE };
}

export function verifySessionToken(token: string | undefined, pw: string): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{10,13}$/.test(payload)) return false;
  const expected = sign(payload, pw);
  // comparaison à temps constant + expiration
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  return exp > 0 && exp * 1000 > Date.now() && exp - Math.floor(Date.now() / 1000) <= COOKIE_MAX_AGE + 5;
}

export function isAdmin(req: NextRequest): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return verifySessionToken(req.cookies.get(COOKIE_NAME)?.value, pw);
}

export function setSessionCookie(res: NextResponse, pw: string): NextResponse {
  const { token, maxAge } = createSessionToken(pw);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}

/** empreinte du mot de passe (utile aux tests/diagnostics) */
export function passwordFingerprint(pw: string): string {
  return createHash("sha256").update(`rm-admin::${pw}`).digest("hex").slice(0, 16);
}
