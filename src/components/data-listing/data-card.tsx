import React from "react";

type DataCardProps = {
  header: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Generic card component for displaying data items.
 * Used across all listing pages (users, tenants, etc).
 * Mobile-optimized layout.
 */
export function DataCard({ header, subtitle, badge, children }: DataCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{header}</div>
          {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
        </div>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
      {children}
    </div>
  );
}
