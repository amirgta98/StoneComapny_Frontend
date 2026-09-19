import { AppError } from "@/lib/errors/app-error";

export class InsufficientStockError extends AppError {
  constructor(
    available: number,
    requested: number,
    itemLabel = "این سنگ",
    unit = "متر مربع"
  ) {
    super(
      `موجودی قابل استفاده برای ${itemLabel} کافی نیست. موجودی در دسترس: ${available} ${unit}، مقدار درخواستی: ${requested} ${unit}.`,
      400,
      "INSUFFICIENT_STOCK",
      { available, requested, unit }
    );
  }
}

export class NegativeStockError extends AppError {
  constructor(current: number, deduction: number) {
    super(
      `عملیات نامعتبر: ثبت این تغییر باعث منفی شدن موجودی می‌شود (موجودی فعلی: ${current}، کسر: ${deduction}).`,
      400,
      "NEGATIVE_STOCK_PREVENTED",
      { current, deduction }
    );
  }
}

export class InventoryItemNotFoundError extends AppError {
  constructor(id: string) {
    super(`کالای انبار با شناسه ${id} یافت نشد.`, 404, "INVENTORY_ITEM_NOT_FOUND", { id });
  }
}

export class WarehouseLocationNotFoundError extends AppError {
  constructor(id: string) {
    super(`موقعیت فیزیکی انبار با شناسه ${id} یافت نشد.`, 404, "LOCATION_NOT_FOUND", { id });
  }
}

export class InvalidTransferError extends AppError {
  constructor(reason: string) {
    super(`امکان انتقال انبار وجود ندارد: ${reason}`, 400, "INVALID_TRANSFER", { reason });
  }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(fromStatus: string, toStatus: string) {
    super(
      `تغییر وضعیت نامعتبر است: امکان انتقال از وضعیت ${fromStatus} به ${toStatus} وجود ندارد.`,
      400,
      "INVALID_STATUS_TRANSITION",
      { fromStatus, toStatus }
    );
  }
}
