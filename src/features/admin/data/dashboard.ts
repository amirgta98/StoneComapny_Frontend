import type { AdminDashboardData } from "../types";

/**
 * Admin dashboard data.
 *
 * Mock data shaped like the future server API. Swap this with real
 * queries (e.g. features/tenants/queries) when the backend is ready.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return {
    summary: {
      totalTenants: 24,
      activeTenants: 19,
      pendingTenants: 3,
      suspendedTenants: 2,
      totalUsers: 148,
      totalManagers: 31,
      totalProducts: 1284,
      totalOrders: 3421,
      totalRevenue: 28_450_000_000, // 28.45 Billion Tomans
      pendingInquiries: 5,
    },
    server: {
      status: "healthy",
      uptime: "99.98%",
      region: "teh-dc1 (ایران)",
      nodeVersion: "v20.11.1",
      metrics: [
        { id: "cpu", label: "پردازنده", value: "۳۴٪", status: "healthy", detail: "۸ هسته · بار متوسط ۴.۲" },
        { id: "memory", label: "حافظه", value: "۵۸٪", status: "healthy", detail: "۱۲ گیگابایت / ۱۶ گیگابایت" },
        { id: "storage", label: "فضای ذخیره‌سازی", value: "۴۱٪", status: "healthy", detail: "۸۲ گیگابایت / ۲۰۰ گیگابایت" },
        { id: "response", label: "زمان پاسخ", value: "۱۴۲ms", status: "healthy", detail: "p95 · ۲۴ ساعت گذشته" },
        { id: "sessions", label: "نشست‌های فعال", value: "۱٬۲۰۴", status: "warning", detail: "فعال · ۸٪+ امروز" },
        { id: "errors", label: "خطاها", value: "۰.۰۲٪", status: "healthy", detail: "نرخ خطا · ۲۴ ساعت گذشته" },
      ],
    },
    recentTenants: [
      { id: "t-1", name: "صنایع سنگ میرزایی", slug: "mirzaei-stone", domain: "mirzaeestone.ir", status: "active", createdAt: "2026-08-10T00:00:00Z" },
      { id: "t-2", name: "مجتمع سنگ اطلس ماربل", slug: "atlas-marble", domain: "atlasmarble.com", status: "active", createdAt: "2026-08-02T00:00:00Z" },
      { id: "t-3", name: "کارخانه گرانیت مروارید مشهد", slug: "granite-house", status: "pending", createdAt: "2026-07-28T00:00:00Z" },
      { id: "t-4", name: "استودیو اونیکس و مرمر طلایی", slug: "onyx-studio", domain: "onyxstudio.co", status: "suspended", createdAt: "2026-07-15T00:00:00Z" },
      { id: "t-5", name: "تراورتن سوپر حاجی‌آباد", slug: "travertine-co", status: "active", createdAt: "2026-07-01T00:00:00Z" },
    ],
    recentInquiries: [
      {
        id: "inq-801",
        customerName: "مهندسی عمران آرمان سازه",
        stoneTitle: "تراورتن دره بخاری سوپر موج‌دار",
        category: "تراورتن",
        volume: "۸۵۰ مترمربع",
        tenantName: "تراورتن سوپر حاجی‌آباد",
        status: "pending",
        createdAt: "2026-08-11T11:20:00Z",
        priority: "high",
      },
      {
        id: "inq-802",
        customerName: "گروه معماری نگین پایتخت",
        stoneTitle: "مرمریت دهبید شایان ساب پولیشی",
        category: "مرمریت",
        volume: "۴۲۰ مترمربع",
        tenantName: "صنایع سنگ میرزایی",
        status: "quoted",
        createdAt: "2026-08-10T16:45:00Z",
        priority: "normal",
      },
      {
        id: "inq-803",
        customerName: "شرکت بازرگانی سنگ آرتا",
        stoneTitle: "اسلب گرانیت مشکی نطنز دبل پولیش",
        category: "گرانیت",
        volume: "۳۰۰ مترمربع",
        tenantName: "کارخانه گرانیت مروارید",
        status: "pending",
        createdAt: "2026-08-09T08:15:00Z",
        priority: "high",
      },
      {
        id: "inq-804",
        customerName: "پروژه هتل بین‌المللی ارگ",
        stoneTitle: "بوک‌مچ انیکس سبز سیرجان نورگذر",
        category: "انیکس و مرمر",
        volume: "۱۸۰ مترمربع",
        tenantName: "استودیو اونیکس",
        status: "approved",
        createdAt: "2026-08-07T14:30:00Z",
        priority: "high",
      },
    ],
    stoneCategories: [
      { name: "تراورتن (نما و محوطه)", percentage: 42, count: 539, color: "#8b5e34" },
      { name: "مرمریت (کف و دیواره)", percentage: 28, count: 359, color: "#a87b4f" },
      { name: "گرانیت (صنعتی و پله)", percentage: 16, count: 205, color: "#44403c" },
      { name: "مرمر و اونیکس (لوکس و نورگذر)", percentage: 9, count: 115, color: "#c59b6d" },
      { name: "لایم‌استون و سنداستون", percentage: 5, count: 66, color: "#78716c" },
    ],
    activity: [
      { id: "a-1", type: "tenant.created", title: "شرکت سنگ جدید ثبت شد", description: "مجتمع سنگ اطلس ماربل مدارک ثبتی خود را تکمیل کرد.", timestamp: "2026-08-11T09:30:00Z", actor: "admin@platform.com" },
      { id: "a-2", type: "inquiry.received", title: "استعلام عمده سنگ پروژه", description: "استعلام ۸۵۰ مترمربع تراورتن دره بخاری ثبت گردید.", timestamp: "2026-08-11T08:12:00Z", actor: "کاربر سامانه" },
      { id: "a-3", type: "order.placed", title: "معامله قطعی اسلب دهبید", description: "پیش‌فاکتور شماره ۱۸۵۲ به مبلغ ۴۲۰ میلیون تومان تایید شد.", timestamp: "2026-08-10T15:20:00Z", actor: "صنایع سنگ میرزایی" },
      { id: "a-4", type: "user.invited", title: "مدیر جدید کارخانه سنگ", description: "مهندس سارا احمدی به عنوان مدیر ارشد گرانیت مروارید دعوت شد.", timestamp: "2026-08-09T14:12:00Z", actor: "admin@platform.com" },
      { id: "a-5", type: "system", title: "پشتیبان‌گیری خودکار پایگاه داده", description: "نسخه پشتیبان روزانه با موفقیت در کلاود ذخیره شد.", timestamp: "2026-08-09T02:00:00Z" },
    ],
    growth: [
      { month: "فروردین", tenants: 12, users: 64, revenue: 1420 },
      { month: "اردیبهشت", tenants: 14, users: 78, revenue: 1850 },
      { month: "خرداد", tenants: 15, users: 90, revenue: 2100 },
      { month: "تیر", tenants: 18, users: 104, revenue: 2750 },
      { month: "مرداد", tenants: 20, users: 121, revenue: 3200 },
      { month: "شهریور", tenants: 22, users: 136, revenue: 3900 },
      { month: "مهر", tenants: 24, users: 148, revenue: 4600 },
    ],
  };
}