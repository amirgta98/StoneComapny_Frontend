"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { encodeSessionCookie, MOCK_SESSION_COOKIE } from "./session-codec";
import type { AuthSession, AuthUser } from "./types";
import { logout as mockLogout, refreshSession } from "./mock/mockAuthApi";
import { __devCreateSessionForUser } from "./mock/mockAuthApi";

/**
 * Global auth/permission state — React Context + useReducer
 * (access-control skill §2 + §7).
 *
 * Holds: user, tokens, tenantId, and the login/logout/refresh actions.
 * Written against the REAL API contract: swapping the mock data layer
 * requires zero changes here (skill §11.5).
 *
 * MOCK-ONLY storage compromise (skill §7):
 * - the session lives in memory (this reducer) for security-sensitive use,
 * - sessionStorage mirrors it only as a page-refresh convenience,
 * - a plain mock_session cookie lets Next.js Middleware see the session.
 * All three fallbacks are deleted when the backend sets httpOnly cookies.
 */

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  session: AuthSession | null;
};

type AuthAction =
  | { type: "RESTORED"; session: AuthSession | null }
  | { type: "SIGNED_IN"; session: AuthSession }
  | { type: "SIGNED_OUT" }
  | { type: "USER_UPDATED"; user: AuthUser };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORED":
      return {
        status: action.session ? "authenticated" : "unauthenticated",
        session: action.session,
      };
    case "SIGNED_IN":
      return { status: "authenticated", session: action.session };
    case "SIGNED_OUT":
      return { status: "unauthenticated", session: null };
    case "USER_UPDATED":
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, user: action.user },
      };
  }
}

const STORAGE_KEY = "stone-auth-session"; // MOCK-ONLY sessionStorage mirror

function readStoredSession(): AuthSession | null {
  // sessionStorage read is MOCK-ONLY (page-refresh convenience).
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (
      !parsed ||
      !parsed.user ||
      typeof parsed.user.id !== "string" ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      sessionStorage.removeItem(STORAGE_KEY); // malformed — discard
      return null;
    }
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession) {
  // sessionStorage write is MOCK-ONLY — never carried into real integration.
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* storage full/unavailable — in-memory state still works */
  }
  writeSessionCookie(session);
}

function clearPersistedSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  clearSessionCookie();
}

function writeSessionCookie(session: AuthSession) {
  // MOCK-ONLY cookie — the real backend sets an httpOnly secure cookie.
  document.cookie =
    `${MOCK_SESSION_COOKIE}=${encodeSessionCookie(session)}` +
    "; path=/; SameSite=Lax";
}

function clearSessionCookie() {
  document.cookie = `${MOCK_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export type AuthContextValue = {
  user: AuthUser | null;
  tenantId: string | null;
  token: string | null;
  session: AuthSession | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  /** DEV-ONLY — used by the Role Switcher widget. */
  __devSetSession: (user: AuthUser) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Refresh when the session has less than 2 minutes left. */
const REFRESH_THRESHOLD_MS = 2 * 60 * 1000;
const REFRESH_CHECK_INTERVAL_MS = 30 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    status: "loading",
    session: null,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* Restore the session on mount; if expired, attempt a silent refresh
     and fall back to logout when the refresh fails (skill §10 last item). */
  useEffect(() => {
    let cancelled = false;

    const stored = readStoredSession();
    if (!stored) {
      dispatch({ type: "RESTORED", session: null });
      return;
    }

    if (stored.expiresAt > Date.now()) {
      persistSession(stored); // re-sync the middleware cookie
      dispatch({ type: "RESTORED", session: stored });
      return;
    }

    refreshSession(stored.refreshToken)
      .then((session) => {
        if (cancelled) return;
        persistSession(session);
        dispatch({ type: "RESTORED", session });
      })
      .catch(() => {
        if (cancelled) return;
        clearPersistedSession();
        dispatch({ type: "RESTORED", session: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);


  const login = useCallback((session: AuthSession) => {
    persistSession(session);
    dispatch({ type: "SIGNED_IN", session });
  }, []);

  const logout = useCallback(async () => {
    await mockLogout();
    clearPersistedSession();
    dispatch({ type: "SIGNED_OUT" });
  }, []);

  const refresh = useCallback(async () => {
    const session = stateRef.current.session;
    if (!session) return;
    try {
      const next = await refreshSession(session.refreshToken);
      persistSession(next);
      dispatch({ type: "SIGNED_IN", session: next });
    } catch {
      await mockLogout();
      clearPersistedSession();
      dispatch({ type: "SIGNED_OUT" });
    }
  }, []);

  /* Silent refresh — keeps an active tab alive past the 15-min TTL. */
  useEffect(() => {
    const id = setInterval(() => {
      const session = stateRef.current.session;
      if (session && session.expiresAt - Date.now() < REFRESH_THRESHOLD_MS) {
        void refresh();
      }
    }, REFRESH_CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const updateUser = useCallback((user: AuthUser) => {
    const current = stateRef.current.session;
    if (!current) return;
    const next: AuthSession = { ...current, user };
    persistSession(next);
    dispatch({ type: "USER_UPDATED", user });
  }, []);

  const __devSetSession = useCallback(
    (user: AuthUser) => {
      const session = __devCreateSessionForUser(user); // throws outside dev
      login(session);
    },
    [login]
  );

  const value: AuthContextValue = {
    user: state.session?.user ?? null,
    tenantId: state.session?.user.tenantId ?? null,
    token: state.session?.accessToken ?? null,
    session: state.session,
    status: state.status,
    isAuthenticated: state.status === "authenticated",
    login,
    logout,
    refresh,
    updateUser,
    __devSetSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
