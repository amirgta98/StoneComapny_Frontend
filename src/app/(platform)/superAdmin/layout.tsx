import type { Metadata } from "next";
import { AdminShell } from "@/features/admin";

export const metadata: Metadata = {
  title: {
    template: "%s | پنل مدیریت پلتفرم سنگ",
    default: "داشبورد مدیریت ارشد | پلتفرم تخصصی سنگ",
  },
  description: "سامانه یکپارچه مدیریت کارخانجات سنگ، کاتالوگ سراسری، استعلام‌های قیمت و مانیتورینگ سیستم.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
