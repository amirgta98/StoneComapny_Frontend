"use client";

import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../../data/mock-data";

interface OrderTimelineProps {
  status: OrderStatus;
  timelineStep?: number;
  className?: string;
}

const MILESTONES = [
  { step: 0, title: "ثبت و تأیید سفارش", desc: "پرداخت و ثبت اولیه" },
  { step: 1, title: "تأمین سنگ خام", desc: "انتخاب کوپ و متریال" },
  { step: 2, title: "برش و فرآوری", desc: "ساب، کالیبره و رزین" },
  { step: 3, title: "پالت‌بندی و کنترل کیفیت", desc: "بسته‌بندی صادراتی" },
  { step: 4, title: "ارسال با باربری سنگ", desc: "صدور بارنامه و حمل" },
  { step: 5, title: "تحویل در محل پروژه", desc: "تخلیه و بازرسی نهایی" },
];

export function OrderTimeline({
  status,
  timelineStep = 0,
  className,
}: OrderTimelineProps) {
  const isCancelled =
    status === "cancelled" ||
    status === "refunded" ||
    status === "refund_requested" ||
    status === "failed" ||
    status === "sourcing_failed";

  if (isCancelled) {
    const isRefund = status === "refunded" || status === "refund_requested";
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive",
          className
        )}
      >
        <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">
            {isRefund ? "سفارش مرجوع گردیده است" : "این سفارش لغو گردیده است"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isRefund
              ? "مبلغ سفارش به حساب مبدا عودت داده شد یا در حال پردازش توسط امور مالی می‌باشد."
              : "عملیات تولید و ارسال این سفارش متوقف شده است."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate active step index (defaulting to 0)
  const activeStep = Math.max(0, Math.min(5, timelineStep));

  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-secondary/30 p-4 sm:p-5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary" />
          <h4 className="text-xs font-semibold text-foreground sm:text-sm">
            مراحل پیشرفت تولید و بارگیری سنگ
          </h4>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          مرحله {(activeStep + 1).toLocaleString("fa-IR")} از {MILESTONES.length.toLocaleString("fa-IR")}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative pt-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-2">
          {MILESTONES.map((m, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isUpcoming = idx > activeStep;

            return (
              <div
                key={m.step}
                className={cn(
                  "relative flex flex-col items-start gap-1.5 rounded-lg p-2.5 transition-colors sm:items-center sm:p-2 sm:text-center",
                  isCurrent &&
                    "bg-primary/10 ring-1 ring-primary/25",
                  isUpcoming && "opacity-55"
                )}
              >
                {/* Milestone Node */}
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all",
                    isCompleted &&
                      "bg-primary text-primary-foreground shadow-xs",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isUpcoming &&
                      "border border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <span className="tabular-nums">{(idx + 1).toLocaleString("fa-IR")}</span>
                  )}
                </div>

                {/* Milestone Text */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-medium leading-snug",
                      isCurrent && "font-semibold text-primary",
                      isCompleted && "text-foreground",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {m.title}
                  </p>
                  <p className="hidden text-[10px] text-muted-foreground sm:line-clamp-1">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
