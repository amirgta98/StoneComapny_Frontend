/**
 * Auth & access-control module (access-control skill §3).
 *
 * Architecture:
 * - `types.ts`            — Role / Permission / AuthUser / AuthSession
 * - `permissions.ts`      — static RBAC matrix (Strategy A, §11.4)
 * - `tenantScope.ts`      — tenant + ownership isolation checks (§6)
 * - `AuthContext.tsx`     — session state + login/logout/refresh (§7)
 * - `useAuth.ts`          — consume the auth context
 * - `usePermission.ts`    — hasPermission / hasRole hooks
 * - `RequirePermission.tsx` — component-level gating (§8.2)
 * - `withAuthGuard.tsx`   — page-level HOC guard (second line of defense)
 * - `session-codec.ts`    — MOCK-ONLY middleware cookie codec
 * - `RoleSwitcher.tsx`    — DEV-ONLY quick role switching widget
 * - `mock/`               — the ONLY folder deleted on backend integration
 *                           (§11.5): swap `mockAuthApi.ts` for real fetch
 *                           calls with identical signatures.
 *
 * Golden rule (§1): the frontend is a UX convenience layer, never a
 * security boundary. Every rule here is mirrored server-side later.
 */

export { AuthProvider, AuthContext, type AuthContextValue, type AuthStatus } from "./AuthContext";
export { useAuth } from "./useAuth";
export { usePermission } from "./usePermission";
export { RequirePermission } from "./RequirePermission";
export { withAuthGuard } from "./withAuthGuard";
export { RoleSwitcher } from "./RoleSwitcher";
export { hasPermission, ROLE_PERMISSIONS } from "./permissions";
export { canAccessTenantResource, canAccessOwnedResource } from "./tenantScope";
export type {
  Role,
  Permission,
  AuthUser,
  AuthSession,
} from "./types";
