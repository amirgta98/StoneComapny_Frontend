import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت نظرات و بازخوردها",
  description:
    "مدیریت، ارزیابی کیفی، تایید، رد و پاسخگویی به نظرات و امتیازات مشتریان و معماران کارخانه سنگ.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
