"use client";

import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "./AuthContext";

/**
 * Hook to consume the AuthContext (access-control skill §3).
 * Throws when used outside an <AuthProvider> so miswired trees fail loudly
 * instead of silently denying every permission.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
