import type { Metadata } from "next";
import { DocumentsList } from "@/features/account";

export const metadata: Metadata = {
  title: "اسناد فنی و گواهینامه‌های کیفیت سنگ | پنل کاربری",
  description:
    "مشاهده و دریافت گواهی‌های کیفیت آزمایشگاهی، برگه مشخصات فنی (TDS) و شناسنامه اصالت سنگ‌های خریداری‌شده.",
};

export default function DocumentsPage() {
  return <DocumentsList />;
}
