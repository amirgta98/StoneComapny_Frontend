import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { TenantStatus } from "@/types";

type TenantPreview = {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
};

const statusVariant: Record<TenantStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
  deleted: "outline",
};

const statusLabel: Record<TenantStatus, string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "مسدود",
  deleted: "حذف‌شده",
};

export function TenantListPreview({ tenants }: { tenants: TenantPreview[] }) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>شرکت‌های اخیر</CardTitle>
          <CardDescription>هنوز شرکتی ثبت نشده است</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>شرکت‌های اخیر</CardTitle>
        <CardDescription>آخرین شرکت‌های ثبت‌شده در پلتفرم</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {tenants.map((tenant) => (
            <li key={tenant.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm font-medium">{tenant.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {tenant.domain ?? tenant.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={statusVariant[tenant.status]}>{statusLabel[tenant.status]}</Badge>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/superAdmin/tenants/${tenant.id}`}>
                    مدیریت
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}