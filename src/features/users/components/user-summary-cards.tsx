import { Users, UserCheck, UserX, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { User } from "@/types";

type Props = { users: User[] };

export function UserSummaryCards({ users }: Props) {
  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const inactive = users.filter((u) => u.status === "inactive").length;
  const suspended = users.filter((u) => u.status === "suspended").length;

  const items = [
    { id: "total", label: "کل کاربران", value: total.toLocaleString("fa-IR"), icon: Users },
    { id: "active", label: "فعال", value: active.toLocaleString("fa-IR"), icon: UserCheck },
    { id: "inactive", label: "غیرفعال", value: inactive.toLocaleString("fa-IR"), icon: UserX },
    { id: "suspended", label: "مسدود", value: suspended.toLocaleString("fa-IR"), icon: Ban },
  ];

  return (
    <section aria-label="خلاصه کاربران" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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