"use client";

import { useMemo } from "react";
import {
  Plus,
  RotateCcw,
  Edit2,
  Trash2,
  Layers,
  Power,
  Calendar,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ListingHeader,
  DataListView,
  DataCard,
  EmptyState,
} from "@/components/data-listing";
import { toast } from "sonner";
import { useDiscountsStore } from "../stores/discounts-store";
import {
  formatToman,
  formatPersianDate,
  formatPersianNumber,
  getDiscountValueDisplay,
  isDiscountExpired,
} from "../lib/discount-utils";
import { DiscountsStats } from "./discounts-stats";
import { DiscountFormDialog } from "./discount-form-dialog";
import { DiscountDeleteDialog } from "./discount-delete-dialog";
import { DiscountTargetDialog } from "./discount-target-dialog";
import type { Discount } from "../types";

export function DiscountsManagerView() {
  const {
    discounts,
    searchQuery,
    statusFilter,
    typeFilter,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openTargetDialog,
    toggleStatus,
    resetToMockData,
    getStats,
  } = useDiscountsStore();

  const stats = useMemo(() => getStats(), [discounts, getStats]);

  // Filter discounts
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      const isExpired = isDiscountExpired(discount);
      const effectiveStatus = isExpired ? "expired" : discount.status.toLowerCase();

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = discount.name.toLowerCase().includes(query);
        const matchesCode = discount.code.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) return false;
      }

      // Status match
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) {
        return false;
      }

      // Type match
      if (typeFilter !== "all" && discount.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [discounts, searchQuery, statusFilter, typeFilter]);

  const handleToggleStatus = (discount: Discount) => {
    const res = toggleStatus(discount.id);
    if (res.success) {
      if (res.newStatus === "ACTIVE") {
        toast.success(`تخفیف «${discount.name}» فعال شد`);
      } else {
        toast.info(`تخفیف «${discount.name}» به حالت غیرفعال تغییر یافت`);
      }
    } else {
      toast.error(res.error || "خطا در تغییر وضعیت تخفیف");
    }
  };

  const filters = [
    {
      key: "status",
      label: "وضعیت",
      value: statusFilter,
      onChange: (v: string | undefined) =>
        setStatusFilter((v as "all" | "active" | "inactive" | "expired") || "all"),
      options: [
        { value: "all", label: "همه وضعیت‌ها" },
        { value: "active", label: "فعال" },
        { value: "inactive", label: "غیرفعال" },
        { value: "expired", label: "منقضی شده" },
      ],
    },
    {
      key: "type",
      label: "نوع تخفیف",
      value: typeFilter,
      onChange: (v: string | undefined) =>
        setTypeFilter((v as "all" | "PERCENTAGE" | "FIXED") || "all"),
      options: [
        { value: "all", label: "همه نوع‌ها" },
        { value: "PERCENTAGE", label: "درصدی" },
        { value: "FIXED", label: "مبلغ ثابت" },
      ],
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">مدیریت تخفیف‌ها و کوپن‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">
            ایجاد، ویرایش و پایش کدهای تخفیف، جشنواره‌های فصلی و طرح‌های حمایتی کارخانه سنگ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToMockData}
            title="بازیابی مقادیر اولیه نمونه"
            className="text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 ml-1.5" />
            نمونه‌ها
          </Button>
          <Button onClick={openCreateDialog} size="sm" className="text-xs font-medium">
            <Plus className="h-4 w-4 ml-1.5" />
            تخفیف جدید
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <DiscountsStats stats={stats} />

      {/* Main Listing Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">فهرست تخفیف‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filters */}
          <ListingHeader
            searchValue={searchQuery}
            searchPlaceholder="جستجو بر اساس عنوان یا کد کوپن..."
            onSearchChange={setSearchQuery}
            filters={filters}
          />

          {/* Empty State */}
          {filteredDiscounts.length === 0 ? (
            <EmptyState
              title="تخفیفی یافت نشد"
              description="با تغییر عبارت جستجو یا تنظیم فیلترهای دیگر، نتایج را بررسی کنید."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              }
            />
          ) : (
            /* Responsive Data View: Mobile Cards + Desktop Table */
            <DataListView
              cardView={
                <div className="grid gap-3">
                  {filteredDiscounts.map((discount) => {
                    const isExpired = isDiscountExpired(discount);
                    const isActive = !isExpired && discount.status === "ACTIVE";

                    return (
                      <DataCard
                        key={discount.id}
                        header={discount.name}
                        subtitle={
                          <span className="flex items-center gap-1 font-mono text-xs text-primary" dir="ltr">
                            <Ticket className="h-3 w-3" />
                            {discount.code}
                          </span>
                        }
                        badge={
                          isExpired ? (
                            <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-xs">
                              منقضی شده
                            </Badge>
                          ) : isActive ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                              فعال
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              غیرفعال
                            </Badge>
                          )
                        }
                      >
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">میزان تخفیف: </span>
                              <span className="font-semibold text-primary">
                                {getDiscountValueDisplay(discount)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">نوع: </span>
                              <span>{discount.type === "PERCENTAGE" ? "درصدی" : "مبلغ ثابت"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">حداقل خرید: </span>
                              <span>{formatToman(discount.minPurchaseAmount)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">دفعات استفاده: </span>
                              <span>
                                {formatPersianNumber(discount.usedCount)}
                                {discount.usageLimit ? ` از ${formatPersianNumber(discount.usageLimit)}` : " بار"}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>
                              اعتبار: {formatPersianDate(discount.startAt)} تا {formatPersianDate(discount.endAt)}
                            </span>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              disabled={isExpired}
                              onClick={() => handleToggleStatus(discount)}
                              title={isActive ? "غیرفعال کردن" : "فعال کردن"}
                            >
                              <Power className={`h-3.5 w-3.5 ml-1 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`} />
                              {isActive ? "غیرفعال" : "فعال‌سازی"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={() => openTargetDialog(discount)}
                              title="تخصیص سنگ و دسته‌بندی"
                            >
                              <Layers className="h-3.5 w-3.5 ml-1" />
                              دامنه
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs"
                              onClick={() => openEditDialog(discount)}
                              title="ویرایش تخفیف"
                            >
                              <Edit2 className="h-3.5 w-3.5 ml-1" />
                              ویرایش
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(discount)}
                              title="حذف تخفیف"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </DataCard>
                    );
                  })}
                </div>
              }
              tableView={
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted/60 text-xs text-muted-foreground font-medium">
                      <tr>
                        <th className="p-3">عنوان و کد کوپن</th>
                        <th className="p-3">میزان تخفیف</th>
                        <th className="p-3">نوع</th>
                        <th className="p-3">حداقل خرید</th>
                        <th className="p-3">دوره اعتبار</th>
                        <th className="p-3">استفاده</th>
                        <th className="p-3">وضعیت</th>
                        <th className="p-3 text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredDiscounts.map((discount) => {
                        const isExpired = isDiscountExpired(discount);
                        const isActive = !isExpired && discount.status === "ACTIVE";

                        return (
                          <tr key={discount.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3">
                              <div className="font-medium text-foreground">{discount.name}</div>
                              <div className="flex items-center gap-1 text-xs text-primary font-mono mt-0.5" dir="ltr">
                                <Ticket className="h-3 w-3" />
                                {discount.code}
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-primary">
                              {getDiscountValueDisplay(discount)}
                            </td>
                            <td className="p-3 text-xs text-muted-foreground">
                              {discount.type === "PERCENTAGE" ? "درصدی" : "مبلغ ثابت"}
                            </td>
                            <td className="p-3 text-xs">
                              {formatToman(discount.minPurchaseAmount)}
                            </td>
                            <td className="p-3 text-xs text-muted-foreground">
                              <div>از {formatPersianDate(discount.startAt)}</div>
                              <div>تا {formatPersianDate(discount.endAt)}</div>
                            </td>
                            <td className="p-3 text-xs">
                              <span className="font-medium">{formatPersianNumber(discount.usedCount)}</span>
                              {discount.usageLimit && (
                                <span className="text-muted-foreground"> / {formatPersianNumber(discount.usageLimit)}</span>
                              )}
                            </td>
                            <td className="p-3">
                              {isExpired ? (
                                <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-xs">
                                  منقضی شده
                                </Badge>
                              ) : isActive ? (
                                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                                  فعال
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  غیرفعال
                                </Badge>
                              )}
                            </td>
                            <td className="p-3 text-left">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={isExpired}
                                  onClick={() => handleToggleStatus(discount)}
                                  title={isActive ? "غیرفعال کردن" : "فعال کردن"}
                                >
                                  <Power
                                    className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openTargetDialog(discount)}
                                  title="تخصیص محصولات و دسته‌بندی‌ها"
                                >
                                  <Layers className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openEditDialog(discount)}
                                  title="ویرایش"
                                >
                                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => openDeleteDialog(discount)}
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              }
              footer={
                <div className="text-xs text-muted-foreground">
                  نمایش {formatPersianNumber(filteredDiscounts.length)} از {formatPersianNumber(discounts.length)} مورد
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Modal Dialogs */}
      <DiscountFormDialog />
      <DiscountDeleteDialog />
      <DiscountTargetDialog />
    </div>
  );
}
