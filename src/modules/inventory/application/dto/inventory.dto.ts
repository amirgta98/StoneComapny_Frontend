import { z } from "zod";

export const createReceiptSchema = z.object({
  source: z.enum(["PRODUCTION", "SUPPLIER", "PURCHASE", "RETURN", "OTHER"]),
  supplierName: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  unit: z.enum(["sqm", "piece", "slab", "tile", "box", "ton", "kg", "other"]),
  items: z.array(
    z.object({
      inventoryItemId: z.string().optional(),
      productId: z.string().min(1, "انتخاب محصول الزامی است"),
      productName: z.string().min(1, "نام سنگ الزامی است"),
      stoneType: z.string(),
      dimensions: z.string().optional(),
      thickness: z.number().optional(),
      grade: z.string().optional(),
      batchNumber: z.string().optional(),
      slabId: z.string().optional(),
      locationId: z.string().min(1, "انتخاب موقعیت انبار الزامی است"),
      locationName: z.string().min(1, "نام موقعیت الزامی است"),
      quantity: z.number().positive("مقدار ورودی باید بیشتر از صفر باشد"),
      unit: z.enum(["sqm", "piece", "slab", "tile", "box", "ton", "kg", "other"]),
      unitCost: z.number().nonnegative(),
      notes: z.string().optional(),
    })
  ).min(1, "حداقل یک ردیف کالا برای رسید الزامی است"),
});

export type CreateReceiptInput = z.infer<typeof createReceiptSchema>;

export const createIssueSchema = z.object({
  reason: z.enum([
    "ORDER_FULFILLMENT",
    "FACTORY_CONSUMPTION",
    "SAMPLE",
    "DAMAGE",
    "SCRAP",
    "TRANSFER",
    "OTHER",
  ]),
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  unit: z.enum(["sqm", "piece", "slab", "tile", "box", "ton", "kg", "other"]),
  items: z.array(
    z.object({
      inventoryItemId: z.string().min(1, "انتخاب کالا الزامی است"),
      productId: z.string(),
      productName: z.string(),
      stoneType: z.string(),
      locationId: z.string(),
      locationName: z.string(),
      quantity: z.number().positive("مقدار خروجی باید مثبت باشد"),
      unit: z.enum(["sqm", "piece", "slab", "tile", "box", "ton", "kg", "other"]),
      slabId: z.string().optional(),
      notes: z.string().optional(),
    })
  ).min(1, "حداقل یک ردیف کالا الزامی است"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export const transferStockSchema = z.object({
  inventoryItemId: z.string().min(1, "انتخاب کالا الزامی است"),
  sourceLocationId: z.string().min(1, "انبار مبدا الزامی است"),
  destinationLocationId: z.string().min(1, "انبار مقصد الزامی است"),
  quantity: z.number().positive("مقدار انتقال باید بیشتر از صفر باشد"),
  reason: z.string().optional(),
});

export type TransferStockInput = z.infer<typeof transferStockSchema>;

export const reserveStockSchema = z.object({
  inventoryItemId: z.string().min(1, "کالا الزامی است"),
  quantity: z.number().positive("مقدار رزرو باید مثبت باشد"),
  orderId: z.string().optional(),
  orderNumber: z.string().optional(),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type ReserveStockInput = z.infer<typeof reserveStockSchema>;

export const createStockAdjustmentSchema = z.object({
  inventoryItemId: z.string().min(1, "انتخاب کالا الزامی است"),
  quantityChange: z.number().refine((val) => val !== 0, "مقدار تغییر نمی‌تواند صفر باشد"),
  targetProperty: z.enum(["onHand", "damaged", "qualityCheck", "scrap"]),
  reason: z.string().min(2, "دلیل تعدیل الزامی است"),
  referenceType: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateStockAdjustmentInput = z.infer<typeof createStockAdjustmentSchema>;

export const createLocationSchema = z.object({
  name: z.string().min(2, "نام موقعیت انبار الزامی است"),
  code: z.string().min(2, "کد شناسه انبار الزامی است"),
  parentId: z.string().optional(),
  type: z.enum(["WAREHOUSE", "HALL", "RACK", "YARD", "AREA", "OTHER"]),
  capacitySqm: z.number().positive().optional(),
  description: z.string().optional(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;

export const createStockCountSchema = z.object({
  title: z.string().min(2, "عنوان انبارگردانی الزامی است"),
  locationId: z.string().min(1, "انتخاب موقعیت انبار الزامی است"),
  notes: z.string().optional(),
  itemIds: z.array(z.string()).optional(),
});

export type CreateStockCountInput = z.infer<typeof createStockCountSchema>;

export const completeStockCountSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      inventoryItemId: z.string(),
      physicalQuantity: z.number().nonnegative(),
      notes: z.string().optional(),
    })
  ).min(1, "ثبت حداقل یک قلم کالا الزامی است"),
});

export type CompleteStockCountInput = z.infer<typeof completeStockCountSchema>;
