import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Admin sign-in for /admin. Credentials default to admin/admin and are overridden with
// ADMIN_USERNAME / ADMIN_PASSWORD. A successful login sets a signed, httpOnly session cookie.
// Set ADMIN_SESSION_SECRET so sessions survive server restarts; without it a random secret is
// generated per server process.

export const SESSION_COOKIE = "admin_session";
const SESSION_HOURS = 8;

const globalForAuth = globalThis as typeof globalThis & { __adminSessionSecret?: string };

function sessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  // Cached on globalThis so dev hot reloads don't sign everyone out.
  globalForAuth.__adminSessionSecret ??= randomBytes(32).toString("hex");
  return globalForAuth.__adminSessionSecret;
}

function expectedCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin",
  };
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function checkCredentials(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  const expected = expectedCredentials();
  // Evaluate both so a wrong username and a wrong password take the same time.
  const userOk = safeEqual(username, expected.username);
  const passwordOk = safeEqual(password, expected.password);
  return userOk && passwordOk;
}

function sign(expiresAt: number) {
  // Including the credentials means changing the password signs out existing sessions.
  const { username, password } = expectedCredentials();
  return createHmac("sha256", sessionSecret()).update(`${expiresAt}:${username}:${password}`).digest("hex");
}

export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return { token: `${expiresAt}.${sign(expiresAt)}`, expiresAt };
}

function isValidToken(token: string | undefined) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  const expiresAt = Number(expires);
  if (!signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return safeEqual(signature, sign(expiresAt));
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdminSession() {
  const store = await cookies();
  return isValidToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  };
}

// Basic brute-force protection: too many failed logins from one address locks it out for a while.
const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; firstAt: number }>();

export function isLockedOut(key: string) {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > LOCKOUT_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordLoginFailure(key: string) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.firstAt > LOCKOUT_MS) failures.set(key, { count: 1, firstAt: Date.now() });
  else entry.count += 1;
}

export function clearLoginFailures(key: string) {
  failures.delete(key);
}
