"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Building2, Truck, FileText, CheckCircle2 } from "lucide-react";
import type { ExtendedFactoryOrder } from "../../stores/factory-orders-store";

interface OrderWaybillDialogProps {
  order: ExtendedFactoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  factoryName?: string;
}

export function OrderWaybillDialog({
  order,
  isOpen,
  onClose,
  factoryName = "کارخانه سنگ و سرامیک صنعت",
}: OrderWaybillDialogProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-border/80 bg-card rounded-2xl shadow-xl"
        dir="rtl"
      >
        <DialogHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-10 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            <DialogTitle className="text-sm font-bold text-foreground">
              حواله خروج سنگ از انبار کارخانه و بارنامه حمل
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>چاپ رسمی حواله</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Area */}
        <div ref={printContentRef} className="p-8 space-y-6 bg-white text-stone-900 text-xs font-sans">
          {/* Slip Header */}
          <div className="border-b-2 border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl">
                SC
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {factoryName}
                </h2>
                <p className="text-[11px] text-stone-600">
                  حواله رسمی خروج اسلب، تایل و بارنامه ترابری سنگ کارخانه
                </p>
              </div>
            </div>

            <div className="text-end space-y-1 text-[11px]">
              <div>
                <span className="text-stone-500">شماره سفارش: </span>
                <span className="font-mono font-bold text-stone-900" dir="ltr">
                  {order.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-stone-500">شماره بارنامه: </span>
                <span className="font-mono font-bold text-stone-900" dir="ltr">
                  {order.delivery?.trackingNumber ?? "BL-982410"}
                </span>
              </div>
              <div>
                <span className="text-stone-500">تاریخ صدور: </span>
                <span className="font-semibold text-stone-900">{order.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Consignor and Consignee Cards */}
          <div className="grid grid-cols-2 gap-4 border border-stone-300 rounded-lg p-3 bg-stone-50/50">
            {/* Sender */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                مبدأ (فرستنده و انبار کارخانه):
              </span>
              <p className="font-bold text-stone-900">{factoryName}</p>
              <p className="text-[11px] text-stone-700">
                شهرک صنعتی سنگ، فاز فرآوری سنگ‌های ساختمانی، واحد ۱۲
              </p>
              <p className="text-[10px] text-stone-600">
                تلفن کارخانه: ۰۳۱-۴۴۲۲۳۳۴۴ · انباردار شیفت: مهندس علوی
              </p>
            </div>

            {/* Receiver */}
            <div className="space-y-1 border-s border-stone-300 ps-4">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                مقصد (تحویل‌گیرنده و نشانی کارگاه):
              </span>
              <p className="font-bold text-stone-900">
                {order.customerName} {order.projectName ? `(${order.projectName})` : ""}
              </p>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {order.delivery?.address ?? "تهران، لواسان، پروژه نیلوفر"}
              </p>
              <p className="text-[10px] text-stone-600">
                شماره تماس تحویل‌گیرنده:{" "}
                <span className="font-mono" dir="ltr">{order.customerPhone ?? "۰۹۱۲۰۰۰۰۰۰۴"}</span>
              </p>
            </div>
          </div>

          {/* Stone Specifications Table */}
          <div>
            <h4 className="font-bold text-stone-800 mb-2 text-xs">
              مشخصات اقلام سنگ خروجی از انبار:
            </h4>
            <table className="w-full border-collapse border border-stone-300 text-center text-xs">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                  <th className="p-2 border-e border-stone-300 w-10">ردیف</th>
                  <th className="p-2 border-e border-stone-300 text-start">شرح کالا و نوع سنگ</th>
                  <th className="p-2 border-e border-stone-300">فرم / برش</th>
                  <th className="p-2 border-e border-stone-300">ابعاد (سانتی‌متر)</th>
                  <th className="p-2 border-e border-stone-300">ضخامت</th>
                  <th className="p-2 border-e border-stone-300">متراژ / تعداد</th>
                  <th className="p-2">وضعیت بسته‌بندی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-2 border-e border-stone-300 font-mono">۱</td>
                  <td className="p-2 border-e border-stone-300 text-start font-semibold">
                    {order.productName}
                  </td>
                  <td className="p-2 border-e border-stone-300">{order.form}</td>
                  <td className="p-2 border-e border-stone-300 font-mono">{order.dimensions}</td>
                  <td className="p-2 border-e border-stone-300 font-mono">{order.thickness}</td>
                  <td className="p-2 border-e border-stone-300 font-bold">{order.volume}</td>
                  <td className="p-2 text-[11px] text-stone-700">پالت A-Frame مقاوم تسمه‌دار</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transport & Handling Details */}
          <div className="grid grid-cols-3 gap-3 p-3 border border-stone-300 rounded-lg text-[11px] bg-stone-50">
            <div>
              <span className="text-stone-500 block">نوع ناوگان باربری:</span>
              <span className="font-semibold text-stone-900">{order.delivery?.method ?? "تریلی کفی سنگین"}</span>
            </div>
            <div>
              <span className="text-stone-500 block">باربری متعهد:</span>
              <span className="font-semibold text-stone-900">{order.delivery?.carrier ?? "ترابری سراسری سنگ"}</span>
            </div>
            <div>
              <span className="text-stone-500 block">تخلیه با جرثقیل در مقصد:</span>
              <span className="font-semibold text-stone-900">
                {order.delivery?.craneAccess ? "الزامی است (جرثقیل ۵ تن)" : "تخلیه دستی / لیفتراک"}
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border border-stone-200 rounded p-2.5 bg-amber-50/40 text-[11px] text-stone-800">
              <span className="font-bold">یادداشت فنی کارخانه: </span>
              <span>{order.notes}</span>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-300 text-center">
            <div className="space-y-8">
              <span className="font-bold text-stone-700">مسئول خروج انبار کارخانه</span>
              <div className="h-10 border-b border-dashed border-stone-400"></div>
              <span className="text-[10px] text-stone-500">امضا و مهر انبار</span>
            </div>
            <div className="space-y-8">
              <span className="font-bold text-stone-700">راننده حامل بار سنگ</span>
              <div className="h-10 border-b border-dashed border-stone-400"></div>
              <span className="text-[10px] text-stone-500">امضا و اثر انگشت راننده</span>
            </div>
            <div className="space-y-8">
              <span className="font-bold text-stone-700">تحویل‌گیرنده در پای کارگاه</span>
              <div className="h-10 border-b border-dashed border-stone-400"></div>
              <span className="text-[10px] text-stone-500">امضا و تایید سلامت سنگ‌ها</span>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border/70 bg-card print:hidden">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            بستن پنجره
          </Button>
          <Button size="sm" onClick={handlePrint} className="text-xs gap-1.5 shadow-xs">
            <Printer className="h-3.5 w-3.5" />
            <span>چاپ حواله انبار</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
