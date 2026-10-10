import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkCredentials,
  clearLoginFailures,
  createSessionToken,
  isLockedOut,
  recordLoginFailure,
  sessionCookieOptions,
} from "@/lib/admin-auth";

/** Signs the admin in and sets the session cookie. */
export async function POST(request: Request) {
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (isLockedOut(clientKey)) {
    return NextResponse.json({ error: "Too many failed attempts. Please wait 15 minutes and try again." }, { status: 429 });
  }

  const payload = (await request.json().catch(() => ({}))) as { username?: unknown; password?: unknown };
  if (!checkCredentials(payload.username, payload.password)) {
    recordLoginFailure(clientKey);
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  clearLoginFailures(clientKey);
  const { token, expiresAt } = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
