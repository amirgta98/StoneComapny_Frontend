import { Suspense } from "react";
import type { Metadata } from "next";
import { NewConversationForm } from "@/features/account";

export const metadata: Metadata = {
  title: "ایجاد درخواست پشتیبانی | پنل کاربری",
  description: "ارسال پیام و طرح پرسش‌های فنی، مالی یا سفارش با کارشناسان کارخانه.",
};

export default function NewSupportPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">در حال بارگذاری فرم پشتیبانی...</div>}>
      <NewConversationForm />
    </Suspense>
  );
}

