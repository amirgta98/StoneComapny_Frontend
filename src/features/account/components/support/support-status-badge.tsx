"use client";

import { Badge } from "@/components/ui";
import {
  type SupportStatus,
  SUPPORT_STATUS_CONFIG,
} from "../../types/support";
import { cn } from "@/lib/utils";

interface SupportStatusBadgeProps {
  status: SupportStatus;
  className?: string;
  showDot?: boolean;
}

export function SupportStatusBadge({
  status,
  className,
  showDot = true,
}: SupportStatusBadgeProps) {
  const config = SUPPORT_STATUS_CONFIG[status] || SUPPORT_STATUS_CONFIG.OPEN;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-2.5 py-0.5 text-[11px] font-medium transition-colors border",
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            config.dotClass
          )}
        />
      )}
      <span>{config.label}</span>
    </Badge>
  );
}
