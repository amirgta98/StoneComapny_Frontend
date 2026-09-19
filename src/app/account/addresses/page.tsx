import type { Metadata } from "next";
import { AddressesList } from "@/features/account";

export const metadata: Metadata = {
  title: "آدرس‌های من | حساب کاربری",
  description: "مدیریت آدرس‌های ارسال و صورت‌حساب جهت تحویل سنگ و مصالح ساختمانی",
};

export default function AddressesPage() {
  return <AddressesList />;
}
