# Skill: Access Control & Security Management

## Purpose

This skill defines how authentication, authorization, role-based access control (RBAC), and tenant isolation must be implemented across the **Stone Industry Platform** (multi-tenant stone e-commerce and management platform).

The backend does not exist yet. This skill describes a **fully working, testable frontend implementation using mock data** that behaves exactly like the real system will, so that:

1. The UI, routing, and permission logic can be built and QA'd today.
2. Wiring the real backend later requires **swapping a data layer**, not rewriting the authorization architecture.

This skill must be read before implementing: login/OTP flows, admin/manager dashboards, any protected route, any role-conditional UI, or any API/service call that touches user, tenant, product, order, or storefront data.

---

## 1. Domain Model Recap

Three roles, enforced with **RBAC + Tenant Isolation**:

| Role | Scope |
|---|---|
| `SUPER_ADMIN` | Global — all tenants, all resources |
| `MANAGER` | Single tenant only (`tenantId` bound) |
| `USER` | Own account / own orders / public storefront browsing |

Every tenant-owned resource (`Product`, `Order`, `Inquiry`, `Customer relationship`, `Media`, `Category`, `Attribute`, `StorefrontSettings`, `Theme`) carries a `tenantId`. A `MANAGER` may only touch resources where `resource.tenantId === user.tenantId`. `SUPER_ADMIN` is exempt from this check. `USER` may only touch resources where `resource.ownerId === user.id`.

**Golden rule for this whole skill:** the frontend implementation you are about to build is a *UX convenience layer*, never a *security boundary*. Every rule below is duplicated here so it can be enforced later, unchanged, on the server. Do not treat "it's hidden in the UI" as "it's protected."

---

## 2. Recommended Libraries & Technologies

Keep the dependency footprint minimal. Only add a library if it removes real risk (token parsing, schema validation) — do not add a full auth framework while there's no backend to integrate it with.

| Concern | Recommendation | Why |
|---|---|---|
| Global auth/permission state | React Context + `useReducer` (or the state tool already used elsewhere in the project) | Matches existing project conventions; no need for Redux/Zustand just for auth |
| JWT decoding (client-side, read-only) | `jwt-decode` (~600B, no dependencies) | Never write your own JWT parser; never trust decoded claims for authorization — only for UI display (e.g. showing role/name) |
| Schema validation of auth/permission payloads | `zod` (if already present in the project) or manual TypeScript guards | Prevents malformed mock/real API responses from silently breaking permission checks |
| Route protection (Next.js) | `middleware.ts` (Next.js Middleware) + a server-side session/token check | Runs before render, works for both App Router and Pages Router projects |
| Token storage | `httpOnly` secure cookie (set by backend later) — **not** `localStorage` | Prevents XSS token theft; see §7 for the mock-phase compromise |
| Permission matrix typing | Plain TypeScript `const` objects + literal union types (`Role`, `Permission`) | Compile-time safety, zero runtime cost, easy to diff against backend matrix later |

Do not introduce Auth0, Clerk, NextAuth, Firebase Auth, or similar third-party auth providers unless the project owner explicitly asks — the platform already has a custom OTP flow and a custom multi-tenant role model that off-the-shelf providers do not map to cleanly.

---

## 3. Folder Structure

```
/auth
  ├── types.ts              # Role, Permission, User, Tenant types
  ├── permissions.ts        # Static RBAC permission matrix (mirrors backend matrix 1:1)
  ├── AuthContext.tsx       # React Context: user, token, tenantId, login(), logout(), refresh()
  ├── useAuth.ts            # Hook to consume AuthContext
  ├── usePermission.ts      # Hook: hasPermission(permission), hasRole(role)
  ├── RequirePermission.tsx # Component wrapper: conditionally render children
  ├── withAuthGuard.tsx     # HOC for page-level protection (if not using middleware)
  └── mock/
      ├── mockUsers.ts      # Fake users for each of the 3 roles + multiple tenants
      ├── mockAuthApi.ts    # Simulated network calls (send-otp, verify-otp, refresh, logout)
      └── mockDelay.ts      # Utility to simulate network latency for realistic UX testing
```

Adjust names to match this project's existing conventions (casing, `lib/` vs `features/`, etc.) — the structure matters more than the exact names.

---

## 4. Types

