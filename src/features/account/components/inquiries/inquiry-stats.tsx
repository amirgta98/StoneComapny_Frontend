"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareText, Clock, CheckCircle2, BadgeCheck } from "lucide-react";
import type { CustomerInquiry } from "../../types/inquiry";

interface InquiryStatsProps {
  inquiries: CustomerInquiry[];
}

export function InquiryStats({ inquiries }: InquiryStatsProps) {
  const total = inquiries.length;
  const pending = inquiries.filter(
    (i) => i.status === "PENDING" || i.status === "IN_REVIEW"
  ).length;
  const responded = inquiries.filter(
    (i) => i.status === "RESPONDED" || i.status === "APPROVED"
  ).length;
  const completed = inquiries.filter((i) => i.status === "COMPLETED").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* Total */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
            <MessageSquareText className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              کل استعلام‌ها
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {total.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending / In Review */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              در نوبت کارشناسی
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {pending.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responded */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <BadgeCheck className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              قیمت‌گذاری و آماده تأمین
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {responded.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="border border-border/80 bg-card shadow-xs transition-all hover:border-primary/20">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground sm:text-xs">
              نهایی‌شده در سفارش
            </div>
            <div className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
              {completed.toLocaleString("fa-IR")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
