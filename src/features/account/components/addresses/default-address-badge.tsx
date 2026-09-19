"use client";

import { Truck, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DefaultAddressBadgeProps {
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function DefaultAddressBadge({
  isDefaultShipping,
  isDefaultBilling,
  className,
  size = "default",
}: DefaultAddressBadgeProps) {
  if (!isDefaultShipping && !isDefaultBilling) return null;

  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {isDefaultShipping && (
        <Badge
          variant="outline"
          className={cn(
            "border-primary/25 bg-primary/10 font-medium text-primary",
            isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          )}
        >
          <Truck className={cn("me-1 text-primary", isSmall ? "h-3 w-3" : "h-3.5 w-3.5")} />
          <span>پیش‌فرض ارسال</span>
        </Badge>
      )}

      {isDefaultBilling && (
        <Badge
          variant="outline"
          className={cn(
            "border-border bg-secondary font-medium text-secondary-foreground",
            isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          )}
        >
          <ReceiptText className={cn("me-1 text-muted-foreground", isSmall ? "h-3 w-3" : "h-3.5 w-3.5")} />
          <span>پیش‌فرض صورت‌حساب</span>
        </Badge>
      )}
    </div>
  );
}
