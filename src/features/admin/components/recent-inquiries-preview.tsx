"use client";

import Link from "next/link";
import { ArrowUpRight, FileSpreadsheet, Clock, CheckCircle2 } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { RecentInquiry } from "../types";

interface RecentInquiriesPreviewProps {
  inquiries: RecentInquiry[];
}

const statusBadgeConfig: Record<
  RecentInquiry["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "در انتظار بررسی", variant: "secondary" },
  quoted: { label: "پیش‌فاکتور صادر شد", variant: "outline" },
  approved: { label: "معامله نهایی", variant: "default" },
  rejected: { label: "رد شده", variant: "destructive" },
};

export function RecentInquiriesPreview({ inquiries }: RecentInquiriesPreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">
              استعلام‌های عمده سنگ (RFQ)
            </CardTitle>
            <CardDescription className="text-xs">
              درخواست‌های قیمت ثبت‌شده توسط انبوه‌سازان و پروژه‌ها
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <Link href="/superAdmin/inquiries">
              مشاهده همه
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            استعلام بازی در سامانه ثبت نشده است.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {inquiries.map((inq) => {
              const statusCfg = statusBadgeConfig[inq.status];
              return (
                <li
                  key={inq.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-xs text-foreground truncate">
                        {inq.stoneTitle}
                      </p>
                      {inq.priority === "high" && (
                        <span className="rounded-sm bg-rose-500/15 px-1 py-0.2 text-[9px] font-bold text-rose-700">
                          فوری
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span>خریدار: {inq.customerName}</span>
                      <span>•</span>
                      <span>کارخانه: {inq.tenantName}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground">
                        متراژ: {inq.volume}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <Badge variant={statusCfg.variant} className="text-[10px]">
                      {statusCfg.label}
                    </Badge>
                    <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                      <Link href={`/superAdmin/inquiries?id=${inq.id}`}>
                        بررسی
                      </Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
