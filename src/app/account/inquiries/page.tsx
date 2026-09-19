import type { Metadata } from "next";
import { InquiriesList } from "@/features/account";

export const metadata: Metadata = {
  title: "استعلام سنگ ناموجود | پنل کاربری",
  description:
    "مشاهده و ثبت استعلام قیمت و تأمین سنگ‌های ساختمانی ناموجود در کاتالوگ فروشگاه.",
};

export default function InquiriesPage() {
  return <InquiriesList />;
}
