import type { Metadata } from "next";
import { SupportInbox } from "@/features/account";

export const metadata: Metadata = {
  title: "پشتیبانی | پنل کاربری",
  description: "گفتگوها و درخواست‌های پشتیبانی خود را مدیریت کنید.",
};

export default function SupportPage() {
  return <SupportInbox />;
}
