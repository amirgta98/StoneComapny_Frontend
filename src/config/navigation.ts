export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warning" | "destructive" | "outline";
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const storefrontNav: NavItem[] = [
  { title: "خانه", href: "/" },
  { title: "محصولات", href: "/stones" },
  { title: "گالری", href: "/collections" },
  { title: "گالری اجرا شده", href: "/projects" },
  { title: "درباره ما", href: "/about" },
  { title: "تماس با ما", href: "/contact" },
];

export const managerNav: NavSection[] = [
  {
    title: "مرکز مدیریت کارخانه",
    items: [
      { title: "داشبورد و نمای کلی", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "آمار و گزارش‌های تولید", href: "/dashboard/analytics", icon: "BarChart3" },
    ],
  },
  {
    title: "کاتالوگ سنگ و انبار",
    items: [
      { title: "سنگ‌ها و اسلب‌ها", href: "/dashboard/products", icon: "Layers", badge: "۲۸" },
      { title: "دسته‌بندی‌ها", href: "/dashboard/categories", icon: "FolderTree" },
      { title: "ویژگی‌ها و فینیش‌ها", href: "/dashboard/attributes", icon: "Tags" },
      { title: "موجودی انبار و دپو", href: "/dashboard/inventory", icon: "Package", badge: "کسری", badgeVariant: "warning" },
    ],
  },
  {
    title: "معاملات و فروش",
    items: [
      { title: "سفارش‌ها", href: "/dashboard/orders", icon: "ShoppingBag", badge: "۶ جاری", badgeVariant: "default" },
      { title: "استعلام‌های قیمت معماران", href: "/dashboard/inquiries", icon: "FileSpreadsheet", badge: "۳ جدید", badgeVariant: "warning" },
      { title: "مشتریان و پیمانکاران", href: "/dashboard/customers", icon: "Users" },
      { title: "تخفیف‌ها و شرایط خرید", href: "/dashboard/discounts", icon: "Receipt" },
      { title: "نظرات و بازخوردها", href: "/dashboard/reviews", icon: "MessageSquareText" },
    ],
  },
  {
    title: "محتوا و وبگاه اختصاصی",
    items: [
      { title: "گالری و مدیا سنگ", href: "/dashboard/media", icon: "Layout" },
      { title: "صفحات و شوروم", href: "/dashboard/pages", icon: "FileText" },
      { title: "منوهای سایت کارخانه", href: "/dashboard/navigation", icon: "Store" },
    ],
  },
  {
    title: "طراحی و بهینه‌سازی",
    items: [
      { title: "قالب و هویت بصری کارخانه", href: "/dashboard/theme", icon: "Sparkles" },
      { title: "سئو و موتورهای جستجو", href: "/dashboard/seo", icon: "TrendingUp" },
    ],
  },
  {
    title: "تنظیمات کارخانه",
    items: [
      { title: "مشخصات و آدرس کارخانه", href: "/dashboard/settings", icon: "Settings" },
    ],
  },
];

/**
 * Platform administration navigation (access-control: SUPER_ADMIN).
 * Fully isolated from customer account navigation.
 */
export const adminNav: NavSection[] = [
  {
    title: "داشبورد و مانیتورینگ",
    items: [
      { title: "نمای کلی داشبورد", href: "/superAdmin", icon: "LayoutDashboard" },
      { title: "آمار و گزارش‌های تحلیلی", href: "/superAdmin/analytics", icon: "BarChart3" },
      { title: "مانیتورینگ سرور و سلامت", href: "/superAdmin/monitoring", icon: "Activity" },
    ],
  },
  {
    title: "کارخانه‌ها و تننت‌ها",
    items: [
      { title: "شرکت‌ها و کارخانجات سنگ", href: "/superAdmin/tenants", icon: "Building2", badge: "۲۴" },
      { title: "درخواست‌های عضویت جدید", href: "/superAdmin/tenants/requests", icon: "UserCheck", badge: "۳ جدید", badgeVariant: "warning" },
      { title: "پلن‌ها و اشتراک‌ها", href: "/superAdmin/tenants/plans", icon: "Crown" },
    ],
  },
  {
    title: "کاتالوگ سنگ و انبار سراسری",
    items: [
      { title: "کاتالوگ سنگ‌ها و اسلب‌ها", href: "/superAdmin/catalog/products", icon: "Layers", badge: "۱٬۲۸۴" },
      { title: "دسته‌بندی سنگ‌ها", href: "/superAdmin/catalog/categories", icon: "FolderTree" },
      { title: "ویژگی‌ها و فینیش‌ها", href: "/superAdmin/catalog/attributes", icon: "Tags" },
    ],
  },
  {
    title: "معاملات و مالی",
    items: [
      { title: "سفارش‌ها و معاملات", href: "/superAdmin/orders", icon: "ShoppingBag" },
      { title: "استعلام‌های قیمت سنگ", href: "/superAdmin/inquiries", icon: "FileSpreadsheet", badge: "۵ در انتظار", badgeVariant: "warning" },
      { title: "تراکنش‌ها و مالی پلتفرم", href: "/superAdmin/finance", icon: "Receipt" },
    ],
  },
  {
    title: "کاربران و سطوح دسترسی",
    items: [
      { title: "کاربران پلتفرم و مدیران", href: "/superAdmin/users", icon: "Users", badge: "۱۴۸" },
      { title: "نقش‌ها و دسترسی‌ها", href: "/superAdmin/roles", icon: "ShieldCheck" },
    ],
  },
  {
    title: "محتوا و پورتال",
    items: [
      { title: "مقالات و اخبار بازار سنگ", href: "/superAdmin/content/articles", icon: "FileText" },
      { title: "بنرها و صفحات سراسری", href: "/superAdmin/content/pages", icon: "Layout" },
    ],
  },
  {
    title: "تنظیمات و امنیت",
    items: [
      { title: "تنظیمات سراسری پلتفرم", href: "/superAdmin/settings", icon: "Settings" },
      { title: "لاگ‌های امنیتی و ممیزی", href: "/superAdmin/security/logs", icon: "ShieldAlert" },
    ],
  },
];

export const superAdminNav = adminNav;

/** Customer account panel navigation (access-control skill: USER role). */
export const customerNav: NavSection[] = [
  {
    title: "حساب کاربری",
    items: [
      { title: "داشبورد", href: "/account", icon: "LayoutDashboard" },
      { title: "سفارش‌ها", href: "/account/orders", icon: "ShoppingBag" },
      { title: "استعلام سنگ", href: "/account/inquiries", icon: "MessageSquareText" },
      { title: "پروژه‌های من", href: "/account/projects", icon: "FolderHeart" },
      { title: "علاقه‌مندی‌ها", href: "/account/favorites", icon: "Heart" },
    ],
  },
  {
    title: "مدیریت",
    items: [
      { title: "آدرس‌ها", href: "/account/addresses", icon: "MapPin" },
      { title: "اسناد فنی", href: "/account/documents", icon: "FileText" },
    ],
  },
  {
    title: "امنیت و پشتیبانی",
    items: [
      { title: "امنیت حساب", href: "/account/security", icon: "ShieldCheck" },
      { title: "پشتیبانی", href: "/account/support", icon: "Headphones" },
    ],
  },
];