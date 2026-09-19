"use client";

import { Laptop, Smartphone, Tablet, MapPin, Clock, LogOut, CheckCircle2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { Session } from "../../types/security";

interface SessionCardProps {
  session: Session;
  onLogoutClick: (session: Session) => void;
}

export function SessionCard({ session, onLogoutClick }: SessionCardProps) {
  const getDeviceIcon = () => {
    switch (session.deviceType) {
      case "mobile":
        return <Smartphone className="h-5 w-5" aria-hidden="true" />;
      case "tablet":
        return <Tablet className="h-5 w-5" aria-hidden="true" />;
      case "desktop":
      default:
        return <Laptop className="h-5 w-5" aria-hidden="true" />;
    }
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
        session.isCurrent
          ? "bg-primary/[0.03] border-primary/30 shadow-sm ring-1 ring-primary/10"
          : "bg-card border-border/70 hover:border-border hover:shadow-sm"
      }`}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
            session.isCurrent
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {getDeviceIcon()}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">
              {session.deviceTitle}
            </h4>

            {session.isCurrent && (
              <Badge
                variant="outline"
                className="gap-1 bg-primary/10 text-primary border-primary/30 text-[11px] font-medium py-0 px-2"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>این دستگاه</span>
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{session.location}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>آخرین فعالیت: {session.lastActiveAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        {session.isCurrent ? (
          <span className="text-xs text-muted-foreground font-medium py-1.5 px-3 rounded-md bg-muted/40">
            جلسه فعال کنونی
          </span>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onLogoutClick(session)}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 transition-all duration-150 active:scale-[0.98]"
          >
            <LogOut className="h-3.5 w-3.5 rtl:rotate-180" />
            <span>خروج از دستگاه</span>
          </Button>
        )}
      </div>
    </div>
  );
}
