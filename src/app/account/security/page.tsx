import type { Metadata } from "next";
import { SecuritySettings } from "@/features/account";

export const metadata: Metadata = {
  title: "امنیت حساب | حساب کاربری",
  description: "مدیریت نشست‌های فعال، شماره همراه و حفاظت از حساب کاربری",
};

export default function SecurityPage() {
  return <SecuritySettings />;
}

