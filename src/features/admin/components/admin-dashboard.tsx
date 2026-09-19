import Link from "next/link";
import {
  Building2,
  Plus,
  Settings,
  Users,
  Activity,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  DownloadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { getAdminDashboardData } from "../data/dashboard";
import { KpiCard } from "./kpi-card";
import { ManagementHubCard } from "./management-hub-card";
import { PlatformGrowthChart } from "./platform-growth-chart";
import { StoneCategoryChart } from "./stone-category-chart";
import { ServerPerformance } from "./server-performance";
import { TenantListPreview } from "./tenant-list-preview";
import { RecentInquiriesPreview } from "./recent-inquiries-preview";
import { ActivityFeed } from "./activity-feed";
import type { Kpi } from "../types";

const managementHub = [
  {
    title: "کارخانه‌ها و شرکت‌ها",
    description: "نظارت بر شرکت‌ها، دامنه‌ها و مجوزهای فعالیت",
    href: "/superAdmin/tenants",
    icon: Building2,
    meta: "۲۴ شرکت ثبت‌شده",
  },
  {
    title: "درخواست‌های عضویت",
    description: "بررسی مدارک و تایید کارخانجات متقاضی جدید",
    href: "/superAdmin/tenants/requests",
    icon: CheckCircle2,
    meta: "۳ درخواست در انتظار",
  },
  {
    title: "کاتالوگ سنگ سراسری",
    description: "اسلب‌ها، تایل‌ها، کوپ‌ها و انبار کارخانجات",
    href: "/superAdmin/catalog/products",
    icon: Layers,
    meta: "۱٬۲۸۴ سنگ فعال",
  },
  {
    title: "استعلام‌های قیمت (RFQ)",
    description: "استعلام‌های عمده پروژه‌ها و قیمت‌گذاری",
    href: "/superAdmin/inquiries",
    icon: FileSpreadsheet,
    meta: "۵ مورد منتظر پاسخ",
  },
  {
    title: "کاربران و پرمیشن‌ها",
    description: "مدیران شرکت‌ها، خریداران عمده و سطوح دسترسی",
    href: "/superAdmin/users",
    icon: Users,
    meta: "۱۴۸ کاربر فعال",
  },
  {
    title: "سلامت و مانیتورینگ سرور",
    description: "پایش منابع، آپ‌تایم، دیتابیس و امنیت پلتفرم",
    href: "/superAdmin/monitoring",
    icon: Activity,
    meta: "آپ‌تایم ۹۹.۹۸٪",
  },
];

export async function AdminDashboard() {
  const data = await getAdminDashboardData();
  const { summary } = data;

  const kpis: Kpi[] = [
    {
      id: "revenue",
      label: "گردش مالی کل معاملات",
      value: "۲۸.۴۵ میلیارد",
      hint: "تومان · کل قراردادهای پلتفرم",
      trend: "up",
      trendValue: "۲۱٪ در این ماه",
    },
    {
      id: "tenants",
      label: "کارخانه‌ها و شرکت‌های سنگ",
      value: String(summary.totalTenants),
      hint: `${summary.activeTenants} فعال · ${summary.pendingTenants} در انتظار تایید`,
      trend: "up",
      trendValue: "۲ جدید این ماه",
    },
    {
      id: "products",
      label: "محصولات کاتالوگ سراسری",
      value: summary.totalProducts.toLocaleString("fa-IR"),
      hint: "اسلب، تایل و کوپ سنگ طبیعی",
      trend: "up",
      trendValue: "۴۸ محصول جدید",
    },
    {
      id: "inquiries",
      label: "استعلام‌ها و سفارشات جاری",
      value: summary.totalOrders.toLocaleString("fa-IR"),
      hint: `${summary.pendingInquiries} استعلام باز قیمت`,
      trend: "up",
      trendValue: "۲۱۴ مورد این ماه",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Welcome Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-secondary/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                پنل مدیریت ارشد پلتفرم
              </span>
              <span className="text-xs text-muted-foreground">
                نسخه ۲.۴ اختصاصی صنعت سنگ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              نمای کلی سامانه و مرکز فرماندهی
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              مدیریت یکپارچه کارخانجات سنگ، کاتالوگ سراسری اسلب و تایل، استعلام‌های عمده پروژه‌ها، و تحلیل عملکرد پلتفرم.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild className="gap-2 text-xs font-semibold shadow-sm">
              <Link href="/superAdmin/tenants/new">
                <Plus className="h-4 w-4" />
                ثبت شرکت جدید
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 text-xs">
              <Link href="/superAdmin/inquiries">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                بررسی استعلام‌ها
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Primary KPI Cards */}
      <section aria-label="شاخص‌های کلیدی" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      {/* Platform Management Hub Grid */}
      <section aria-label="دسترسی‌های سریع مدیریتی" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              بخش‌های مدیریتی پلتفرم
            </h2>
            <p className="text-xs text-muted-foreground">
              دسترسی مستقیم و سریع به زیرسیستم‌های عملیاتی
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {managementHub.map((item) => (
            <ManagementHubCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      {/* Analytics & Distribution Charts Grid */}
      <section aria-label="نمودارها و تحلیل بازار" className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlatformGrowthChart data={data.growth} />
        </div>
        <div className="lg:col-span-1">
          <StoneCategoryChart categories={data.stoneCategories} />
        </div>
      </section>

      {/* Live Data Grids: Recent Tenants & Inquiries */}
      <section aria-label="داده‌های لحظه‌ای معاملات و شرکت‌ها" className="grid gap-6 lg:grid-cols-2">
        <RecentInquiriesPreview inquiries={data.recentInquiries} />
        <TenantListPreview tenants={data.recentTenants} />
      </section>

      {/* Operations & System Logs: Server Performance & Activity Feed */}
      <section aria-label="پایش سرور و وقایع پلتفرم" className="grid gap-6 lg:grid-cols-2">
        <ServerPerformance server={data.server} />
        <ActivityFeed events={data.activity} />
      </section>
    </div>
  );
}