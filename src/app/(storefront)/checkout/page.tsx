import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout";

export const metadata: Metadata = {
  title: "تسویه حساب و ثبت سفارش سنگ | فروشگاه سنگ طبیعی",
  description:
    "مرحله نهایی تکمیل خرید، تعیین محل تخلیه کارگاهی پروژه، انتخاب شیوه باربری سنگ و پرداخت امن شاپرک.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
