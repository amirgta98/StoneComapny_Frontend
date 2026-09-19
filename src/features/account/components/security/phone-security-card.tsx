"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, Phone, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui";
import { maskPhoneNumber } from "../../lib/security-utils";

type PhoneSecurityCardProps = {
  phone?: string | null;
};

/**
 * Mobile number overview card (Account Security §2).
 *
 * Displays the current verified phone in masked form (e.g. 09******1234)
 * and provides a direct CTA to enter the phone change verification flow.
 */
export function PhoneSecurityCard({ phone }: PhoneSecurityCardProps) {
  const masked = maskPhoneNumber(phone);

  return (
    <Card className="overflow-hidden border border-stone-200/80 bg-card shadow-xs dark:border-stone-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">شماره موبایل</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                شماره اصلی جهت ورود، بازیابی و اعتبارسنجی عملیات امنیتی
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>تأیید شده</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="flex flex-col gap-4 rounded-xl border border-stone-200/60 bg-stone-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800/60 dark:bg-stone-900/30">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">شماره موبایل فعال</p>
            <p
              dir="ltr"
              className="font-mono text-xl font-bold tracking-normal text-foreground text-start"
            >
              {masked}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>شماره موبایل شما تأیید شده است.</span>
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="group self-start rounded-lg border-stone-300 bg-background hover:bg-stone-100 dark:border-stone-700 sm:self-center"
          >
            <Link href="/account/security/phone" className="flex items-center gap-2">
              <span>تغییر شماره موبایل</span>
              <ChevronLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
