import type { Metadata } from "next";
import { NewInquiryForm } from "@/features/account";

export const metadata: Metadata = {
  title: "ثبت استعلام جدید سنگ ناموجود | پنل کاربری",
  description:
    "ارسال درخواست استعلام مشخصات، متراژ و قیمت سنگ‌های ساختمانی مورد نظر جهت بررسی و اعلام قیمت توسط کارخانه.",
};

export default function NewInquiryPage() {
  return <NewInquiryForm />;
}
