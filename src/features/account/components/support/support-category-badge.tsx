"use client";

import {
  ShoppingBag,
  Layers,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  type SupportCategory,
  SUPPORT_CATEGORY_CONFIG,
} from "../../types/support";
import { cn } from "@/lib/utils";

interface SupportCategoryBadgeProps {
  category: SupportCategory;
  className?: string;
  showIcon?: boolean;
}

const CATEGORY_ICONS: Record<SupportCategory, React.ComponentType<{ className?: string }>> = {
  ORDER: ShoppingBag,
  PRODUCT: Layers,
  PAYMENT: CreditCard,
  SHIPPING: Truck,
  RETURN: RotateCcw,
  ACCOUNT: User,
  TECHNICAL: AlertTriangle,
  OTHER: HelpCircle,
};

export function SupportCategoryBadge({
  category,
  className,
  showIcon = true,
}: SupportCategoryBadgeProps) {
  const config =
    SUPPORT_CATEGORY_CONFIG[category] || SUPPORT_CATEGORY_CONFIG.OTHER;
  const IconComponent = CATEGORY_ICONS[category] || HelpCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/60",
        className
      )}
    >
      {showIcon && <IconComponent className="h-3 w-3 text-muted-foreground shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
