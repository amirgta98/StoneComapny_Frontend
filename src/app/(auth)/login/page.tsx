import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginPage } from "@/features/auth";

export const metadata: Metadata = {
  title: "ورود | ثبت‌نام",
  description:
    "ورود یا ثبت‌نام با شماره موبایل و کد تأیید پیامکی — سریع، امن و بدون رمز عبور.",
};

/**
 * /login — unified login/sign-up via mobile number + OTP.
 *
 * `LoginPage` reads `?redirectUrl` (see `LoginForm`), so it must render
 * inside `<Suspense>` as required by Next.js App Router.
 */
export default function LoginRoute() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}