```ts
// auth/types.ts
export type Role = "SUPER_ADMIN" | "MANAGER" | "USER";

export type Permission =
  | "tenant:create" | "tenant:manage_all" | "tenant:manage_own"
  | "user:manage_all" | "user:manage_tenant"
  | "product:create" | "product:edit_all" | "product:edit_own_tenant"
  | "product:delete_all" | "product:delete_own_tenant" | "product:view_public"
  | "category:manage_global" | "category:manage_tenant"
  | "order:manage_all" | "order:manage_tenant" | "order:manage_own"
  | "customer:view_all" | "customer:view_tenant" | "customer:view_own"
  | "storefront:manage_all" | "storefront:manage_own"
  | "media:manage_all" | "media:manage_tenant"
  | "reports:view_global" | "reports:view_tenant"
  | "system:settings" | "system:roles_permissions"
  | "favorites:manage" | "compare:use" | "order:place" | "inquiry:submit";

export interface AuthUser {
  id: string;
  role: Role;
  tenantId: string | null; // null for SUPER_ADMIN
  name: string;
  phone: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}
```

Keeping `Permission` as an explicit union — instead of loose strings — means a typo in a permission check fails at compile time, not in production.

---

## 5. Permission Matrix (mirrors the Access Control Matrix exactly)

```ts
// auth/permissions.ts
import { Role, Permission } from "./types";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "tenant:create", "tenant:manage_all",
    "user:manage_all",
    "product:create", "product:edit_all", "product:delete_all", "product:view_public",
    "category:manage_global",
    "order:manage_all",
    "customer:view_all",
    "storefront:manage_all",
    "media:manage_all",
    "reports:view_global",
    "system:settings", "system:roles_permissions",
  ],
  MANAGER: [
    "tenant:manage_own",
    "user:manage_tenant",
    "product:create", "product:edit_own_tenant", "product:delete_own_tenant", "product:view_public",
    "category:manage_tenant",
    "order:manage_tenant",
    "customer:view_tenant",
    "storefront:manage_own",
    "media:manage_tenant",
    "reports:view_tenant",
  ],
  USER: [
    "product:view_public",
    "favorites:manage", "compare:use",
    "order:place", "order:manage_own",
    "customer:view_own",
    "inquiry:submit",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false; // default deny
}
```

**This file must have a line-for-line equivalent on the backend once it exists.** Treat any drift between the two as a bug. See §9.

---

## 6. Tenant Scoping Check

Every read/write of a tenant-owned resource must pass through one function — never inline the check ad hoc in components:

```ts
// auth/tenantScope.ts
export function canAccessTenantResource(
  user: AuthUser,
  resourceTenantId: string
): boolean {
  if (user.role === "SUPER_ADMIN") return true;
  if (user.role === "MANAGER") return user.tenantId === resourceTenantId;
  return false; // USER never accesses tenant-management resources this way
}
```

This mirrors the backend rule exactly: `authenticatedUser.role + authenticatedUser.tenantId === resource.tenantId`.

---

## 7. Mock Authentication Layer (until backend exists)

Goal: the rest of the app (context, hooks, guarded routes, UI) is written **exactly as it will be used against the real API** — only `mock/mockAuthApi.ts` gets deleted later.

```ts
// auth/mock/mockAuthApi.ts
import { mockUsers } from "./mockUsers";
import { AuthSession } from "../types";
import { mockDelay } from "./mockDelay";

const OTP_TEST_CODE = "12345";
let pendingPhone: string | null = null;

export async function sendOtp(phone: string): Promise<{ success: boolean }> {
  await mockDelay();
  pendingPhone = phone;
  return { success: true };
}

export async function verifyOtp(phone: string, code: string): Promise<AuthSession> {
  await mockDelay();
  if (code !== OTP_TEST_CODE || phone !== pendingPhone) {
    throw new Error("INVALID_CODE");
  }
  const user = mockUsers.find((u) => u.phone === phone) ?? mockUsers[2]; // default: USER role, auto-register
  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 min, same lifetime the real backend should use
  };
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  await mockDelay();
  const userId = refreshToken.replace("mock-refresh-", "");
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("INVALID_REFRESH_TOKEN");
  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
}

export async function logout(): Promise<void> {
  await mockDelay();
  pendingPhone = null;
}
```

```ts
// auth/mock/mockUsers.ts
import { AuthUser } from "../types";

export const mockUsers: AuthUser[] = [
  { id: "u-super", role: "SUPER_ADMIN", tenantId: null, name: "Platform Admin", phone: "09120000001" },
  { id: "u-manager-a", role: "MANAGER", tenantId: "tenant-a", name: "Manager A", phone: "09120000002" },
  { id: "u-manager-b", role: "MANAGER", tenantId: "tenant-b", name: "Manager B", phone: "09120000003" },
  { id: "u-user-1", role: "USER", tenantId: null, name: "Customer One", phone: "09120000004" },
];
```

