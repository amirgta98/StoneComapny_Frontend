import type { Metadata } from "next";
import { ManagerShell } from "@/features/manager";

export const metadata: Metadata = {
  title: {
    template: "%s | پنل مدیریت کارخانه سنگ",
    default: "داشبورد صاحب کارخانه | پلتفرم تخصصی سنگ",
  },
  description: "سامانه یکپارچه مدیریت خط برش و فرآوری، کاتالوگ سنگ و اسلب، انبار و استعلام‌های پروژه‌ای کارخانه.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagerShell>{children}</ManagerShell>;
}