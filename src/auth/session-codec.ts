import type { AuthSession, Role } from "./types";

/**
 * Codec for the mock session cookie.
 *
 * MOCK-ONLY (skill §7): there is no backend to set an httpOnly secure cookie
 * yet, so the client writes a plain (non-httpOnly) cookie that Next.js
 * Middleware can read BEFORE render. This is a testing convenience, NOT a
 * pattern to preserve — during backend integration this file is deleted and
 * the middleware switches to server-verified httpOnly cookies / real JWTs.
 *
 * The payload is UNTRUSTED data (skill §9.1): it is enough for UX-level
 * gating, never for real security.
 */

export const MOCK_SESSION_COOKIE = "mock_session";

export type SessionCookiePayload = {
  uid: string;
  role: Role;
  tenantId: string | null;
  /** Epoch ms — expiry of the session. */
  exp: number;
};

export function encodeSessionCookie(session: AuthSession): string {
  const payload: SessionCookiePayload = {
    uid: session.user.id,
    role: session.user.role,
    tenantId: session.user.tenantId,
    exp: session.expiresAt,
  };
  // Payload is ASCII-only (ids/roles) — btoa is safe.
  return btoa(JSON.stringify(payload));
}

export function decodeSessionCookie(
  value: string | undefined | null
): SessionCookiePayload | null {
  if (!value) return null;
  try {
    const raw = JSON.parse(atob(value)) as Partial<SessionCookiePayload>;
    if (
      typeof raw.uid !== "string" ||
      (raw.role !== "SUPER_ADMIN" && raw.role !== "MANAGER" && raw.role !== "USER") ||
      (raw.tenantId !== null && typeof raw.tenantId !== "string") ||
      typeof raw.exp !== "number"
    ) {
      return null; // malformed payload — treat as no session (default deny)
    }
    return raw as SessionCookiePayload;
  } catch {
    return null;
  }
}
