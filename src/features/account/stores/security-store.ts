"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, SecurityEvent } from "../types/security";

const INITIAL_SESSIONS: Session[] = [
  {
    id: "sess-1",
    userId: "u-user-1",
    deviceType: "desktop",
    deviceTitle: "Chrome on Windows",
    browser: "Chrome 128",
    os: "Windows 11",
    location: "اصفهان، ایران",
    lastActiveAt: "همین الان",
    createdAt: "2025-01-10T08:30:00Z",
    isCurrent: true,
    status: "ACTIVE",
  },
  {
    id: "sess-2",
    userId: "u-user-1",
    deviceType: "mobile",
    deviceTitle: "Chrome on Android",
    browser: "Chrome Mobile",
    os: "Android 14",
    location: "تهران، ایران",
    lastActiveAt: "۲ ساعت پیش",
    createdAt: "2025-01-08T14:20:00Z",
    isCurrent: false,
    status: "ACTIVE",
  },
  {
    id: "sess-3",
    userId: "u-user-1",
    deviceType: "tablet",
    deviceTitle: "Safari on iPadOS",
    browser: "Safari 17",
    os: "iPadOS 17",
    location: "شیراز، ایران",
    lastActiveAt: "۳ روز پیش",
    createdAt: "2025-01-01T11:45:00Z",
    isCurrent: false,
    status: "ACTIVE",
  },
];

interface SecurityStoreState {
  sessions: Session[];
  events: SecurityEvent[];
  getUserSessions: (userId: string) => Session[];
  revokeSession: (sessionId: string, userId: string) => void;
  revokeOtherSessions: (userId: string) => void;
  addSecurityEvent: (event: Omit<SecurityEvent, "id" | "createdAt">) => void;
  resetAll: () => void;
}

export const useSecurityStore = create<SecurityStoreState>()(
  persist(
    (set, get) => ({
      sessions: INITIAL_SESSIONS,
      events: [],

      getUserSessions: (userId: string) => {
        const { sessions } = get();
        // Return active sessions for this user, with current session always first
        return sessions
          .filter(
            (s) =>
              (s.userId === userId || s.userId === "u-user-1") &&
              s.status === "ACTIVE"
          )
          .sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0));
      },

      revokeSession: (sessionId: string, userId: string) => {
        set((state) => {
          const target = state.sessions.find((s) => s.id === sessionId);
          if (!target || target.isCurrent) return state; // Never revoke current session from this action

          const updatedSessions = state.sessions.map((s) =>
            s.id === sessionId ? { ...s, status: "REVOKED" as const } : s
          );

          const newEvent: SecurityEvent = {
            id: `evt-${Date.now()}`,
            userId,
            type: "SESSION_REVOKED",
            createdAt: new Date().toISOString(),
            metadata: {
              sessionId,
              deviceTitle: target.deviceTitle,
            },
          };

          return {
            sessions: updatedSessions,
            events: [newEvent, ...state.events],
          };
        });
      },

      revokeOtherSessions: (userId: string) => {
        set((state) => {
          const updatedSessions = state.sessions.map((s) => {
            if (s.isCurrent) return s;
            return { ...s, status: "REVOKED" as const };
          });

          const newEvent: SecurityEvent = {
            id: `evt-${Date.now()}`,
            userId,
            type: "ALL_OTHER_SESSIONS_REVOKED",
            createdAt: new Date().toISOString(),
            metadata: { count: state.sessions.filter((s) => !s.isCurrent && s.status === "ACTIVE").length },
          };

          return {
            sessions: updatedSessions,
            events: [newEvent, ...state.events],
          };
        });
      },

      addSecurityEvent: (event) => {
        set((state) => ({
          events: [
            {
              id: `evt-${Date.now()}`,
              createdAt: new Date().toISOString(),
              ...event,
            },
            ...state.events,
          ],
        }));
      },

      resetAll: () => {
        set({ sessions: INITIAL_SESSIONS, events: [] });
      },
    }),
    {
      name: "stone-security-store",
    }
  )
);
