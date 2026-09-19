"use client";

import { Laptop, Smartphone, Tablet, MapPin, Clock, LogOut, Check } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { UserSession } from "../../types/security";

type SessionItemProps = {
  session: UserSession;
  onRevoke: (session: UserSession) => void;
  isRevoking?: boolean;
};

export function SessionItem({
  session,
  onRevoke,
  isRevoking = false,
}: SessionItemProps) {
  const DeviceIcon =
    session.deviceType === "desktop"
      ? Laptop
      : session.deviceType === "tablet"
        ? Tablet
        : Smartphone;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between",
        session.isCurrent
          ? "border-primary/30 bg-primary/[0.02] shadow-xs dark:border-primary/20 dark:bg-primary/[0.04]"
          : "border-stone-200/80 bg-background hover:border-stone-300 dark:border-stone-800 dark:hover:border-stone-700"
      )}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            session.isCurrent
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
          )}
        >
          <DeviceIcon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              {session.browser}
            </h4>
            {session.isCurrent && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 border border-primary/20 bg-primary/10 text-[11px] font-medium text-primary"
              >
                <Check className="h-3 w-3" aria-hidden="true" />
                <span>این دستگاه</span>
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>{session.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>آخرین فعالیت: {session.lastActiveAt}</span>
            </span>
            <span className="hidden text-stone-400 sm:inline">•</span>
            <span className="hidden text-muted-foreground/80 sm:inline">
              ورود: {session.createdAt}
            </span>
          </div>
        </div>
      </div>

      {!session.isCurrent && (
        <div className="flex items-center justify-end pt-2 sm:pt-0">
          <Button
            variant="outline"
            size="sm"
            disabled={isRevoking}
            onClick={() => onRevoke(session)}
            className="h-8 gap-1.5 border-stone-200 text-xs text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive dark:border-stone-800 dark:hover:bg-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span>خروج از دستگاه</span>
          </Button>
        </div>
      )}
    </div>
  );
}
