/**
 * Domain types for Account Security and Session Management.
 *
 * Enforces contracts for:
 * - Sessions & Active Devices
 * - Security Events log
 * - Phone change verification flow
 */

export type DeviceType = "desktop" | "mobile" | "tablet";

export type SessionStatus = "ACTIVE" | "REVOKED";

export interface Session {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceTitle?: string;
  browser: string;
  os: string;
  location: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
  status?: SessionStatus;
  userAgent?: string;
  expiresAt?: string;
  revokedAt?: string;
}

export type UserSession = Session;

export type SecurityEventType =
  | "phone_changed"
  | "session_revoked"
  | "other_sessions_revoked"
  | "account_deleted"
  | "PHONE_CHANGED"
  | "SESSION_REVOKED"
  | "ALL_OTHER_SESSIONS_REVOKED"
  | "ACCOUNT_DELETION_REQUESTED"
  | "ACCOUNT_DELETED";

export interface SecurityEvent {
  id: string;
  userId: string;
  type: SecurityEventType;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export type PhoneChangeStep = "phone" | "otp" | "success";
