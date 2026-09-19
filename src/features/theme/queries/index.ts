import type { ThemeTokens } from "@/providers";

/**
 * Theme queries.
 *
 * These are server-side query functions. The actual database
 * implementation should be added when the backend is ready.
 */
export async function getTenantTheme(tenantId: string): Promise<ThemeTokens | null> {
  // TODO: Implement server-side theme query scoped to tenant.
  void tenantId;
  return null;
}