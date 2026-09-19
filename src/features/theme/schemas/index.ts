import { z } from "zod";

export const themeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  primaryForeground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  secondaryForeground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  muted: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  mutedForeground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  accentForeground: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  border: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  radius: z.string().min(1),
  fontSans: z.string().min(1),
  fontHeading: z.string().min(1),
});

export type ThemeFormValues = z.infer<typeof themeSchema>;