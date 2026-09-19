import type { Metadata } from "next";
import { PhoneChangeForm } from "@/features/account";

export const metadata: Metadata = {
  title: "تغییر شماره موبایل | حساب کاربری",
  description: "تغییر و احراز هویت پیامکی شماره تلفن همراه",
};

export default function PhoneChangePage() {
  return <PhoneChangeForm />;
}
