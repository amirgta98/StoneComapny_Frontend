import type { Metadata } from "next";
import { InventorySubNav } from "@/features/inventory";

export const metadata: Metadata = {
  title: {
    template: "%s | مدیریت انبار و کاردکس سنگ",
    default: "مدیریت جامع انبار و موجودی سنگ | کارخانه سنگ",
  },
  description:
    "سامانه جامع انبارداری تخصصی سنگ طبیعی، اسلب، تایل، کاردکس، رسیدهای ورود، حواله‌های خروج و انبارگردانی کارخانه.",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <InventorySubNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
