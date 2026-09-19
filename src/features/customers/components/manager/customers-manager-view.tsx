"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  HardHat,
  Compass,
  Store,
  UserCheck,
  Search,
  Plus,
  FileSpreadsheet,
  Printer,
  Phone,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowUpDown,
  CreditCard,
  MapPin,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { DataListView, ListingHeader, EmptyState, DataCard } from "@/components/data-listing";
import {
  useFactoryCustomersStore,
} from "../../stores/factory-customers-store";
import { CustomerFormDialog } from "./customer-form-dialog";
import { exportCustomersToCSV, ROLE_LABELS, CREDIT_STATUS_LABELS } from "../../lib/export-customers";
import type { FactoryCustomer, CustomerRole, CreditStatus } from "../../types";

function normalizeQuery(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim()
    .toLowerCase();
}

type RoleFilterTab = "all" | CustomerRole;

const ROLE_ICONS: Record<CustomerRole, typeof Users> = {
  CONTRACTOR: HardHat,
  ARCHITECT: Compass,
  SHOWROOM: Store,
  RETAIL: Users,
};

const ROLE_BADGE_VARIANTS: Record<
  CustomerRole,
  { label: string; className: string }
> = {
  CONTRACTOR: {
    label: "پیمانکار و مجری",
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  },
  ARCHITECT: {
    label: "معمار و طراح",
    className: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  },
  SHOWROOM: {
    label: "نمایشگاه سنگ",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  RETAIL: {
    label: "خریدار خرد / شخصی",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
};

const CREDIT_BADGE_CONFIG: Record<
  CreditStatus,
  { label: string; className: string; icon: typeof ShieldCheck }
> = {
  safe: {
    label: "اعتبار مجاز",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: ShieldCheck,
  },
  warning: {
    label: "نزدیک به سقف",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  blocked: {
    label: "مسدود اعتباری",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: ShieldAlert,
  },
};

export function CustomersManagerView() {
  const { user } = useAuth();
  const activeTenantId = user?.tenantId ?? "tenant-001";

  const customers = useFactoryCustomersStore((s) => s.customers);
  const getStats = useFactoryCustomersStore((s) => s.getStats);
  const addCustomer = useFactoryCustomersStore((s) => s.addCustomer);
  const updateCustomer = useFactoryCustomersStore((s) => s.updateCustomer);
  const deleteCustomer = useFactoryCustomersStore((s) => s.deleteCustomer);
  const resetToMockData = useFactoryCustomersStore((s) => s.resetToMockData);

  // Scoped customers for active tenant
  const tenantCustomers = useMemo(() => {
    return customers.filter(
      (c) => c.tenantId === activeTenantId || (!c.tenantId && activeTenantId === "tenant-001")
    );
  }, [customers, activeTenantId]);

  const stats = useMemo(() => {
    return getStats(activeTenantId);
  }, [getStats, activeTenantId, customers]);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<FactoryCustomer | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilterTab>("all");
  const [selectedCreditStatus, setSelectedCreditStatus] = useState<string>("all");
  const [selectedStone, setSelectedStone] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "balance_high" | "sqm_high" | "name">("newest");

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: tenantCustomers.length,
      CONTRACTOR: 0,
      ARCHITECT: 0,
      SHOWROOM: 0,
      RETAIL: 0,
    };
    tenantCustomers.forEach((c) => {
      if (counts[c.role] !== undefined) {
        counts[c.role] += 1;
      }
    });
    return counts;
  }, [tenantCustomers]);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return tenantCustomers
      .filter((c) => {
        // Role Tab Filter
        if (selectedRole !== "all" && c.role !== selectedRole) {
          return false;
        }

        // Credit Status Filter
        if (selectedCreditStatus !== "all" && c.creditStatus !== selectedCreditStatus) {
          return false;
        }

        // Stone Variety Filter
        if (selectedStone !== "all" && !(c.preferredStones || []).includes(selectedStone)) {
          return false;
        }

        // Text Search with full digit and character normalization
        if (searchQuery.trim()) {
          const q = normalizeQuery(searchQuery);
          const matchName = normalizeQuery(c.name).includes(q);
          const matchCode = normalizeQuery(c.code).includes(q);
          const matchPhone = normalizeQuery(c.phone).includes(q);
          const matchCompany = c.companyName ? normalizeQuery(c.companyName).includes(q) : false;
          const matchProject = c.projectName ? normalizeQuery(c.projectName).includes(q) : false;
          const matchCity = normalizeQuery(c.city).includes(q);

          if (!matchName && !matchCode && !matchPhone && !matchCompany && !matchProject && !matchCity) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "balance_high") return b.currentBalance - a.currentBalance;
        if (sortBy === "sqm_high") return b.totalPurchasedSqm - a.totalPurchasedSqm;
        if (sortBy === "name") return a.name.localeCompare(b.name, "fa");
        return b.id.localeCompare(a.id); // Default newest
      });
  }, [tenantCustomers, selectedRole, selectedCreditStatus, selectedStone, searchQuery, sortBy]);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setFormDialogOpen(true);
  };

  const handleEditCustomer = (customer: FactoryCustomer) => {
    setEditingCustomer(customer);
    setFormDialogOpen(true);
  };

  const handleFormSave = (customerData: any) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
  };

  const handleDeleteCustomer = (customer: FactoryCustomer) => {
    if (
      window.confirm(
        `آیا از حذف پرونده مشتری «${customer.name}» با کد ${customer.code} اطمینان دارید؟`
      )
    ) {
      deleteCustomer(customer.id);
      toast.success(`پرونده مشتری «${customer.name}» با موفقیت حذف شد.`);
    }
  };

  const handleResetMock = () => {
    if (
      window.confirm("آیا از بازنشانی داده‌های مشتریان به نمونه‌های اولیه اطمینان دارید؟")
    ) {
      resetToMockData();
      toast.success("اطلاعات اولیه مشتریان با موفقیت بازنشانی شد.");
    }
  };

  const handleExportCSV = () => {
    exportCustomersToCSV(filteredCustomers, `stone-customers-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCreditStatus !== "all" ||
    selectedStone !== "all" ||
    selectedRole !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedCreditStatus("all");
    setSelectedStone("all");
    setSortBy("newest");
  };

  // Filters for ListingHeader
  const headerFilters = [
    {
      key: "creditStatus",
      label: "وضعیت اعتبار",
      value: selectedCreditStatus,
      onChange: (v: string | undefined) => setSelectedCreditStatus(v || "all"),
      options: [
        { value: "all", label: "همه وضعیت‌های اعتباری" },
        { value: "safe", label: "معتبر (سقف باز)" },
        { value: "warning", label: "نزدیک به سقف اعتبار" },
        { value: "blocked", label: "مسدود اعتباری" },
      ],
    },
    {
      key: "stoneVariety",
      label: "سنگ پرمصرف",
      value: selectedStone,
      onChange: (v: string | undefined) => setSelectedStone(v || "all"),
      options: [
        { value: "all", label: "همه انواع سنگ" },
        { value: "مرمریت", label: "مرمریت" },
        { value: "تراورتن", label: "تراورتن" },
        { value: "گرانیت", label: "گرانیت" },
        { value: "مرمر / آنیکس", label: "مرمر / آنیکس" },
        { value: "لایم‌استون", label: "لایم‌استون" },
        { value: "چینی و کریستال", label: "چینی و کریستال" },
      ],
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Printable Report Header (Visible only when printed) */}
      <div className="hidden print:block border-b-2 border-zinc-900 pb-4 mb-4 text-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">گزارش جامع مشتریان و طرف‌های قرارداد کارخانه سنگ</h1>
            <p className="text-xs text-zinc-600 mt-1">
              مدیریت حساب‌های B2B، متراژ سنگ خریداری‌شده، وضعیت اعتباری و پروژه‌های فعال
            </p>
          </div>
          <div className="text-left text-xs text-zinc-600 space-y-1">
            <p>تاریخ گزارش: {new Date().toLocaleDateString("fa-IR")}</p>
            <p>تعداد مشتریان: {filteredCustomers.length.toLocaleString("fa-IR")} پرونده</p>
          </div>
        </div>
      </div>

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                مشتریان، پیمانکاران و معماران کارخانه
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                مدیریت جامع حساب‌های B2B، اعتبارسنجی سقف بدهی، چک‌های صیادی و متراژ سنگ‌های پرمصرف
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetMock}
            className="gap-1 text-xs h-9 text-muted-foreground hover:text-foreground"
            title="بازنشانی اطلاعات به نمونه‌های اولیه"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">بازنشانی پیش‌فرض</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs h-9"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>خروجی اکسل / CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs h-9"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>چاپ گزارش</span>
          </Button>

          <Button
            size="sm"
            onClick={handleCreateCustomer}
            className="gap-1.5 text-xs h-9 font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>ثبت مشتری جدید</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Customers */}
        <Card className="border-border/70 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">کل مخاطبان و مشتریان</p>
              <div className="text-2xl font-bold tracking-tight">
                {stats.totalCustomers.toLocaleString("fa-IR")}
              </div>
              <p className="text-[11px] text-muted-foreground">
                شامل پیمانکاران، معماران و خریداران
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active B2B Contractors & Architects */}
        <Card className="border-border/70 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">همکاران پروژه‌ای و B2B</p>
              <div className="text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
                {(stats.contractorsCount + stats.architectsCount + stats.showroomsCount).toLocaleString("fa-IR")}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {stats.contractorsCount.toLocaleString("fa-IR")} پیمانکار + {stats.architectsCount.toLocaleString("fa-IR")} معمار
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <HardHat className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Total Stone Volume Purchased (sqm) */}
        <Card className="border-border/70 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">مجموع متراژ خریداری‌شده</p>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.totalPurchasedSqm.toLocaleString("fa-IR")} <span className="text-sm font-normal text-muted-foreground">م²</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                تأمین انواع اسلب و تایل ساختمانی
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Total Active Receivables & Pending Checks */}
        <Card className="border-border/70 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">مانده بدهی و چک‌های جاری</p>
              <div className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {(stats.totalActiveReceivables / 1_000_000).toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted-foreground">م.ت</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                چک‌های در جریان: {(stats.totalPendingChecks / 1_000_000).toLocaleString("fa-IR")} م.ت
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Role Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/70 pb-2 scrollbar-none print:hidden">
        {[
          { key: "all", label: "همه مخاطبان", icon: Users, count: tabCounts.all },
          { key: "CONTRACTOR", label: "پیمانکاران و مجریان", icon: HardHat, count: tabCounts.CONTRACTOR },
          { key: "ARCHITECT", label: "معماران و طراحان", icon: Compass, count: tabCounts.ARCHITECT },
          { key: "SHOWROOM", label: "نمایشگاه‌ها و فروشگاه‌ها", icon: Store, count: tabCounts.SHOWROOM },
          { key: "RETAIL", label: "خریداران خرد / ویلایی", icon: Users, count: tabCounts.RETAIL },
        ].map((tab) => {
          const isActive = selectedRole === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedRole(tab.key as RoleFilterTab)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Listing Card with ListingHeader & DataListView */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>لیست پرونده‌های مشتریان</span>
            <div className="flex items-center gap-2 print:hidden">
              <span className="text-xs text-muted-foreground font-normal">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="newest">جدیدترین پرونده‌ها</option>
                <option value="balance_high">بیشترین مانده بدهی</option>
                <option value="sqm_high">بیشترین متراژ خرید</option>
                <option value="name">نام (الفبا)</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>پاکسازی فیلترها</span>
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Reusable ListingHeader from components/data-listing */}
          <div className="print:hidden">
            <ListingHeader
              searchValue={searchQuery}
              searchPlaceholder="جستجوی نام مشتری، شرکت، پروژه، شماره تماس، کد پرونده..."
              onSearchChange={setSearchQuery}
              filters={headerFilters}
            />
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 ? (
            <EmptyState
              title="مشتری با این مشخصات یافت نشد"
              description="فیلترهای دسته‌بندی یا عبارت جستجو را تغییر دهید یا پرونده مشتری جدیدی ایجاد کنید."
              action={
                <Button size="sm" onClick={handleCreateCustomer} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" />
                  <span>ثبت اولین مشتری</span>
                </Button>
              }
            />
          ) : (
            /* Responsive DataListView (Mobile DataCards + Desktop Table) */
            <DataListView
              cardView={
                <div className="grid gap-3">
                  {filteredCustomers.map((customer) => {
                    const roleBadge = ROLE_BADGE_VARIANTS[customer.role];
                    const creditBadge = CREDIT_BADGE_CONFIG[customer.creditStatus];
                    const CreditIcon = creditBadge.icon;
                    const creditUsage =
                      customer.creditLimit > 0
                        ? Math.min(100, Math.round((customer.currentBalance / customer.creditLimit) * 100))
                        : 0;

                    return (
                      <DataCard
                        key={customer.id}
                        header={
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{customer.name}</span>
                            <span className="text-[11px] font-mono text-muted-foreground">({customer.code})</span>
                          </div>
                        }
                        subtitle={
                          <div className="space-y-0.5">
                            {customer.companyName && (
                              <p className="text-xs text-foreground/80">{customer.companyName}</p>
                            )}
                            {customer.projectName && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {customer.projectName} ({customer.city})
                              </p>
                            )}
                          </div>
                        }
                        badge={
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className={`text-[10px] ${roleBadge.className}`}>
                              {roleBadge.label}
                            </Badge>
                            <Badge variant="outline" className={`text-[10px] flex items-center gap-1 ${creditBadge.className}`}>
                              <CreditIcon className="h-2.5 w-2.5" />
                              {creditBadge.label}
                            </Badge>
                          </div>
                        }
                      >
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
                          <div>
                            <p className="text-[11px] text-muted-foreground">شماره تماس</p>
                            <a
                              href={`tel:${customer.phone}`}
                              className="font-mono text-xs text-primary hover:underline"
                              dir="ltr"
                            >
                              {customer.phone}
                            </a>
                          </div>

                          <div>
                            <p className="text-[11px] text-muted-foreground">متراژ خرید کل</p>
                            <p className="font-medium">
                              {customer.totalPurchasedSqm.toLocaleString("fa-IR")} م²
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] text-muted-foreground">مانده حساب</p>
                            <p className="font-bold text-amber-600 dark:text-amber-400">
                              {customer.currentBalance.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] text-muted-foreground">سقف اعتبار</p>
                            <p className="font-medium text-muted-foreground">
                              {customer.creditLimit.toLocaleString("fa-IR")} تومان ({creditUsage}٪)
                            </p>
                          </div>
                        </div>

                        {/* Preferred Stones Chips */}
                        {customer.preferredStones.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {customer.preferredStones.map((stone) => (
                              <span
                                key={stone}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
                              >
                                {stone}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>مشاهده پرونده کامل</span>
                          </Link>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer)}
                              className="h-7 w-7 p-0 text-destructive"
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
                <div className="overflow-x-auto rounded-lg border border-border/70">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
                        <th className="py-3 px-3 text-start font-medium">مشتری / کد پرونده</th>
                        <th className="py-3 px-3 text-start font-medium">نقش همکاری</th>
                        <th className="py-3 px-3 text-start font-medium">پروژه و موقعیت</th>
                        <th className="py-3 px-3 text-start font-medium">اطلاعات تماس</th>
                        <th className="py-3 px-3 text-start font-medium">سنگ‌های پرمصرف</th>
                        <th className="py-3 px-3 text-start font-medium">متراژ خرید (م²)</th>
                        <th className="py-3 px-3 text-start font-medium">مانده / سقف اعتبار</th>
                        <th className="py-3 px-3 text-start font-medium">وضعیت اعتبار</th>
                        <th className="py-3 ps-3 pe-4 text-end font-medium print:hidden">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredCustomers.map((customer) => {
                        const roleBadge = ROLE_BADGE_VARIANTS[customer.role];
                        const creditBadge = CREDIT_BADGE_CONFIG[customer.creditStatus];
                        const CreditIcon = creditBadge.icon;
                        const creditUsage =
                          customer.creditLimit > 0
                            ? Math.min(100, Math.round((customer.currentBalance / customer.creditLimit) * 100))
                            : 0;

                        return (
                          <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                            {/* 1. Customer Name & Code */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <Link
                                  href={`/dashboard/customers/${customer.id}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {customer.name}
                                </Link>
                              </div>
                              <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span>{customer.code}</span>
                                {customer.companyName && (
                                  <>
                                    <span>•</span>
                                    <span className="text-foreground/70 font-sans truncate max-w-[160px]">
                                      {customer.companyName}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* 2. Role Badge */}
                            <td className="py-3 px-3">
                              <Badge variant="outline" className={`text-[11px] ${roleBadge.className}`}>
                                {roleBadge.label}
                              </Badge>
                            </td>

                            {/* 3. Project Name & City */}
                            <td className="py-3 px-3">
                              {customer.projectName ? (
                                <div>
                                  <p className="font-medium text-foreground">{customer.projectName}</p>
                                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {customer.city}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">{customer.city || "-"}</span>
                              )}
                            </td>

                            {/* 4. Phone & Email */}
                            <td className="py-3 px-3">
                              <a
                                href={`tel:${customer.phone}`}
                                className="font-mono text-xs text-foreground hover:text-primary flex items-center gap-1"
                                dir="ltr"
                              >
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {customer.phone}
                              </a>
                              {customer.email && (
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate max-w-[130px]" dir="ltr">
                                  {customer.email}
                                </p>
                              )}
                            </td>

                            {/* 5. Preferred Stones */}
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[170px]">
                                {customer.preferredStones.slice(0, 3).map((stone) => (
                                  <span
                                    key={stone}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
                                  >
                                    {stone}
                                  </span>
                                ))}
                                {customer.preferredStones.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    +{customer.preferredStones.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 6. Purchased sqm */}
                            <td className="py-3 px-3">
                              <span className="font-bold tabular-nums">
                                {customer.totalPurchasedSqm.toLocaleString("fa-IR")}
                              </span>
                              <span className="text-[11px] text-muted-foreground ms-1">م²</span>
                              <p className="text-[10px] text-muted-foreground">
                                {customer.totalOrdersCount.toLocaleString("fa-IR")} پارت سفارش
                              </p>
                            </td>

                            {/* 7. Balance & Credit Limit */}
                            <td className="py-3 px-3 min-w-[140px]">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-amber-600 dark:text-amber-400">
                                  {customer.currentBalance.toLocaleString("fa-IR")}
                                </span>
                                <span className="text-muted-foreground text-[10px]">
                                  / {customer.creditLimit.toLocaleString("fa-IR")}
                                </span>
                              </div>
                              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
                                <div
                                  className={`h-full rounded-full ${
                                    creditUsage >= 100
                                      ? "bg-destructive"
                                      : creditUsage >= 80
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${Math.min(creditUsage, 100)}%` }}
                                />
                              </div>
                              {customer.pendingChecksTotal > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  چک: {customer.pendingChecksTotal.toLocaleString("fa-IR")} ت
                                </p>
                              )}
                            </td>

                            {/* 8. Credit Status */}
                            <td className="py-3 px-3">
                              <Badge
                                variant="outline"
                                className={`text-[11px] flex items-center gap-1 w-fit ${creditBadge.className}`}
                              >
                                <CreditIcon className="h-3 w-3" />
                                {creditBadge.label}
                              </Badge>
                            </td>

                            {/* 9. Actions Dropdown */}
                            <td className="py-3 ps-3 pe-4 text-end print:hidden">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/dashboard/customers/${customer.id}`}
                                  className="inline-flex items-center justify-center h-8 px-2.5 rounded-md text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors gap-1"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>پرونده</span>
                                </Link>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <span className="sr-only">عملیات</span>
                                      •••
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="text-xs">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/customers/${customer.id}`} className="gap-2">
                                        <Eye className="h-3.5 w-3.5" />
                                        مشاهده مشخصات و صورت‌حساب
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditCustomer(customer)} className="gap-2">
                                      <Edit className="h-3.5 w-3.5" />
                                      ویرایش اطلاعات
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <a href={`tel:${customer.phone}`} className="gap-2">
                                        <Phone className="h-3.5 w-3.5" />
                                        تماس با مشتری
                                      </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteCustomer(customer)}
                                      className="gap-2 text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      حذف پرونده
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <p>
                    نمایش {filteredCustomers.length.toLocaleString("fa-IR")} از {tenantCustomers.length.toLocaleString("fa-IR")} مشتری
                  </p>
                  <p>
                    سقف اعتباری کل: {(tenantCustomers.reduce((s, c) => s + c.creditLimit, 0) / 1_000_000).toLocaleString("fa-IR")} میلیون تومان
                  </p>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* 5. Create / Edit Dialog */}
      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        customer={editingCustomer}
        tenantId={activeTenantId}
        onSave={handleFormSave}
      />
    </div>
  );
}