### Dev-only Role Switcher

Add a small dev-only widget (rendered only when `process.env.NODE_ENV === "development"`) that lets whoever is testing instantly switch between the four mock users above, without going through the OTP flow each time. Never ship this to production — gate it behind the environment check, not a UI toggle alone.

### Token Storage During the Mock Phase

Real backend (later) → `httpOnly` secure cookie, set by the server, never touched by JS.
Mock phase (now) → since there is no server to set cookies, store the mock session in memory (React Context state) plus `sessionStorage` only as a page-refresh convenience. **Do not carry this `sessionStorage` fallback into the real integration** — it is a testing convenience, not a pattern to preserve. Flag it clearly with a `// MOCK-ONLY` comment wherever it's used.

---

## 8. Route & UI Protection

### 8.1 Route-level (Next.js Middleware)

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES: Record<string, Array<"SUPER_ADMIN" | "MANAGER" | "USER">> = {
  "/admin": ["SUPER_ADMIN"],
  "/manager": ["SUPER_ADMIN", "MANAGER"],
  "/account": ["SUPER_ADMIN", "MANAGER", "USER"],
  "/checkout": ["SUPER_ADMIN", "MANAGER", "USER"],
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const matchedPrefix = Object.keys(PROTECTED_PREFIXES).find((p) => path.startsWith(p));
  if (!matchedPrefix) return NextResponse.next();

  const session = req.cookies.get("session")?.value; // or decode from your token cookie
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", path); // preserve return destination
    return NextResponse.redirect(loginUrl);
  }

  // Role check here once the real token/claims are readable server-side.
  // In the mock phase, decode the mock token shape; in production, verify
  // the JWT signature server-side (never trust an unverified payload).

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/account/:path*", "/checkout/:path*"],
};
```

This satisfies the earlier login-flow requirement: unauthenticated users get bounced to `/login?redirect=/original/path`, and after successful OTP verification the app reads `redirect` and sends them back there (defaulting to `/` if absent).

### 8.2 Component-level

```tsx
// auth/RequirePermission.tsx
import { useAuth } from "./useAuth";
import { hasPermission } from "./permissions";
import { Permission } from "./types";

