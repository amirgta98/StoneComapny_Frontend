"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, MoreHorizontal, Power, Palette } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui";
import { DataListView, ListingHeader, EmptyState, DataCard } from "@/components/data-listing";
import { RequirePermission } from "@/auth";
import { tenantStatusLabel, tenantStatusVariant } from "../constants";
import { updateTenantStatus } from "../actions";
import type { Tenant, TenantStatus } from "@/types";

type SortKey = "name" | "createdAt";

export function TenantsTable({ tenants }: { tenants: Tenant[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TenantStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Filter and sort data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tenants
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) =>
        q === ""
          ? true
          : t.name.toLowerCase().includes(q) ||
            t.slug.toLowerCase().includes(q) ||
            (t.domain ?? "").toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const cmp =
          sortKey === "name"
            ? a.name.localeCompare(b.name, "fa")
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [tenants, query, status, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleDeactivate(tenant: Tenant) {
    const nextStatus: TenantStatus =
      tenant.status === "suspended" ? "active" : "suspended";
    await updateTenantStatus(tenant.id, nextStatus);
    router.refresh();
  }

  function handleEditTheme(tenant: Tenant) {
    router.push(`/superAdmin/tenants/new?tenant=${tenant.id}`);
  }

  const filters = [
    {
      key: "status",
      label: "وضعیت",
      value: status,
      onChange: (v: string | undefined) => setStatus((v || "all") as TenantStatus | "all"),
      options: [
        { value: "all", label: "همه وضعیت‌ها" },
        { value: "active", label: "فعال" },
        { value: "pending", label: "در انتظار" },
        { value: "suspended", label: "مسدود" },
        { value: "deleted", label: "حذف‌شده" },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>شرکت‌ها</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Listing Header with Search and Filters */}
        <ListingHeader
          searchValue={query}
          searchPlaceholder="جستجو بر اساس نام، slug یا دامنه..."
          onSearchChange={setQuery}
          filters={filters}
        />

        {/* Empty State */}
        {filtered.length === 0 ? (
          <EmptyState
            title="شرکتی یافت نشد"
            description="فیلترها یا عبارت جستجو را تغییر دهید."
          />
        ) : (
          <DataListView
            cardView={
              <div className="grid gap-3">
                {filtered.map((tenant) => (
                  <DataCard
                    key={tenant.id}
                    header={tenant.name}
                    subtitle={tenant.slug}
                    badge={
                      <div className="flex gap-1 items-center">
                        <Badge variant={tenantStatusVariant[tenant.status]}>
                          {tenantStatusLabel[tenant.status]}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="p-1 rounded-md hover:bg-muted transition-colors"
                              aria-label="عملیات"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditTheme(tenant)}
                            >
                              <Palette className="h-4 w-4 ml-2" />
                              ویرایش تم
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(tenant)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Power className="h-4 w-4 ml-2" />
                              {tenant.status === "suspended"
                                ? "فعال کردن"
                                : "غیرفعال کردن"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    }
                  >
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
                        دامنه
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
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium">{tenant.name}</td>
                        <td className="px-4 py-3 text-muted-foreground" dir="ltr">
                          {tenant.domain ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={tenantStatusVariant[tenant.status]}>
                            {tenantStatusLabel[tenant.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(tenant.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="p-1 rounded-md hover:bg-muted transition-colors"
                                aria-label="عملیات"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <RequirePermission permission="storefront:manage_all">
                                <DropdownMenuItem onClick={() => handleEditTheme(tenant)}>
                                  <Palette className="h-4 w-4 ml-2" />
                                  ویرایش تم
                                </DropdownMenuItem>
                              </RequirePermission>
                              <RequirePermission permission="tenant:manage_all">
                                <DropdownMenuItem
                                  onClick={() => handleDeactivate(tenant)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Power className="h-4 w-4 ml-2" />
                                  {tenant.status === "suspended"
                                    ? "فعال کردن"
                                    : "غیرفعال کردن"}
                                </DropdownMenuItem>
                              </RequirePermission>
                            </DropdownMenuContent>
                          </DropdownMenu>
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