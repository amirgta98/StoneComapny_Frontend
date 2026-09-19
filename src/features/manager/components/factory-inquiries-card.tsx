"use client";

import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Send, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FactoryInquiry } from "../types";

export function FactoryInquiriesCard({
  inquiries,
}: {
  inquiries: FactoryInquiry[];
}) {
  return (
    <Card className="border border-border/80 bg-card shadow-2xs h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              استعلام‌های قیمت و پروژه‌ای (RFQ)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              درخواست‌های استعلام متراژ از معماران و انبوه‌سازان
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href="/dashboard/inquiries">
              <span>همه استعلام‌ها</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 transition-all duration-150 hover:bg-secondary/60 hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground truncate">
                      {inq.customerName}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {inq.customerRole}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs font-medium text-foreground">
                    سنگ درخواستی: <span className="text-primary font-semibold">{inq.stoneTitle}</span>
                  </p>
                </div>

                {inq.urgency === "high" ? (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                    <AlertTriangle className="h-3 w-3" />
                    فوری
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    عادی
                  </span>
                )}
              </div>

              {/* Inquiry details pills */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="rounded bg-card px-2 py-0.5 font-medium border border-border/50 text-foreground">
                  متراژ: {inq.volume}
                </span>
                <span className="rounded bg-card px-2 py-0.5 border border-border/50">
                  فینیش: {inq.finish}
                </span>
                <span className="rounded bg-card px-2 py-0.5 border border-border/50">
                  ضخامت: {inq.thickness}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {inq.projectCity}
                </span>
              </div>

              {inq.notes && (
                <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 bg-card/60 p-2 rounded-lg border border-border/40">
                  {inq.notes}
                </p>
              )}

              {/* Footer action */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {inq.createdAt}
                </span>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 hover:bg-primary hover:text-primary-foreground">
                  <Send className="h-3 w-3" />
                  اعلام قیمت و پیش‌فاکتور
                </Button>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              استعلام جدیدی در صف انتظار قرار ندارد.
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
