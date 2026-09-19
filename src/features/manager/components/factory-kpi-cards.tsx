"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingBag,
  FileSpreadsheet,
  Package,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FactoryKpi } from "../types";

const ICON_MAP = {
  "kpi-rev": TrendingUp,
  "kpi-orders": Layers,
  "kpi-inquiries": FileSpreadsheet,
  "kpi-inventory": Package,
};

export function FactoryKpiCards({ kpis }: { kpis: FactoryKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = ICON_MAP[kpi.id as keyof typeof ICON_MAP] || ShoppingBag;

        return (
          <Card
            key={kpi.id}
            className="group relative overflow-hidden border border-border/80 bg-card shadow-2xs hover:shadow-sm transition-all duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {kpi.label}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                  {kpi.value}
                </p>
                {kpi.hint && (
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {kpi.hint}
                  </p>
                )}
              </div>

              {kpi.trendValue && (
                <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-border/50 text-[11px]">
                  {kpi.trend === "up" && (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  )}
                  {kpi.trend === "down" && (
                    <TrendingDown className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  )}
                  {kpi.trend === "flat" && (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      kpi.trend === "up" && "text-emerald-700 dark:text-emerald-400",
                      kpi.trend === "down" && "text-amber-700 dark:text-amber-400",
                      kpi.trend === "flat" && "text-muted-foreground"
                    )}
                  >
                    {kpi.trendValue}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
