import { Badge } from "@/components/ui";
import { tenantStatusLabel, tenantStatusVariant } from "../constants";
import type { Tenant } from "@/types";

type TenantCardProps = {
  tenant: Tenant;
};

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{tenant.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{tenant.slug}</p>
        </div>
        <Badge variant={tenantStatusVariant[tenant.status]}>
          {tenantStatusLabel[tenant.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">دامنه</p>
          <p className="font-medium truncate">{tenant.domain || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ایجاد شد</p>
          <p className="font-medium">
            {new Date(tenant.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      </div>

      {tenant.subdomain && (
        <div className="text-xs">
          <p className="text-muted-foreground">پیشوند</p>
          <p className="font-medium truncate">{tenant.subdomain}</p>
        </div>
      )}
    </div>
  );
}
