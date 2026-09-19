import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layouts";
import { RequirePermission } from "@/auth";
import { getUsers } from "../queries";
import { UserSummaryCards } from "./user-summary-cards";
import { UsersTable } from "./users-table";

export async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        title="کاربران"
        description="مدیریت کاربران تمام شرکت‌های فعال در پلتفرم"
      >
        {/* UX-level gating (skill §8.2) — enforced server-side too, later. */}
        <RequirePermission permission="user:manage_all">
          <Button asChild>
            <a href="/superAdmin/users/new">
              <Plus className="h-4 w-4" />
              کاربر جدید
            </a>
          </Button>
        </RequirePermission>
      </PageHeader>

      <UserSummaryCards users={users} />

      <UsersTable users={users} />
    </div>
  );
}
