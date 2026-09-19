"use client";

import Link from "next/link";
import { Phone, CheckCircle2, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui";
import { maskPhoneNumber } from "../../utils/security";

interface PhoneSecuritySectionProps {
  phone?: string | null;
}

export function PhoneSecuritySection({ phone }: PhoneSecuritySectionProps) {
  const maskedPhone = maskPhoneNumber(phone ?? "09120000004");

  return (
    <Card className="border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">شماره موبایل</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              شماره تلفن همراه اصلی متصل به حساب کاربری شما
            </CardDescription>
          </div>
        </div>

        <Link href="/account/security/phone">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs font-medium gap-1.5 transition-all duration-150 active:scale-[0.98]"
          >
            <span>تغییر شماره موبایل</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180 text-muted-foreground" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/40 p-3.5 border border-border/40">
          <div className="flex items-center gap-3">
            <span
              dir="ltr"
              className="text-base font-bold font-mono text-foreground tracking-wider"
            >
              {maskedPhone}
            </span>
            <Badge
              variant="secondary"
              className="gap-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-normal"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>تأیید شده</span>
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            شماره موبایل شما برای ورود و دریافت هشدارهای امنیتی استفاده می‌شود.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
