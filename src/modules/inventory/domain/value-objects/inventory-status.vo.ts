/**
 * Inventory Domain Value Objects and Enums
 */

export type InventoryItemStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "QUALITY_CHECK"
  | "DAMAGED"
  | "BLOCKED"
  | "SCRAPPED";

export type LocationType =
  | "WAREHOUSE"
  | "HALL"
  | "RACK"
  | "YARD"
  | "AREA"
  | "OTHER";

export type MovementType =
  | "INITIAL"
  | "RECEIPT"
  | "ISSUE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "RESERVATION_HOLD"
  | "RESERVATION_RELEASE"
  | "RESERVATION_CONSUME";

export type ReceiptStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export type IssueStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export type TransferStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export type StockCountStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type InventoryUnit =
  | "sqm"
  | "piece"
  | "slab"
  | "tile"
  | "box"
  | "ton"
  | "kg"
  | "other";

export const INVENTORY_UNIT_LABELS: Record<InventoryUnit, string> = {
  sqm: "متر مربع",
  piece: "عدد / قطعه",
  slab: "اسلب",
  tile: "تایل",
  box: "کارتن",
  ton: "تن",
  kg: "کیلوگرم",
  other: "سایر",
};

export const INVENTORY_STATUS_LABELS: Record<InventoryItemStatus, string> = {
  AVAILABLE: "موجود و قابل فروش",
  RESERVED: "رزرو شده",
  QUALITY_CHECK: "کنترل کیفی (QC)",
  DAMAGED: "معیوب / آسیب‌دیده",
  BLOCKED: "مسدود شده",
  SCRAPPED: "ضایعات / لاشه",
};

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  INITIAL: "موجودی اولیه",
  RECEIPT: "رسید ورود به انبار",
  ISSUE: "حواله خروج از انبار",
  TRANSFER_IN: "انتقال ورودی",
  TRANSFER_OUT: "انتقال خروجی",
  ADJUSTMENT_IN: "تعدیل افزایشی",
  ADJUSTMENT_OUT: "تعدیل کاهشی",
  RESERVATION_HOLD: "ثبت رزرو",
  RESERVATION_RELEASE: "آزادسازی رزرو",
  RESERVATION_CONSUME: "مصرف رزرو",
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  WAREHOUSE: "انبار مرکزی",
  HALL: "سوله / سالن",
  RACK: "خرک / پالت",
  YARD: "محوطه دپو",
  AREA: "بخش اختصاصی",
  OTHER: "سایر",
};
