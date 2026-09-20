import type { Metadata } from "next";
import { LearnPageView, testArticles } from "@/features/learn";

export const metadata: Metadata = {
  title: "دانشنامه و آموزش تخصصی سنگ ساختمانی | صنایع سنگ سپنتا",
  description:
    "مرجع مقالات و راهنماهای آموزشی انتخاب، خرید، نصب، اسکوپ و نگهداری انواع سنگ‌های طبیعی نما، کف، اسلب، بوک‌مچ، مرمر، تراورتن و گرانیت.",
};

export default function LearnPage() {
  return <LearnPageView initialArticles={testArticles} />;
}
