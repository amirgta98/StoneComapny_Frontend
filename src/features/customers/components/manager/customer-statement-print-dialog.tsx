"use client";

import { Printer, Download, X, Building2, CheckCircle2, ShieldCheck, MapPin, Phone, CreditCard, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FactoryCustomer } from "../../types";
import { exportCustomerStatementToCSV, ROLE_LABELS, CREDIT_STATUS_LABELS } from "../../lib/export-customers";

interface CustomerStatementPrintDialogProps {
  customer: FactoryCustomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factoryName?: string;
}

export function CustomerStatementPrintDialog({
  customer,
  open,
  onOpenChange,
  factoryName = "صنایع سنگ و سرامیک صنعت",
}: CustomerStatementPrintDialogProps) {
  if (!customer) return null;

  const todayFa = new Date().toLocaleDateString("fa-IR");
  const statementNumber = `STM-${customer.code}-${Date.now().toString().slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportCustomerStatementToCSV(customer);
  };

  const freeCredit = Math.max(0, customer.creditLimit - customer.currentBalance);
  const creditUsagePercent =
    customer.creditLimit > 0
      ? Math.min(100, Math.round((customer.currentBalance / customer.creditLimit) * 100))
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 border-border/80 bg-white text-zinc-900 shadow-2xl print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-full print:max-h-none print:overflow-visible print:bg-white"
        dir="rtl"
      >
        {/* Print Bar (hidden when printing) */}
        <div className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50 p-3 px-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-700">
              پیش‌نمایش رسمی صورت‌حساب مالی و گردش حساب مشتری
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-zinc-700 border-zinc-300 hover:bg-zinc-100"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5 ms-1" />
              خروجی اکسل (CSV)
            </Button>
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
              چاپ یا ذخیره PDF
            </Button>
          </div>
        </div>

        {/* Printable Official Statement Sheet */}
        <div className="p-8 sm:p-10 space-y-6 font-sans text-zinc-900 bg-white min-h-[850px] print:p-4 print:text-black">
          {/* 1. Header with Factory Seal & Document Info */}
          <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  سنگ
                </div>
                <h2 className="text-lg font-bold text-zinc-900">{factoryName}</h2>
              </div>
              <p className="text-xs text-zinc-600">
                مرکز فرآوری و تأمین اسلب‌های ساختمانی، مرمریت، تراورتن، گرانیت و مرمر
              </p>
            </div>

            <div className="text-left space-y-1 text-xs">
              <div className="inline-block bg-zinc-100 px-3 py-1 rounded border border-zinc-300 font-bold text-zinc-800">
                صورت‌حساب رسمی مالی مشتری
              </div>
              <div className="flex items-center justify-end gap-2 text-zinc-600">
                <span>شماره سند:</span>
                <span className="font-mono font-bold text-zinc-900">{statementNumber}</span>
              </div>
              <div className="flex items-center justify-end gap-2 text-zinc-600">
                <span>تاریخ گزارش:</span>
                <span className="font-mono text-zinc-900">{todayFa}</span>
              </div>
            </div>
          </div>

          {/* 2. Customer & Project Details Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
            <div>
              <span className="text-zinc-500 block text-[11px]">طرف حساب / مشتری:</span>
              <span className="font-bold text-zinc-900">{customer.name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">شرکت / مجموعه:</span>
              <span className="font-medium text-zinc-900">{customer.companyName || "-"}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">کد پرونده مشتری:</span>
              <span className="font-mono font-bold text-zinc-900">{customer.code}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">نقش همکاری:</span>
              <span className="font-medium text-zinc-900">{ROLE_LABELS[customer.role] || customer.role}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">شماره تماس:</span>
              <span className="font-mono text-zinc-900" dir="ltr">{customer.phone}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">کد ملی / شناسه ملی:</span>
              <span className="font-mono text-zinc-900">{customer.nationalId || "-"}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">پروژه فعال:</span>
              <span className="font-medium text-zinc-900">{customer.projectName || "سفارش مستقیم"}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">شهر و موقعیت:</span>
              <span className="text-zinc-900">{customer.city}</span>
            </div>
          </div>

          {/* 3. Financial Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <span className="text-zinc-500 block text-[11px]">مانده بدهی جاری</span>
              <p className="text-base font-bold text-zinc-900 mt-1">
                {customer.currentBalance.toLocaleString("fa-IR")} <span className="text-[11px] font-normal text-zinc-500">تومان</span>
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <span className="text-zinc-500 block text-[11px]">سقف اعتبار مصوب</span>
              <p className="text-base font-bold text-zinc-900 mt-1">
                {customer.creditLimit.toLocaleString("fa-IR")} <span className="text-[11px] font-normal text-zinc-500">تومان</span>
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <span className="text-zinc-500 block text-[11px]">چک‌های در جریان وصول</span>
              <p className="text-base font-bold text-zinc-900 mt-1">
                {customer.pendingChecksTotal.toLocaleString("fa-IR")} <span className="text-[11px] font-normal text-zinc-500">تومان</span>
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <span className="text-zinc-500 block text-[11px]">اعتبار آزاد باقی‌مانده</span>
              <p className="text-base font-bold text-emerald-700 mt-1">
                {freeCredit.toLocaleString("fa-IR")} <span className="text-[11px] font-normal text-zinc-500">تومان</span>
              </p>
            </div>
          </div>

          {/* 4. Financial Ledger Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center justify-between">
              <span>ریز اسناد مالی و گردش حساب (بدهکار / بستانکار)</span>
              <span className="text-[11px] font-normal text-zinc-500">
                تعداد اسناد: {customer.financialLedger.length.toLocaleString("fa-IR")}
              </span>
            </h3>

            <div className="border border-zinc-300 rounded overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-700">
                    <th className="p-2 border-l border-zinc-300 text-center w-10">ردیف</th>
                    <th className="p-2 border-l border-zinc-300 w-24">تاریخ</th>
                    <th className="p-2 border-l border-zinc-300 w-28">نوع سند</th>
                    <th className="p-2 border-l border-zinc-300 w-28">شماره سند</th>
                    <th className="p-2 border-l border-zinc-300">شرح تراکنش</th>
                    <th className="p-2 border-l border-zinc-300 w-28 text-left">بدهکار (تومان)</th>
                    <th className="p-2 border-l border-zinc-300 w-28 text-left">بستانکار (تومان)</th>
                    <th className="p-2 text-left w-28">مانده بدهی (تومان)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {customer.financialLedger.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-zinc-500">
                        هیچ سند مالی در این پرونده ثبت نشده است.
                      </td>
                    </tr>
                  ) : (
                    customer.financialLedger.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-zinc-50">
                        <td className="p-2 border-l border-zinc-200 text-center font-mono text-zinc-500">{idx + 1}</td>
                        <td className="p-2 border-l border-zinc-200 font-mono">{item.date}</td>
                        <td className="p-2 border-l border-zinc-200 font-medium">{item.typeLabel}</td>
                        <td className="p-2 border-l border-zinc-200 font-mono">{item.documentNumber}</td>
                        <td className="p-2 border-l border-zinc-200">{item.description}</td>
                        <td className="p-2 border-l border-zinc-200 text-left font-semibold tabular-nums">
                          {item.debit > 0 ? item.debit.toLocaleString("fa-IR") : "-"}
                        </td>
                        <td className="p-2 border-l border-zinc-200 text-left font-semibold text-emerald-700 tabular-nums">
                          {item.credit > 0 ? item.credit.toLocaleString("fa-IR") : "-"}
                        </td>
                        <td className="p-2 text-left font-bold tabular-nums">
                          {item.balance.toLocaleString("fa-IR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Checks Summary Table (if any) */}
          {customer.checks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-900 flex items-center justify-between">
                <span>چک‌های صیادی تودیع‌شده</span>
                <span className="text-[11px] font-normal text-zinc-500">
                  {customer.checks.length.toLocaleString("fa-IR")} فقره چک
                </span>
              </h3>

              <div className="border border-zinc-300 rounded overflow-hidden">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-700">
                      <th className="p-2 border-l border-zinc-300 text-center w-10">ردیف</th>
                      <th className="p-2 border-l border-zinc-300">شماره چک</th>
                      <th className="p-2 border-l border-zinc-300">شناسه صیاد</th>
                      <th className="p-2 border-l border-zinc-300">بانک و شعبه</th>
                      <th className="p-2 border-l border-zinc-300">تاریخ سررسید</th>
                      <th className="p-2 border-l border-zinc-300 text-left">مبلغ چک (تومان)</th>
                      <th className="p-2">وضعیت وصول</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {customer.checks.map((chk, idx) => (
                      <tr key={chk.id} className="hover:bg-zinc-50">
                        <td className="p-2 border-l border-zinc-200 text-center font-mono text-zinc-500">{idx + 1}</td>
                        <td className="p-2 border-l border-zinc-200 font-mono font-medium">{chk.checkNumber}</td>
                        <td className="p-2 border-l border-zinc-200 font-mono text-[11px]" dir="ltr">{chk.sayadId || "-"}</td>
                        <td className="p-2 border-l border-zinc-200">{chk.bankName} {chk.branch ? `(${chk.branch})` : ""}</td>
                        <td className="p-2 border-l border-zinc-200 font-mono">{chk.dueDate}</td>
                        <td className="p-2 border-l border-zinc-200 text-left font-semibold tabular-nums">
                          {chk.amount.toLocaleString("fa-IR")}
                        </td>
                        <td className="p-2 font-medium">
                          {chk.status === "cleared" ? "وصول شد" : chk.status === "bounced" ? "برگشت خورده" : "در جریان وصول"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Payment Terms Note */}
          <div className="p-3 bg-zinc-50 rounded border border-zinc-200 text-xs text-zinc-700">
            <span className="font-bold text-zinc-900 block mb-1">شرایط پرداخت و تسویه حساب توافق‌شده:</span>
            <p>{customer.paymentTerms || "تسویه نقدی پیش از بارگیری سفارشات."}</p>
          </div>

          {/* 7. Official Stamps & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-zinc-300 text-xs text-center">
            <div className="space-y-12">
              <p className="font-bold text-zinc-800">مهر و امضای مدیریت مالی کارخانه سنگ</p>
              <div className="h-16 border-b border-dashed border-zinc-400 w-48 mx-auto" />
              <p className="text-[11px] text-zinc-500">واحد حسابداری و اعتبارات</p>
            </div>

            <div className="space-y-12">
              <p className="font-bold text-zinc-800">تأییدیه و امضای مشتری / کارفرما</p>
              <div className="h-16 border-b border-dashed border-zinc-400 w-48 mx-auto" />
              <p className="text-[11px] text-zinc-500">{customer.name} ({customer.companyName || "شخص حقیقی"})</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
