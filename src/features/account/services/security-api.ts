import { mockDelay } from "@/auth/mock/mockDelay";
import { sendOtp, verifyOtp, MockAuthError } from "@/auth/mock/mockAuthApi";
import type { UserSession } from "../types/security";
import {
  loadUserSessions,
  saveUserSessions,
  logSecurityEvent,
} from "../data/security-mock";

/**
 * Service layer for Account Security operations.
 *
 * Implements the security contract specified in:
 * - GET    /account/security/sessions
 * - DELETE /account/security/sessions/:id
 * - POST   /account/security/sessions/revoke-others
 * - POST   /account/security/phone/request
 * - POST   /account/security/phone/verify
 * - POST   /account/security/delete
 *
 * Enforces ownership checks (session.userId === userId) and server-side rules.
 */

export async function fetchUserSessions(userId: string): Promise<UserSession[]> {
  await mockDelay();
  return loadUserSessions(userId);
}

export async function revokeSession(
  userId: string,
  sessionId: string
): Promise<UserSession[]> {
  await mockDelay();
  const sessions = loadUserSessions(userId);
  const target = sessions.find((s) => s.id === sessionId);

  if (!target) {
    throw new Error("نشست مورد نظر یافت نشد.");
  }
  if (target.userId !== userId) {
    throw new Error("شما مجاز به حذف این نشست نیستید.");
  }
  if (target.isCurrent) {
    throw new Error("امکان خروج از دستگاه فعلی از این بخش وجود ندارد.");
  }

  const updated = sessions.filter((s) => s.id !== sessionId);
  saveUserSessions(userId, updated);

  logSecurityEvent({
    id: `ev-${Date.now()}`,
    userId,
    type: "session_revoked",
    createdAt: new Date().toISOString(),
    metadata: { sessionId, device: target.browser },
  });

  return updated;
}

export async function revokeOtherSessions(
  userId: string
): Promise<UserSession[]> {
  await mockDelay();
  const sessions = loadUserSessions(userId);
  const currentOnly = sessions.filter((s) => s.isCurrent);

  saveUserSessions(userId, currentOnly);

  logSecurityEvent({
    id: `ev-${Date.now()}`,
    userId,
    type: "other_sessions_revoked",
    createdAt: new Date().toISOString(),
    metadata: { remainingCount: currentOnly.length },
  });

  return currentOnly;
}

export async function requestPhoneChangeOtp(
  userId: string,
  currentPhone: string,
  newPhone: string
): Promise<{ success: boolean; cooldownSeconds: number; reason?: string }> {
  if (newPhone === currentPhone) {
    throw new Error("شماره جدید نمی‌تواند با شماره فعلی یکسان باشد.");
  }

  const res = await sendOtp(newPhone);
  return {
    success: res.success,
    cooldownSeconds: res.cooldownSeconds,
    reason: res.reason,
  };
}

export async function verifyPhoneChangeOtp(
  userId: string,
  newPhone: string,
  code: string
): Promise<void> {
  try {
    await verifyOtp(newPhone, code);
  } catch (err) {
    if (err instanceof MockAuthError) {
      if (err.code === "INVALID_CODE") {
        throw new Error("کد واردشده صحیح نیست.");
      }
      if (err.code === "CODE_EXPIRED") {
        throw new Error("کد منقضی شده است. لطفاً کد جدید دریافت کنید.");
      }
      if (err.code === "TOO_MANY_ATTEMPTS") {
        throw new Error("تلاش‌های بیش از حد مجاز؛ لطفاً دوباره کد درخواست کنید.");
      }
    }
    throw new Error("تأیید شماره تلفن با خطا مواجه شد.");
  }

  // Security-sensitive event: invalidate non-current sessions upon phone change
  const sessions = loadUserSessions(userId);
  const currentOnly = sessions.filter((s) => s.isCurrent);
  saveUserSessions(userId, currentOnly);

  logSecurityEvent({
    id: `ev-${Date.now()}`,
    userId,
    type: "phone_changed",
    createdAt: new Date().toISOString(),
    metadata: { newPhone },
  });
}

export async function deleteUserAccount(userId: string): Promise<void> {
  await mockDelay();
  // Wipe user sessions
  saveUserSessions(userId, []);

  logSecurityEvent({
    id: `ev-${Date.now()}`,
    userId,
    type: "account_deleted",
    createdAt: new Date().toISOString(),
  });
}
