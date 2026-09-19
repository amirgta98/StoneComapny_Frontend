"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  XCircle,
  Gem,
  Tag,
  Clock,
} from "lucide-react";
import {
  INQUIRY_STATUS_CONFIG,
  type CustomerInquiry,
} from "../../types/inquiry";

interface InquiryCardProps {
  inquiry: CustomerInquiry;
  onCancelClick: (inquiry: CustomerInquiry) => void;
}

export function InquiryCard({ inquiry, onCancelClick }: InquiryCardProps) {
  const statusCfg = INQUIRY_STATUS_CONFIG[inquiry.status];
  const hasQuote =
    inquiry.managerResponse?.estimatedPricePerUnit ||
    inquiry.managerResponse?.estimatedTotalPrice;

  return (
    <Card className="group relative overflow-hidden border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Reference Image or Stone Icon */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 sm:h-24 sm:w-24">
            {inquiry.referenceImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inquiry.referenceImage}
                alt={inquiry.requestedStoneName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground/60">
                <Gem className="h-7 w-7" />
                <span className="text-[10px]">نمونه سنگ</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-2.5">
            {/* Header Row: Badges & ID */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusCfg.badgeClass}`}
              >
                {statusCfg.label}
              </span>

              <Badge variant="outline" className="text-[11px]">
                {inquiry.stoneType}
              </Badge>

              <Badge variant="secondary" className="text-[11px]">
                {inquiry.productFormat}
              </Badge>

              <span className="font-mono text-[10px] text-muted-foreground ms-auto" dir="ltr">
                {inquiry.inquiryNumber}
              </span>
            </div>

            {/* Title & Quantity */}
            <div>
              <Link
                href={`/account/inquiries/${inquiry.id}`}
                className="font-bold text-sm sm:text-base text-foreground transition-colors group-hover:text-primary line-clamp-1"
              >
                {inquiry.requestedStoneName}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  مقدار درخواستی: {inquiry.quantity.toLocaleString("fa-IR")} {inquiry.unit}
                </span>
                {inquiry.dimensions && (
                  <span>• ابعاد: {inquiry.dimensions}</span>
                )}
                {inquiry.quarryOrigin && (
                  <span>• خاستگاه: {inquiry.quarryOrigin}</span>
                )}
              </div>
            </div>

            {/* Manager Response Banner (If responded) */}
            {inquiry.managerResponse && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    پاسخ کارشناس تأمین و فروش
                  </span>
                  {hasQuote && inquiry.managerResponse.estimatedPricePerUnit && (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      فی: {inquiry.managerResponse.estimatedPricePerUnit.toLocaleString("fa-IR")} تومان
                    </span>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground line-clamp-2 leading-relaxed">
                  {inquiry.managerResponse.responseText}
                </p>
              </div>
            )}

            {/* Footer Metadata & Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between border-t border-border/60">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  ثبت شده در: {new Date(inquiry.createdAt).toLocaleDateString("fa-IR")}
                </span>
                {inquiry.managerResponse?.estimatedPrepDays && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      زمان آماده‌سازی: {inquiry.managerResponse.estimatedPrepDays}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {statusCfg.canCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancelClick(inquiry)}
                    className="h-8 gap-1 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    لغو
                  </Button>
                )}

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 rounded-xl px-3 text-xs font-medium"
                >
                  <Link href={`/account/inquiries/${inquiry.id}`}>
                    مشاهده جزئیات
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
