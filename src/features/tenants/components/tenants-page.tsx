import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layouts";
import { RequirePermission } from "@/auth";
import { getTenants } from "../queries";
import { getAdminDashboardData } from "@/features/admin/data/dashboard";
import { TenantSummaryCards } from "./tenant-summary-cards";
import { TenantsTable } from "./tenants-table";

export async function TenantsPage() {
  const [tenants, dashboard] = await Promise.all([getTenants(), getAdminDashboardData()]);

  return (
    <div className="space-y-8">
      <PageHeader title="شرکت‌ها" description="مدیریت تمام شرکت‌های فعال در پلتفرم">
        {/* UX-level gating (skill §8.2) — enforced server-side too, later. */}
        <RequirePermission permission="tenant:create">
          <Button asChild>
            <a href="/superAdmin/tenants/new">
              <Plus className="h-4 w-4" />
              شرکت جدید
            </a>
          </Button>
        </RequirePermission>
      </PageHeader>

      <TenantSummaryCards summary={dashboard.summary} />

      <TenantsTable tenants={tenants} />
    </div>
  );
}