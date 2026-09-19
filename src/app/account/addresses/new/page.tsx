import type { Metadata } from "next";
import { NewAddress } from "@/features/account";

export const metadata: Metadata = {
  title: "افزودن آدرس جدید | حساب کاربری",
  description: "افزودن آدرس جدید برای تحویل سنگ و تجهیزات کارگاهی",
};

export default function NewAddressPage() {
  return <NewAddress />;
}
