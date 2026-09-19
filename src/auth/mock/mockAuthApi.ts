import type { AuthSession, AuthUser } from "../types";
import { mockDelay } from "./mockDelay";
import { mockUsers } from "./mockUsers";

/**
 * Mock authentication API — simulates the real endpoints
 * (access-control skill §7 + §11.2):
 *
 *   POST /api/auth/send-otp    -> sendOtp(phone)
 *   POST /api/auth/verify-otp  -> verifyOtp(phone, code)
 *   POST /api/auth/refresh     -> refreshSession(refreshToken)
 *   POST /api/auth/logout      -> logout()
 *
 * The REST of the app (context, hooks, guards, UI) is written exactly as
 * it will be used against the real API — only THIS file gets replaced
 * with real fetch calls during backend integration (skill §11.5).
 *
 * Security rules modeled even in mock (skill §9.7):
 * - OTP `12345`, single-use and short-lived (2 min TTL)
 * - resend cooldown (90 s) per phone
 * - brute-force guard: max 5 wrong attempts -> code invalidated
 * - sessions expire after 15 min, refresh-token flow supported
 */

const OTP_TEST_CODE = "12345";
/** Exported ONLY for the dev-mode hint inside the login form. */
export const MOCK_OTP_TEST_CODE = OTP_TEST_CODE;

const OTP_TTL_MS = 2 * 60 * 1000; // 2 min — short-lived, like the real thing
const RESEND_COOLDOWN_MS = 90 * 1000; // matches the UI resend timer
const MAX_VERIFY_ATTEMPTS = 5; // brute-force guard
const SESSION_TTL_MS = 15 * 60 * 1000; // same lifetime the real backend should use

export type MockAuthErrorCode =
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "TOO_MANY_ATTEMPTS"
  | "PHONE_NOT_REQUESTED"
  | "INVALID_REFRESH_TOKEN";

/** Typed error so the UI can map codes to Persian messages. */
export class MockAuthError extends Error {
  constructor(public code: MockAuthErrorCode) {
    super(code);
    this.name = "MockAuthError";
  }
}

export type SendOtpResult = {
  success: boolean;
  /** Seconds until the OTP expires. */
  expiresIn: number;
  /** Seconds the UI should keep the resend button disabled. */
  cooldownSeconds: number;
  reason?: "RESEND_COOLDOWN";
};

type PendingOtp = {
  phone: string;
  sentAt: number;
  expiresAt: number;
  attempts: number;
};

let pendingOtp: PendingOtp | null = null;

/**
 * Auto-registered USER accounts for phones not in mockUsers.
 * Kept in a Map so the same phone always resolves to the same user
 * (needed for per-user ownership isolation).
 */
const autoRegistered = new Map<string, AuthUser>();

function resolveUserByPhone(phone: string): AuthUser {
  const known = mockUsers.find((u) => u.phone === phone);
  if (known) return known;

  let user = autoRegistered.get(phone);
  if (!user) {
    user = {
      id: `u-${phone}`,
      role: "USER", // default role for new sign-ups
      tenantId: null,
      name: "کاربر جدید",
      phone,
    };
    autoRegistered.set(phone, user);
  }
  return user;
}

/** Step 1 — request an OTP for the given phone (resend cooldown enforced). */
export async function sendOtp(phone: string): Promise<SendOtpResult> {
  await mockDelay();

  const now = Date.now();

  if (pendingOtp && pendingOtp.phone === phone) {
    const cooldownRemainingMs = pendingOtp.sentAt + RESEND_COOLDOWN_MS - now;
    if (cooldownRemainingMs > 0) {
      // Rate-limit modeled even in mock — the real backend will rate-limit
      // per phone to prevent SMS-bombing (skill §11.3).
      return {
        success: false,
        reason: "RESEND_COOLDOWN",
        expiresIn: Math.max(0, Math.ceil((pendingOtp.expiresAt - now) / 1000)),
        cooldownSeconds: Math.ceil(cooldownRemainingMs / 1000),
      };
    }
  }

  pendingOtp = {
    phone,
    sentAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
  };

  return {
    success: true,
    expiresIn: Math.ceil(OTP_TTL_MS / 1000),
    cooldownSeconds: Math.ceil(RESEND_COOLDOWN_MS / 1000),
  };
}

/**
 * Step 2 — verify the OTP. Single-use + short-lived + brute-force guarded.
 * Unknown phones are auto-registered as USER (mock of the real sign-up flow).
 */
export async function verifyOtp(
  phone: string,
  code: string
): Promise<AuthSession> {
  await mockDelay();

  if (!pendingOtp || pendingOtp.phone !== phone) {
    throw new MockAuthError("PHONE_NOT_REQUESTED");
  }

  const now = Date.now();

  if (now > pendingOtp.expiresAt) {
    pendingOtp = null; // expired codes are discarded
    throw new MockAuthError("CODE_EXPIRED");
  }

  if (pendingOtp.attempts >= MAX_VERIFY_ATTEMPTS) {
    pendingOtp = null; // lock out — a new code must be requested
    throw new MockAuthError("TOO_MANY_ATTEMPTS");
  }

  if (code !== OTP_TEST_CODE) {
    pendingOtp.attempts += 1;
    throw new MockAuthError("INVALID_CODE");
  }

  pendingOtp = null; // OTP is single-use — even the correct one

  const user = resolveUserByPhone(phone);

  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

/** Silent session renewal — same contract as POST /api/auth/refresh. */
export async function refreshSession(
  refreshToken: string
): Promise<AuthSession> {
  await mockDelay();

  const userId = refreshToken.replace("mock-refresh-", "");
  const user =
    mockUsers.find((u) => u.id === userId) ??
    Array.from(autoRegistered.values()).find((u) => u.id === userId);

  if (!user) throw new MockAuthError("INVALID_REFRESH_TOKEN");

  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken, // real backend will rotate this (skill §11.3)
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

/** Server-side invalidation — clears any pending OTP state. */
export async function logout(): Promise<void> {
  await mockDelay();
  pendingOtp = null;
}

/**
 * DEV-ONLY helper for the Role Switcher widget — mints a session for a mock
 * user without going through the OTP flow. Throws outside development.
 * Must never be called from production code paths (skill §7).
 */
export function __devCreateSessionForUser(user: AuthUser): AuthSession {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("DEV_ONLY");
  }
  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}
