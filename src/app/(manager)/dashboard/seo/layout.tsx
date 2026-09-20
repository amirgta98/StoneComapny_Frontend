import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سئو و موتورهای جستجو",
  description:
    "تنظیم و مدیریت بهینه‌سازی موتورهای جستجو (SEO)، متادیتای کاتالوگ سنگ‌ها، پیش‌نمایش در گوگل، نقشه سایت XML و فایل راهنمای ربات‌ها.",
};

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
