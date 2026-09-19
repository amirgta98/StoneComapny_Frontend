"use client";

import { Tag, CheckCircle2, AlertCircle, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatPersianNumber } from "../lib/discount-utils";
import type { DiscountStats } from "../types";

interface DiscountsStatsProps {
  stats: DiscountStats;
}

export function DiscountsStats({ stats }: DiscountsStatsProps) {
  const statCards = [
    {
      title: "تخفیف‌های فعال",
      value: formatPersianNumber(stats.active),
      icon: CheckCircle2,
      description: "کمپین‌های در حال اجرا",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "کل کمپین‌ها",
      value: formatPersianNumber(stats.total),
      icon: Tag,
      description: "تعریف‌شده در سیستم",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "منقضی شده",
      value: formatPersianNumber(stats.expired),
      icon: AlertCircle,
      description: "پایان دوره اعتبار",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "میانگین تخفیف درصدی",
      value: `${formatPersianNumber(stats.averageRate)}٪`,
      icon: Percent,
      description: "نرخ میانگین اعمالی",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
              <p className="text-xl md:text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="text-[11px] text-muted-foreground">{card.description}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.iconColor} flex-shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
