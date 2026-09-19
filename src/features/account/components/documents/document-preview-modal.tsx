"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  Hash,
  QrCode,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import type { TechnicalDocument } from "../../types/document";

interface DocumentPreviewModalProps {
  document: TechnicalDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: TechnicalDocument) => void;
}

export function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const isQC = document.type === "quality_certificate";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto p-0 sm:rounded-2xl">
        {/* Certificate Header Banner */}
        <div className="relative border-b border-border bg-muted/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    isQC
                      ? "border-primary/30 bg-primary/10 text-primary font-medium"
                      : "border-border bg-secondary text-foreground font-medium"
                  }
                >
                  {isQC ? (
                    <Award className="me-1 h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="me-1 h-3.5 w-3.5" />
                  )}
                  {isQC ? "گواهی کیفیت و اصالت متریال" : "برگه مشخصات فنی (TDS)"}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground" dir="ltr">
                  #{document.docNumber}
                </span>
                {document.verified && (
                  <Badge className="bg-emerald-600/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-normal">
                    <CheckCircle2 className="me-1 h-3 w-3" />
                    تأییدیه رسمی آزمایشگاه
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-lg font-bold sm:text-xl">
                {document.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                مرجع صادرکننده: {document.labName} • شناسه اعتبار:{" "}
                <span dir="ltr">{document.accreditationNumber}</span>
              </p>
            </div>

            {/* Quick dates */}
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground sm:flex-col sm:items-end sm:text-end">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>تاریخ صدور: {new Date(document.issuedAt).toLocaleDateString("fa-IR")}</span>
              </div>
              {document.validUntil && (
                <div className="text-[11px] text-muted-foreground/80">
                  اعتبار تا: {new Date(document.validUntil).toLocaleDateString("fa-IR")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Stone Identity Card */}
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Product Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={document.productImage}
                alt={document.productName}
                className="h-20 w-20 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {document.productName}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {document.grade}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground/80">نوع سنگ: </span>
                    <span className="font-medium text-foreground">{document.stoneType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/80">خاستگاه و معدن: </span>
                    <span className="font-medium text-foreground">{document.quarryOrigin}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/80">فرآوری: </span>
                    <span className="font-medium text-foreground">{document.finish}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/80">فرم و ابعاد: </span>
                    <span className="font-medium text-foreground">{document.stoneForm}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/80">شماره سفارش: </span>
                    <span className="font-mono font-medium text-primary" dir="ltr">
                      {document.orderNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/80">کد بچ / پالت: </span>
                    <span className="font-mono text-foreground" dir="ltr">
                      {document.batchNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {document.description && (
              <p className="mt-3.5 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
                {document.description}
              </p>
            )}
          </div>

          {/* Physical & Mechanical Lab Test Results Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                نتایج آزمون‌های آزمایشگاهی و آنالیز فیزیکی
              </h4>
              <span className="text-[11px] text-muted-foreground">
                مطابق با استاندارد ISIRI 5695 و ASTM
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr className="border-b border-border text-start">
                    <th className="px-3.5 py-2.5 font-medium">شاخص و پارامتر فیزیکی</th>
                    <th className="px-3.5 py-2.5 font-medium">استاندارد آزمون</th>
                    <th className="px-3.5 py-2.5 font-medium">مقدار اندازه‌گیری‌شده</th>
                    <th className="px-3.5 py-2.5 font-medium">حد مجاز استاندارد</th>
                    <th className="px-3.5 py-2.5 font-medium text-center">وضعیت انطباق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-card">
                  {document.keySpecs.map((spec, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3.5 py-2.5 font-medium text-foreground">
                        {spec.name}
                      </td>
                      <td className="px-3.5 py-2.5 font-mono text-[11px] text-muted-foreground" dir="ltr">
                        {spec.standard}
                      </td>
                      <td className="px-3.5 py-2.5 font-semibold text-foreground">
                        {spec.measuredValue}
                      </td>
                      <td className="px-3.5 py-2.5 text-muted-foreground">
                        {spec.referenceLimit}
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                          <Check className="h-3 w-3" />
                          مطلوب و تأیید
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications & Installation Recommendations */}
          <div className="grid gap-4 sm:grid-cols-2">
            {document.applications && document.applications.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
                <h5 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  کاربردهای مجاز و توصیه‌شده
                </h5>
                <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                  {document.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {document.maintenanceNotes && document.maintenanceNotes.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
                <h5 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  دستورالعمل‌های مهندسی نصب و نگهداری
                </h5>
                <ul className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                  {document.maintenanceNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Electronic Certification & QR Verification Seal */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-card p-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                <QrCode className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground">
                  شناسنامه الکترونیک اصالت متریال
                </div>
                <div className="text-[11px] text-muted-foreground">
                  بارکد استعلام صحت آزمون در سامانه یکپارچه استاندارد مصالح
                </div>
                <div className="font-mono text-[10px] text-primary" dir="ltr">
                  VERIFY: {document.docNumber} • HASH: 8F2A-99B4
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-center sm:text-end">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-emerald-700">
                <div className="text-[11px] font-bold">مهر دیجیتال کنترل کیفیت</div>
                <div className="text-[10px] text-emerald-600/80">امضای معتبر ناظر آزمایشگاه</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 p-4">
          <div className="text-xs text-muted-foreground">
            فایل دیجیتال: {document.fileFormat} • حجم: {document.fileSize}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs rounded-xl"
            >
              <Printer className="h-3.5 w-3.5" />
              چاپ سند
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onDownload(document)}
              className="gap-1.5 text-xs rounded-xl"
            >
              <Download className="h-3.5 w-3.5" />
              دانلود PDF رسمی
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs rounded-xl"
            >
              بستن
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
