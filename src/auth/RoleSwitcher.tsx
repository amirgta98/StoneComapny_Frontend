"use client";

import { Loader2, Repeat, ShieldCheck } from "lucide-react";

import { mockUsers } from "./mock/mockUsers";
import { useAuth } from "./useAuth";
import { ROLE_PERMISSIONS } from "./permissions";

/**
 * DEV-ONLY Role Switcher (access-control skill §7).
 *
 * Lets QA instantly switch between the four mock users without redoing the
 * OTP flow. Gated behind the NODE_ENV check (inlined at build time) AND
 * `__devCreateSessionForUser` throws outside development — a UI toggle alone
 * is never trusted. Delete this file during backend integration (§11.5).
 */
export function RoleSwitcher() {
  const { user, status, __devSetSession, logout } = useAuth();

  if (process.env.NODE_ENV !== "development") return null;
  if (status === "loading") {
    return (
      <div className="fixed bottom-3 left-3 z-50 rounded-xl border bg-background/95 p-3 shadow-lg">
        <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="fixed bottom-3 left-3 z-50 w-64 rounded-xl border bg-background/95 p-3 text-xs shadow-lg backdrop-blur"
    >
      <div className="mb-2 flex items-center gap-1.5 font-bold text-foreground">
        <Repeat className="size-3.5" aria-hidden="true" />
        تعویض سریع نقش (dev)
      </div>

      {user ? (
        <p className="mb-2 rounded-md bg-muted px-2 py-1.5 leading-relaxed">
          کاربر فعلی: <span className="font-medium">{user.name}</span>
          <span className="mx-1 text-muted-foreground">—</span>
          <span dir="ltr" className="font-mono">{user.role}</span>
        </p>
      ) : (
        <p className="mb-2 rounded-md bg-muted px-2 py-1.5 text-muted-foreground">
          کاربر مهمان — برای ورود سریع یکی را انتخاب کنید:
        </p>
      )}

      <div className="space-y-1">
        {mockUsers.map((mock) => {
          const isCurrent = user?.id === mock.id;
          return (
            <button
              key={mock.id}
              type="button"
              disabled={isCurrent}
              onClick={() => __devSetSession(mock)}
              className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-start transition-colors ${
                isCurrent
                  ? "cursor-default bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <span>
                {mock.name}
                <span className="block text-[10px] text-muted-foreground" dir="ltr">
                  {mock.phone} · {mock.tenantId ?? "global"}
                </span>
              </span>
              <span dir="ltr" className="font-mono text-[10px]">
                {mock.role}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 border-t pt-2">
        {user ? (
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-md px-2 py-1.5 text-start text-destructive transition-colors hover:bg-destructive/10"
          >
            خروج از حساب
          </button>
        ) : null}
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mb-0.5 ml-0.5 inline size-3" aria-hidden="true" />
          مجوزهای نقش فعال: {user ? ROLE_PERMISSIONS[user.role].length : 0}
        </p>
      </div>
    </div>
  );
}
