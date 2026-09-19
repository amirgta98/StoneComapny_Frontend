import type { UserSession, SecurityEvent } from "../types/security";

/**
 * Mock data layer for Account Security (Access Control skill §7 & §9 rule 3).
 *
 * Persisted in sessionStorage during client sessions so QA/demo interactions
 * (revoking a session, revoking all others, changing phone) persist across page navigations.
 * Swapped for real API calls when the backend is connected.
 */

const STORAGE_KEY_PREFIX = "stone-mock-sessions-";
const EVENTS_KEY_PREFIX = "stone-mock-security-events-";

export function getInitialMockSessions(userId: string): UserSession[] {
  return [
    {
      id: `sess-${userId}-1`,
      userId,
      deviceType: "desktop",
      browser: "Chrome on Windows",
      os: "Windows 11",
      location: "اصفهان، ایران",
      lastActiveAt: "همین الان",
      createdAt: "۱۴۰۳/۰۶/۱۵",
      isCurrent: true,
    },
    {
      id: `sess-${userId}-2`,
      userId,
      deviceType: "mobile",
      browser: "Chrome on Android",
      os: "Android 14",
      location: "تهران، ایران",
      lastActiveAt: "۲ ساعت پیش",
      createdAt: "۱۴۰۳/۰۶/۱۰",
      isCurrent: false,
    },
    {
      id: `sess-${userId}-3`,
      userId,
      deviceType: "mobile",
      browser: "Safari on iOS",
      os: "iOS 17.5",
      location: "شیراز، ایران",
      lastActiveAt: "۳ روز پیش",
      createdAt: "۱۴۰۳/۰۵/۲۸",
      isCurrent: false,
    },
  ];
}

export function loadUserSessions(userId: string): UserSession[] {
  if (typeof window === "undefined") {
    return getInitialMockSessions(userId);
  }
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) {
      const initial = getInitialMockSessions(userId);
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as UserSession[];
  } catch {
    return getInitialMockSessions(userId);
  }
}

export function saveUserSessions(userId: string, sessions: UserSession[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(sessions));
  } catch {
    /* quota/storage full fallback */
  }
}

export function logSecurityEvent(event: SecurityEvent): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${EVENTS_KEY_PREFIX}${event.userId}`;
    const raw = sessionStorage.getItem(key);
    const events: SecurityEvent[] = raw ? JSON.parse(raw) : [];
    events.unshift(event);
    sessionStorage.setItem(key, JSON.stringify(events.slice(0, 20)));
  } catch {
    /* ignore */
  }
}
