"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeTokens = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  radius: string;
  fontSans: string;
  fontHeading: string;
};

const defaultTokens: ThemeTokens = {
  primary: "#8b5e34",
  primaryForeground: "#fafaf9",
  secondary: "#f5f0ea",
  secondaryForeground: "#292524",
  background: "#faf9f7",
  foreground: "#1c1917",
  muted: "#f5f0ea",
  mutedForeground: "#78716c",
  accent: "#e7dccb",
  accentForeground: "#292524",
  border: "#e7e0d6",
  radius: "0.5rem",
  fontSans: "var(--font-vazirmatn)",
  fontHeading: "var(--font-vazirmatn)",
};

type ThemeContextValue = {
  tokens: ThemeTokens;
  setTokens: (tokens: Partial<ThemeTokens>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  tokens: initialTokens,
}: {
  children: ReactNode;
  tokens?: Partial<ThemeTokens>;
}) {
  const [tokens, setTokensState] = useState<ThemeTokens>({
    ...defaultTokens,
    ...initialTokens,
  });

  const setTokens = (next: Partial<ThemeTokens>) => {
    setTokensState((prev) => ({ ...prev, ...next }));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", tokens.primary);
    root.style.setProperty("--primary-foreground", tokens.primaryForeground);
    root.style.setProperty("--secondary", tokens.secondary);
    root.style.setProperty("--secondary-foreground", tokens.secondaryForeground);
    root.style.setProperty("--background", tokens.background);
    root.style.setProperty("--foreground", tokens.foreground);
    root.style.setProperty("--muted", tokens.muted);
    root.style.setProperty("--muted-foreground", tokens.mutedForeground);
    root.style.setProperty("--accent", tokens.accent);
    root.style.setProperty("--accent-foreground", tokens.accentForeground);
    root.style.setProperty("--border", tokens.border);
    root.style.setProperty("--radius", tokens.radius);
    root.style.setProperty("--font-sans", tokens.fontSans);
    root.style.setProperty("--font-heading", tokens.fontHeading);
  }, [tokens]);

  return (
    <ThemeContext.Provider value={{ tokens, setTokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}