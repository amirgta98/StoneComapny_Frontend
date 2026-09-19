"use client";

import { Printer, X, Building, ShieldCheck, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FactoryInquiryItem } from "../types";

interface InquiryPrintPreviewDialogProps {
  inquiry: FactoryInquiryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InquiryPrintPreviewDialog({
  inquiry,
  open,
  onOpenChange,
}: InquiryPrintPreviewDialogProps) {
  if (!inquiry) return null;

  const quote = inquiry.quotation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 border-border/80 bg-white text-zinc-900 shadow-2xl print:m-0 print:p-0 print:border-none print:shadow-none"
        dir="rtl"
      >
        {/* Print Bar (hidden when printing) */}
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50 p-3 px-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-700">
              پیش‌نمایش پیش‌فاکتور رسمی سنگ کارخانه
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-zinc-700 border-zinc-300 hover:bg-zinc-100"
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={handlePrint}
            >
              <Printer className="h-3.5 w-3.5" />
              پرینت یا ذخیره PDF
            </Button>
          </div>
        </div>

        {/* Formal A4 Letterhead Document */}
        <div className="p-8 sm:p-12 space-y-6 font-sans text-zinc-900 bg-white min-h-[800px]">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  ST
                </div>
                <h1 className="text-lg sm:text-xl font-black text-zinc-900">
                  کارخانجات سنگ و فرآوری تخصصی اسلب
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500">
                برش، ساب، رزین نانو و خدمات تخصصی اسلب‌های صادراتی ساختمانی
              </p>
            </div>

            <div className="text-left space-y-1 text-xs font-mono">
              <div>
                <span className="text-zinc-500">شماره پیش‌فاکتور: </span>
                <span className="font-bold text-zinc-900">{inquiry.rfqNumber}</span>
              </div>
              <div>
                <span className="text-zinc-500">تاریخ صدور: </span>
                <span className="text-zinc-900">{quote?.quoteDate || inquiry.createdAt}</span>
              </div>
              <div>
                <span className="text-zinc-500">اعتبار پیشنهاد: </span>
                <span className="text-zinc-900">{quote?.validityDays || 7} روز کاری</span>
              </div>
            </div>
          </div>

          {/* Customer & Project Info Boxes */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded border border-zinc-300 p-3 space-y-1.5 bg-zinc-50/50">
              <div className="font-bold text-zinc-900 border-b border-zinc-200 pb-1">
                اطلاعات خریدار / متقاضی:
              </div>
              <div>
                <span className="text-zinc-500">نام شخص یا شرکت: </span>
                <span className="font-semibold text-zinc-900">
                  {inquiry.customerName}{" "}
                  {inquiry.customerCompany ? `(${inquiry.customerCompany})` : ""}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">نقش متقاضی: </span>
                <span className="text-zinc-900">{inquiry.customerRole}</span>
              </div>
              <div>
                <span className="text-zinc-500">تلفن تماس: </span>
                <span className="font-mono text-zinc-900">{inquiry.customerPhone}</span>
              </div>
            </div>

            <div className="rounded border border-zinc-300 p-3 space-y-1.5 bg-zinc-50/50">
              <div className="font-bold text-zinc-900 border-b border-zinc-200 pb-1">
                اطلاعات پروژه و تحویل:
              </div>
              <div>
                <span className="text-zinc-500">نام پروژه: </span>
                <span className="font-semibold text-zinc-900">{inquiry.projectName}</span>
              </div>
              <div>
                <span className="text-zinc-500">شهر مقصد: </span>
                <span className="text-zinc-900">{inquiry.projectCity}</span>
              </div>
              <div>
                <span className="text-zinc-500">مرحله ساخت: </span>
                <span className="text-zinc-900">{inquiry.projectStage || "درحال اجرا"}</span>
              </div>
            </div>
          </div>

          {/* Table of Stone Items */}
          <div className="space-y-2">
            <div className="font-bold text-xs text-zinc-900">مشخصات فنی و قیمت اقلام:</div>
            <table className="w-full border-collapse border border-zinc-300 text-xs">
              <thead>
                <tr className="bg-zinc-100 text-zinc-800 text-center font-bold">
                  <th className="border border-zinc-300 p-2 w-12">ردیف</th>
                  <th className="border border-zinc-300 p-2 text-right">شرح سنگ و فرآوری</th>
                  <th className="border border-zinc-300 p-2 w-28">ابعاد و ضخامت</th>
                  <th className="border border-zinc-300 p-2 w-24">مقدار / متراژ</th>
                  <th className="border border-zinc-300 p-2 w-32">قیمت واحد (تومان)</th>
                  <th className="border border-zinc-300 p-2 w-36">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-zinc-300">
                  <td className="border border-zinc-300 p-2.5 text-center font-mono">۱</td>
                  <td className="border border-zinc-300 p-2.5 text-right">
                    <div className="font-bold text-zinc-900">{inquiry.stoneTitle}</div>
                    <div className="text-[11px] text-zinc-500">
                      نوع: {inquiry.stoneType} • فینیش: {inquiry.finish}
                    </div>
                  </td>
                  <td className="border border-zinc-300 p-2.5 text-center text-[11px]">
                    {inquiry.dimensions || inquiry.form}
                    <br />
                    ضخامت {inquiry.thickness}
                  </td>
                  <td className="border border-zinc-300 p-2.5 text-center font-bold">
                    {inquiry.volume}
                  </td>
                  <td className="border border-zinc-300 p-2.5 text-center font-mono">
                    {quote?.unitPrice
                      ? quote.unitPrice.toLocaleString("fa-IR")
                      : "استعلام برآوردی"}
                  </td>
                  <td className="border border-zinc-300 p-2.5 text-center font-mono font-bold">
                    {quote?.subtotal ? quote.subtotal.toLocaleString("fa-IR") : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Box */}
          <div className="flex justify-end">
            <div className="w-72 rounded border border-zinc-300 p-3 space-y-1.5 text-xs bg-zinc-50">
              <div className="flex justify-between">
                <span className="text-zinc-600">جمع کل ناخالص:</span>
                <span className="font-mono">
                  {quote?.subtotal ? quote.subtotal.toLocaleString("fa-IR") : "—"} تومان
                </span>
              </div>
              {quote && quote.discountAmount > 0 && (
                <div className="flex justify-between text-zinc-700">
                  <span>تخفیف همکاری ({quote.discountPercent}٪):</span>
                  <span className="font-mono text-rose-700">
                    -{quote.discountAmount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              )}
              {quote && quote.taxAmount > 0 && (
                <div className="flex justify-between text-zinc-700">
                  <span>مالیات بر ارزش افزوده:</span>
                  <span className="font-mono">+{quote.taxAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              )}
              <div className="border-t border-zinc-300 pt-1.5 flex justify-between font-bold text-sm text-zinc-900">
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className="font-mono">
                  {quote?.finalPrice ? quote.finalPrice.toLocaleString("fa-IR") : "—"} تومان
                </span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border border-zinc-200 rounded p-3 text-xs space-y-1 bg-zinc-50/30">
            <div className="font-bold text-zinc-900">شرایط و الزامات قرارداد:</div>
            <ul className="list-disc list-inside text-zinc-600 space-y-0.5 text-[11px]">
              <li>
                <strong>زمان آماده‌سازی و برش:</strong>{" "}
                {quote?.deliveryLeadDays || 10} روز کاری پس از دریافت پیش‌پرداخت رسمی.
              </li>
              <li>
                <strong>شرایط پرداخت:</strong> {quote?.paymentTerms || "توافقی"}
              </li>
              <li>
                <strong>منبع سنگ:</strong> {quote?.quarrySource || "معدن کارخانه درجه یک"}
              </li>
              {quote?.quoteNotes && (
                <li>
                  <strong>توضیحات:</strong> {quote.quoteNotes}
                </li>
              )}
            </ul>
          </div>

          {/* Signatures & Stamp */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border border-dashed border-zinc-300 rounded p-6 h-28 flex flex-col justify-between">
              <span className="text-zinc-500">امضا و تایید خریدار / کارفرما</span>
              <span className="text-[10px] text-zinc-400">نام و تاریخ تایید</span>
            </div>

            <div className="border border-dashed border-zinc-300 rounded p-6 h-28 flex flex-col justify-between">
              <span className="text-zinc-500">مهر و امضای مدیریت بازرگانی کارخانه</span>
              <div className="flex items-center justify-center gap-2 text-zinc-400 text-[10px]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>سامانه یکپارچه فروش سنگ کارخانه</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