export function RequirePermission({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
```

Use this to hide/show buttons like "Delete product", "Manage storefront", "View global reports" — remembering this is UX polish, not security (§1).

---

## 9. Security Rules (must hold true even while mocked)

1. **Never trust the frontend.** Every mock function in §7 exists only so the *shape* of the real request/response is correct. When the backend exists, authorization decisions move server-side entirely.
2. **Tenant isolation is mandatory.** `canAccessTenantResource` (§6) must be called before rendering or mutating any tenant-scoped resource, even against mock data.
3. **User isolation.** A `USER` only ever sees `order.ownerId === currentUser.id`. Enforce this in the mock data layer too, so bugs are caught before the backend exists.
4. **Super Admin is global.** Never gate a `SUPER_ADMIN` check behind a `tenantId` comparison.
5. **Default deny.** `hasPermission` returns `false` for anything not explicitly listed (§5). Never invert this to "allow unless denied."
6. **Prevent IDOR even in mock data.** If a `MANAGER` for `tenant-a` requests a product belonging to `tenant-b` by changing an ID in a mock call, the mock API must reject it the same way the real backend will — don't let mock endpoints silently return anything requested.
7. **OTP codes are single-use and short-lived.** Even in the mock (`12345`), model an expiry window and a resend cooldown timer, since that UX and validation logic carries over unchanged.

---

## 10. Testing Checklist (frontend, pre-backend)

- [ ] Login as each of the 4 mock users; confirm role-appropriate navigation/menu items appear.
- [ ] As `MANAGER` (tenant-a), confirm tenant-b mock resources are unreachable via direct URL/ID manipulation.
- [ ] As `USER`, confirm another mock user's order is unreachable via direct URL/ID manipulation.
- [ ] Visit a protected route while logged out → redirected to `/login?redirect=...` → after OTP success, land back on the original route.
- [ ] Attempt an action with a permission the current mock role lacks (e.g. `USER` trying `product:create`) → UI hides/disables it, and the mock API layer also rejects it (defense in depth, even in mock).
- [ ] Refresh the page mid-session → session restored from the in-memory/sessionStorage mock store without re-login.
- [ ] Expired mock session → silent refresh attempt → falls back to login if refresh fails.

---

## 11. Backend Integration — What Changes When the Real Backend Exists

This section is the checklist for the migration day. Nothing in §3–§6 (types, permission matrix, tenant-scope function, guard components) should need to change — only the data-fetching layer underneath them.

### 11.1 Replace, don't rewrite

| Mock piece | Replace with |
|---|---|
| `auth/mock/mockAuthApi.ts` | Real HTTP calls to `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/refresh`, `/api/auth/logout` |
| `auth/mock/mockUsers.ts` | Deleted entirely |
| Dev-only role switcher | Deleted or hard-gated further (must never reach any deployed environment) |
| `sessionStorage` session fallback | Deleted; rely solely on the `httpOnly` secure cookie the backend sets |
| Client-side `ROLE_PERMISSIONS` matrix (§5) | Keep it, but treat it as a **UX cache** of what the backend returns — see 11.4 |

### 11.2 Required backend endpoints

```
POST /api/auth/send-otp        { phone }              -> { success }
POST /api/auth/verify-otp      { phone, code }         -> { user, accessToken, refreshToken, expiresAt }
POST /api/auth/refresh         { refreshToken }        -> { accessToken, refreshToken, expiresAt }
POST /api/auth/logout          {}                      -> { success }
GET  /api/users/me             (auth required)         -> { user }
```

The `user` object shape returned must match `AuthUser` in §4 — coordinate this contract explicitly with backend before wiring, so the frontend types don't silently drift from what the API actually returns.

### 11.3 Server-side responsibilities the mock phase does NOT cover

- **JWT signing & verification** with a real secret/key, proper `exp`/`iat` claims, and signature validation on every request (not just presence of a token).
- **OTP delivery** via SMS provider, rate-limiting per phone number (e.g. max N sends per hour) to prevent SMS-bombing abuse.
- **OTP brute-force protection** — lock out or delay after repeated wrong-code attempts on the same phone.
- **`httpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies** for token storage — the frontend should never read the access token directly once this is live.
- **CSRF protection** if using cookie-based auth for state-changing requests (double-submit cookie or a CSRF token header).
- **Refresh token rotation**: issue a new refresh token on every use and invalidate the old one, to detect token theft/replay.
- **Server-side enforcement of every rule in §9**, independent of and in addition to the frontend checks — the frontend checks become pure UX from this point on.
- **Tenant isolation enforced at the query/data-access layer** (e.g. every product/order/customer query automatically scoped by `tenantId` for non-`SUPER_ADMIN` roles), not just at the controller/route level.
- **IDOR checks on every resource endpoint** — verify role + tenant + ownership + permission server-side before returning or mutating a resource by ID (§6 rule mirrored server-side).
- **Audit logging** for `SUPER_ADMIN` actions and any cross-tenant access, plus sensitive `MANAGER` actions (user role changes, tenant config changes).

### 11.4 Keep the permission matrix in sync

Pick one of these two strategies and document the choice in the repo:

- **Strategy A — Static, duplicated matrix (simplest to start):** Keep `ROLE_PERMISSIONS` (§5) hardcoded on both frontend and backend. Add a lightweight contract test (or a shared JSON/YAML file imported by both, if the stacks allow it) that fails CI if the two drift apart.
- **Strategy B — Backend as source of truth (recommended once `system:roles_permissions` UI is built):** `GET /api/users/me` returns not just the role but the resolved `permissions: Permission[]` array for that user. The frontend's `hasPermission` becomes a lookup against the user's own permissions array instead of the static matrix. This is required anyway once Super Admins can edit roles/permissions at runtime (per the platform's own feature set).

### 11.5 Migration order (suggested)

1. Stand up `/api/auth/*` endpoints against a real user/tenant table.
2. Swap `mockAuthApi` calls for real `fetch`/HTTP client calls behind the same function signatures — `AuthContext` and every hook/component above it should require zero changes.
3. Move token storage from the mock in-memory/sessionStorage approach to the backend-set `httpOnly` cookie; remove the client-side token read entirely.
4. Turn on Next.js Middleware's real JWT verification (or a lightweight session-check API call) instead of the mock shape check.
5. Delete `auth/mock/` entirely and the dev role switcher, or move the switcher behind a staging-only feature flag if it's still useful for QA.
6. Run the full checklist in §10 again against the real backend, plus a dedicated cross-tenant penetration pass (attempt every IDOR scenario in §9 rule 6 manually).
