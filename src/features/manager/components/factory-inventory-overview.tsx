"use client";

import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle, PackagePlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FactoryInventoryItem } from "../types";

export function FactoryInventoryOverview({
  items,
}: {
  items: FactoryInventoryItem[];
}) {
  return (
    <Card className="border border-border/80 bg-card shadow-2xs h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              وضعیت موجودی دپوی سنگ کارخانه
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              پایش متراژ اسلب‌ها و تایل‌های آماده تحویل در انبار
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/dashboard/inventory">
              <span>مدیریت انبار</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {items.map((item) => {
            const isLow = item.status === "low" || item.status === "critical";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-secondary/20 p-2.5 transition-colors hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.stoneName}
                    className="h-10 w-10 shrink-0 rounded-lg border border-border/70 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {item.stoneName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{item.finish}</span>
                      <span>·</span>
                      <span>{item.thickness}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-end">
                    <p className="text-xs font-bold text-foreground tabular-nums">
                      {item.stockSqm.toLocaleString("fa-IR")} م²
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      حد آستانه: {item.minThresholdSqm.toLocaleString("fa-IR")}
                    </p>
                  </div>

                  {isLow ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[10px] font-semibold gap-1"
                    >
                      <AlertCircle className="h-2.5 w-2.5" />
                      کسری
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold gap-1"
                    >
                      <CheckCircle className="h-2.5 w-2.5" />
                      مطلوب
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </div>

      <div className="p-4 pt-0 border-t border-border/40 mt-3">
        <Button asChild variant="outline" size="sm" className="w-full gap-1.5 text-xs">
          <Link href="/dashboard/inventory/blocks">
            <PackagePlus className="h-3.5 w-3.5" />
            <span>ثبت برش کوپ جدید در دپو</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
}
