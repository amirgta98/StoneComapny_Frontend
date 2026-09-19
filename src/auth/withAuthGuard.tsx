"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

import { useAuth } from "./useAuth";
import type { Role } from "./types";

/**
 * Page-level auth guard HOC (access-control skill §3 — withAuthGuard).
 *
 * `src/middleware.ts` already blocks unauthenticated / unauthorized visits
 * before render (§8.1); this HOC is the client-side second line of defense:
 * it also covers client-side navigations and handles the "restoring session"
 * window without flashing protected content.
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: { roles?: Role[] }
) {
  const allowedRoles = options?.roles;

  function Guarded(props: P) {
    const { user, status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (status === "unauthenticated") {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      }
    }, [status, pathname, router]);

    if (status === "loading" || status === "unauthenticated") {
      return (
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        </div>
      );
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold">دسترسی غیرمجاز</h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            حساب کاربری شما اجازه‌ی مشاهده‌ی این بخش را ندارد.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  }

  Guarded.displayName = `withAuthGuard(${Component.displayName || Component.name || "Component"})`;
  return Guarded;
}
