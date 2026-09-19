import type { FactoryCustomer } from "../types";

export const ROLE_LABELS: Record<FactoryCustomer["role"], string> = {
  CONTRACTOR: "پیمانکار و مجری ساختمانی",
  ARCHITECT: "معمار و طراح داخلی",
  SHOWROOM: "نمایشگاه‌دار و سنگ‌فروشی",
  RETAIL: "خریدار خرد / شخصی",
};

export const CREDIT_STATUS_LABELS: Record<FactoryCustomer["creditStatus"], string> = {
  safe: "معتبر (سقف باز)",
  warning: "نزدیک به سقف اعتبار",
  blocked: "مسدود اعتباری",
};

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""').replace(/\r?\n/g, " ");
  return `"${str}"`;
}

/**
 * Export customer list to CSV with UTF-8 BOM for Persian Excel compatibility.
 */
export function exportCustomersToCSV(customers: FactoryCustomer[], filename?: string) {
  const defaultFilename = `stone-customers-${new Date().toISOString().slice(0, 10)}.csv`;
  const actualFilename = filename || defaultFilename;

  const headers = [
    "کد مشتری",
    "نام مشتری",
    "شرکت / برند",
    "نقش همکاری",
    "شماره تماس",
    "ایمیل",
    "کد ملی / شناسه",
    "کد اقتصادی",
    "پروژه فعال",
    "شهر پروژه",
    "آدرس کارگاه / تخلیه",
    "سنگ‌های پرمصرف",
    "متراژ خریداری‌شده (م²)",
    "تعداد سفارش‌ها",
    "سقف اعتبار (تومان)",
    "مانده حساب (تومان)",
    "چک‌های در جریان (تومان)",
    "وضعیت اعتبار",
    "شرایط تسویه",
  ];

  const rows = customers.map((c) => [
    escapeCsvField(c.code),
    escapeCsvField(c.name),
    escapeCsvField(c.companyName || "-"),
    escapeCsvField(ROLE_LABELS[c.role] || c.role),
    escapeCsvField(c.phone),
    escapeCsvField(c.email || "-"),
    escapeCsvField(c.nationalId || "-"),
    escapeCsvField(c.economicCode || "-"),
    escapeCsvField(c.projectName || "-"),
    escapeCsvField(c.city || "-"),
    escapeCsvField(c.address || "-"),
    escapeCsvField((c.preferredStones || []).join("، ")),
    escapeCsvField(c.totalPurchasedSqm),
    escapeCsvField(c.totalOrdersCount),
    escapeCsvField(c.creditLimit),
    escapeCsvField(c.currentBalance),
    escapeCsvField(c.pendingChecksTotal),
    escapeCsvField(CREDIT_STATUS_LABELS[c.creditStatus] || c.creditStatus),
    escapeCsvField(c.paymentTerms || "-"),
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  downloadBlob(csvContent, actualFilename);
}

/**
 * Export a single customer's full financial statement (گردش حساب و صورت‌حساب مالی)
 * to CSV with UTF-8 BOM.
 */
export function exportCustomerStatementToCSV(customer: FactoryCustomer, filename?: string) {
  const todayFa = new Date().toLocaleDateString("fa-IR");
  const defaultFilename = `statement-${customer.code}-${new Date().toISOString().slice(0, 10)}.csv`;
  const actualFilename = filename || defaultFilename;

  const lines: string[] = [
    // Header Info
    [escapeCsvField("صورت‌حساب رسمی و گردش مالی کارخانه سنگ")].join(","),
    [escapeCsvField("تاریخ صدور گزارش"), escapeCsvField(todayFa)].join(","),
    [escapeCsvField("نام مشتری / مخاطب"), escapeCsvField(customer.name)].join(","),
    [escapeCsvField("کد پرونده"), escapeCsvField(customer.code)].join(","),
    [escapeCsvField("شرکت / برند"), escapeCsvField(customer.companyName || "-")].join(","),
    [escapeCsvField("نقش همکاری"), escapeCsvField(ROLE_LABELS[customer.role] || customer.role)].join(","),
    [escapeCsvField("شماره تماس"), escapeCsvField(customer.phone)].join(","),
    [escapeCsvField("کد ملی / شناسه"), escapeCsvField(customer.nationalId || "-")].join(","),
    [escapeCsvField("پروژه فعال"), escapeCsvField(customer.projectName || "-")].join(","),
    [escapeCsvField("سقف اعتبار مصوب (تومان)"), escapeCsvField(customer.creditLimit.toLocaleString("fa-IR"))].join(","),
    [escapeCsvField("مانده حساب جاری (تومان)"), escapeCsvField(customer.currentBalance.toLocaleString("fa-IR"))].join(","),
    [escapeCsvField("مجموع چک‌های در جریان (تومان)"), escapeCsvField(customer.pendingChecksTotal.toLocaleString("fa-IR"))].join(","),
    [escapeCsvField("وضعیت اعتبار"), escapeCsvField(CREDIT_STATUS_LABELS[customer.creditStatus] || customer.creditStatus)].join(","),
    [escapeCsvField("شرایط تسویه مصوب"), escapeCsvField(customer.paymentTerms || "-")].join(","),
    "",
    // Section 1: Financial Ledger
    [escapeCsvField("--- ریز اسناد مالی و گردش بدهکار/بستانکار ---")].join(","),
    [
      escapeCsvField("ردیف"),
      escapeCsvField("تاریخ"),
      escapeCsvField("نوع سند"),
      escapeCsvField("شماره سند"),
      escapeCsvField("شرح تراکنش"),
      escapeCsvField("بدهکار (افزایش بدهی - تومان)"),
      escapeCsvField("بستانکار (پرداخت - تومان)"),
      escapeCsvField("مانده بدهی (تومان)"),
      escapeCsvField("نحوه پرداخت / ارجاع"),
    ].join(","),
  ];

  const ledger = customer.financialLedger || [];
  if (ledger.length === 0) {
    lines.push([escapeCsvField("موردی ثبت نشده است")].join(","));
  } else {
    ledger.forEach((item, idx) => {
      lines.push(
        [
          escapeCsvField(idx + 1),
          escapeCsvField(item.date),
          escapeCsvField(item.typeLabel || item.type),
          escapeCsvField(item.documentNumber),
          escapeCsvField(item.description),
          escapeCsvField(item.debit),
          escapeCsvField(item.credit),
          escapeCsvField(item.balance),
          escapeCsvField(item.paymentMethod || "-"),
        ].join(",")
      );
    });
  }

  // Section 2: Checks
  lines.push("");
  lines.push([escapeCsvField("--- فهرست چک‌های صیادی دریافت شده ---")].join(","));
  lines.push(
    [
      escapeCsvField("ردیف"),
      escapeCsvField("شماره چک"),
      escapeCsvField("شناسه ۱۶ رقمی صیاد"),
      escapeCsvField("بانک و شعبه"),
      escapeCsvField("تاریخ سررسید"),
      escapeCsvField("مبلغ چک (تومان)"),
      escapeCsvField("صادرکننده"),
      escapeCsvField("وضعیت وصول"),
      escapeCsvField("تاریخ ثبت"),
      escapeCsvField("توضیحات"),
    ].join(",")
  );

  const checks = customer.checks || [];
  if (checks.length === 0) {
    lines.push([escapeCsvField("چکی ثبت نشده است")].join(","));
  } else {
    checks.forEach((chk, idx) => {
      lines.push(
        [
          escapeCsvField(idx + 1),
          escapeCsvField(chk.checkNumber),
          escapeCsvField(chk.sayadId || "-"),
          escapeCsvField(`${chk.bankName} ${chk.branch ? `(${chk.branch})` : ""}`),
          escapeCsvField(chk.dueDate),
          escapeCsvField(chk.amount),
          escapeCsvField(chk.drawerName),
          escapeCsvField(chk.statusLabel || chk.status),
          escapeCsvField(chk.registeredDate),
          escapeCsvField(chk.notes || "-"),
        ].join(",")
      );
    });
  }

  const csvContent = "\uFEFF" + lines.join("\r\n");
  downloadBlob(csvContent, actualFilename);
}

function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
