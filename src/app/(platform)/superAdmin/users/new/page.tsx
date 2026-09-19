import { CreateUserForm } from "@/features/users/components/create-user-form";
import { getTenants } from "@/features/tenants/queries";
import { PageHeader } from "@/components/layouts";

export default async function UserNewPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-8">
      <PageHeader
        title="کاربر جدید"
        description="اطلاعات کاربر جدید را برای ایجاد در سیستم وارد کنید"
      />
      <CreateUserForm tenants={tenants} />
    </div>
  );
}