import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Kpi } from "../types";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const TrendIcon = kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;
  return (
    <Card>
      <CardContent className="space-y-2 p-6">
        <p className="text-sm text-muted-foreground">{kpi.label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{kpi.value}</span>
          {kpi.trend && kpi.trendValue ? (
            <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", kpi.trend === "up" && "text-emerald-600", kpi.trend === "down" && "text-destructive", kpi.trend === "flat" && "text-muted-foreground")}>
              <TrendIcon className="h-3 w-3" />
              {kpi.trendValue}
            </span>
          ) : null}
        </div>
        {kpi.hint ? <p className="text-xs text-muted-foreground">{kpi.hint}</p> : null}
      </CardContent>
    </Card>
  );
}