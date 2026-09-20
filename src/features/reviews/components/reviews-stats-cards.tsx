"use client";

import { MessageSquareText, Clock, CheckCircle2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReviewStats } from "../types";

interface ReviewsStatsCardsProps {
  stats: ReviewStats;
}

export function ReviewsStatsCards({ stats }: ReviewsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Reviews */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs hover:border-border transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            کل نظرات ثبت‌شده
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
          {stats.total.toLocaleString("fa-IR")}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>{stats.approved.toLocaleString("fa-IR")} منتشرشده</span>
          <span>·</span>
          <span>{stats.pending.toLocaleString("fa-IR")} در انتظار</span>
        </div>
      </Card>

      {/* 2. Pending Moderation */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs hover:border-amber-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            در انتظار بررسی و تایید
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {stats.pending.toLocaleString("fa-IR")}
          </p>
          {stats.pending > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
            >
              نیازمند اقدام
            </Badge>
          )}
        </div>
        <span className="mt-1 block text-[10px] text-muted-foreground">
          نظرات جدید ارسال‌شده توسط مشتریان
        </span>
      </Card>

      {/* 3. Average Rating */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs hover:border-border transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            میانگین رضایت و امتیاز
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
            <Star className="h-4 w-4 fill-yellow-500/30" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {stats.averageRating.toLocaleString("fa-IR")}
          </p>
          <span className="text-xs text-muted-foreground">از ۵</span>
        </div>
        <span className="mt-1 block text-[10px] text-muted-foreground">
          بر اساس {stats.total.toLocaleString("fa-IR")} بازخورد معماران و پیمانکاران
        </span>
      </Card>

      {/* 4. Approved Count */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs hover:border-emerald-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            تایید و منتشر شده
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {stats.approved.toLocaleString("fa-IR")}
          </p>
          <Badge
            variant="outline"
            className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          >
            فعال در سایت
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>{stats.rejected.toLocaleString("fa-IR")} رد شده</span>
          <span>·</span>
          <span>
            {stats.total > 0
              ? Math.round((stats.approved / stats.total) * 100).toLocaleString("fa-IR")
              : "۰"}
            ٪ نرخ تایید
          </span>
        </div>
      </Card>
    </div>
  );
}
