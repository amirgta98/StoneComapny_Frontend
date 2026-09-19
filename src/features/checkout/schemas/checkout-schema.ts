import { z } from "zod";

export const checkoutCalculationSchema = z.object({
  shippingMethodId: z.string().min(1, "روش ارسال را انتخاب نمایید"),
  couponCode: z.string().optional(),
  addressId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1),
        price: z.number().optional(),
      })
    )
    .min(1, "سبد خرید نمی‌تواند خالی باشد"),
});

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "انتخاب آدرس تحویل بار الزامی است"),
  shippingMethodId: z.string().min(1, "انتخاب روش ارسال الزامی است"),
  paymentMethod: z.enum(["online", "bank_transfer", "on_delivery"], {
    message: "انتخاب روش پرداخت الزامی است",
  }),
  paymentGateway: z.enum(["saman", "mellat", "zarinpal"]).optional(),
  couponCode: z.string().optional(),
  notes: z.string().max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد").optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        name: z.string(),
        slug: z.string(),
        image: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().min(1),
        unit: z.string().optional(),
        sellUnit: z.string().optional(),
      })
    )
    .min(1, "سبد خرید خالی است"),
  unloadingRequirements: z
    .object({
      craneNeeded: z.boolean().optional(),
      forkliftNeeded: z.boolean().optional(),
    })
    .optional(),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(1, "شناسه سفارش نامعتبر است"),
  paymentToken: z.string().min(1, "توکن پرداخت نامعتبر است"),
  gateway: z.string().min(1, "درگاه پرداخت نامعتبر است"),
  trackingNumber: z.string().optional(),
  cardPan: z.string().optional(),
  status: z.enum(["success", "failed"]),
});

export type CheckoutCalculationInput = z.infer<typeof checkoutCalculationSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type PaymentVerifyInput = z.infer<typeof paymentVerifySchema>;
