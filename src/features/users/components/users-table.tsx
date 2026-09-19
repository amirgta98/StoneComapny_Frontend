"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataListView, ListingHeader, EmptyState, DataCard } from "@/components/data-listing";
import { userRoleLabel, userRoleVariant, userStatusLabel, userStatusVariant } from "../constants";
import type { User, UserRole, UserStatus } from "@/types";

type SortKey = "name" | "email" | "createdAt";

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [tenantFilter, setTenantFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Get unique tenant names for filter
  const tenants = useMemo(() => {
    const uniqueTenants = Array.from(new Map(users.map((u) => [u.tenantId, u.tenantName])).entries());
    return uniqueTenants.map(([id, name]) => ({ id, name: name || id }));
  }, [users]);

  // Filter and sort data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => (role === "all" ? true : u.role === role))
      .filter((u) => (status === "all" ? true : u.status === status))
      .filter((u) => (tenantFilter === "all" ? true : u.tenantId === tenantFilter))
      .filter((u) => (q === "" ? true : u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)))
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") {
          cmp = a.name.localeCompare(b.name, "fa");
        } else if (sortKey === "email") {
          cmp = a.email.localeCompare(b.email);
        } else {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [users, query, role, status, tenantFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filters = [
    {
      key: "tenant",
      label: "شرکت",
      value: tenantFilter,
      onChange: (v: string | undefined) => setTenantFilter(v || "all"),
      options: [
        { value: "all", label: "تمام شرکت‌ها" },
        ...tenants.map((t) => ({ value: t.id, label: t.name })),
      ],
    },
    {
      key: "role",
      label: "نقش",
      value: role,
      onChange: (v: string | undefined) => setRole((v || "all") as UserRole | "all"),
      options: [
        { value: "all", label: "تمام نقش‌ها" },
        { value: "super_admin", label: "سوپر ادمین" },
        { value: "admin", label: "مدیر" },
        { value: "user", label: "کاربر" },
      ],
    },
    {
      key: "status",
      label: "وضعیت",
      value: status,
      onChange: (v: string | undefined) => setStatus((v || "all") as UserStatus | "all"),
      options: [
        { value: "all", label: "تمام وضعیت‌ها" },
        { value: "active", label: "فعال" },
        { value: "inactive", label: "غیرفعال" },
        { value: "suspended", label: "مسدود" },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>کاربران</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Listing Header with Search and Filters */}
        <ListingHeader
          searchValue={query}
          searchPlaceholder="جستجو بر اساس نام یا ایمیل..."
          onSearchChange={setQuery}
          filters={filters}
        />

        {/* Empty State */}
        {filtered.length === 0 ? (
          <EmptyState
            title="کاربری یافت نشد"
            description="فیلترها یا عبارت جستجو را تغییر دهید."
          />
        ) : (
          <DataListView
            cardView={
              <div className="grid gap-3">
                {filtered.map((user) => (
                  <DataCard
                    key={user.id}
                    header={user.name}
                    subtitle={user.email}
                    badge={
                      <div className="flex gap-1">
                        <Badge variant={userRoleVariant[user.role]} className="text-xs">
                          {userRoleLabel[user.role]}
                        </Badge>
                        <Badge variant={userStatusVariant[user.status]} className="text-xs">
                          {userStatusLabel[user.status]}
                        </Badge>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">شرکت</p>
                        <p className="font-medium">{user.tenantName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ایجاد شد</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      {user.lastLogin && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">آخرین ورود</p>
                          <p className="font-medium">
                            {new Date(user.lastLogin).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                      )}
                    </div>
                  </DataCard>
                ))}
              </div>
            }
            tableView={
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50 text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        <button
                          type="button"
                          onClick={() => toggleSort("name")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          نام
                          <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        <button
                          type="button"
                          onClick={() => toggleSort("email")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          ایمیل
                          <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        شرکت
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        نقش
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        وضعیت
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        <button
                          type="button"
                          onClick={() => toggleSort("createdAt")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          ایجاد
                          <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-start font-medium">
                        آخرین ورود
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-muted-foreground" dir="ltr">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm">{user.tenantName || "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={userRoleVariant[user.role]} className="text-xs">
                            {userRoleLabel[user.role]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={userStatusVariant[user.status]} className="text-xs">
                            {userStatusLabel[user.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fa-IR") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            footer={
              <p className="text-xs text-muted-foreground">
                {filtered.length.toLocaleString("fa-IR")} مورد
              </p>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}