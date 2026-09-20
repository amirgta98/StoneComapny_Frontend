import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "قالب و هویت بصری کارخانه",
  description:
    "تنظیم و شخصی‌سازی هویت بصری، پالت رنگی اختصاصی برند، تایپوگرافی و هندسه اجزای پرتال کارخانه سنگ و وبگاه اختصاصی.",
};

export default function ThemeSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
