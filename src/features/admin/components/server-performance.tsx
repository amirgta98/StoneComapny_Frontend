import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ServerHealth } from "../types";

const statusConfig = {
  healthy: { icon: CheckCircle2, className: "text-emerald-600" },
  warning: { icon: AlertTriangle, className: "text-amber-600" },
  critical: { icon: XCircle, className: "text-destructive" },
} as const;

export function ServerPerformance({ server }: { server: ServerHealth }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>عملکرد سرور</CardTitle>
            <CardDescription>
              {server.region} · Node {server.nodeVersion} · آپ‌تایم {server.uptime}
            </CardDescription>
          </div>
          <Badge variant={server.status === "healthy" ? "secondary" : "destructive"}>
            {server.status === "healthy" ? "سالم" : server.status === "degraded" ? "کاهش عملکرد" : "از کار افتاده"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {server.metrics.map((metric) => {
            const config = statusConfig[metric.status];
            const Icon = config.icon;
            return (
              <li key={metric.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 shrink-0", config.className)} />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.detail}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold tabular-nums">{metric.value}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}