import { Building2, CheckCircle2, Clock, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { PlatformSummary } from "@/features/admin";

type Props = { summary: PlatformSummary };

export function TenantSummaryCards({ summary }: Props) {
  const items = [
    { id: "total", label: "کل شرکت‌ها", value: summary.totalTenants.toLocaleString("fa-IR"), icon: Building2 },
    { id: "active", label: "فعال", value: summary.activeTenants.toLocaleString("fa-IR"), icon: CheckCircle2 },
    { id: "pending", label: "در انتظار", value: summary.pendingTenants.toLocaleString("fa-IR"), icon: Clock },
    { id: "suspended", label: "مسدود", value: summary.suspendedTenants.toLocaleString("fa-IR"), icon: Ban },
  ];

  return (
    <section aria-label="خلاصه شرکت‌ها" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center gap-4 p-6">
            <item.icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}