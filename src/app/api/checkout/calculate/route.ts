import { NextResponse } from "next/server";
import { testProducts } from "@/features/products/data/test-products";
import { STONE_SHIPPING_METHODS } from "@/features/checkout/constants/shipping-methods";
import { VALID_COUPONS } from "@/features/checkout/constants/payment-methods";
import { checkoutCalculationSchema } from "@/features/checkout/schemas/checkout-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutCalculationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { items, shippingMethodId, couponCode } = parsed.data;

    // Server-side authoritative subtotal calculation
    let subtotal = 0;
    for (const item of items) {
      const dbProduct = testProducts.find((p) => p.id === item.productId);
      const unitPrice = dbProduct?.price ?? item.price ?? 0;
      subtotal += unitPrice * item.quantity;
    }

    // Server-side shipping fee calculation
    const shippingMethod = STONE_SHIPPING_METHODS.find(
      (m) => m.id === shippingMethodId
    );
    const shippingFee = shippingMethod ? shippingMethod.price : 0;

    // Server-side coupon discount calculation
    let discount = 0;
    let appliedCoupon: string | undefined = undefined;

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = VALID_COUPONS[cleanCode];
      if (coupon) {
        if (!coupon.minOrderSubtotal || subtotal >= coupon.minOrderSubtotal) {
          appliedCoupon = cleanCode;
          if (coupon.discountType === "percent") {
            discount = Math.round((subtotal * coupon.amount) / 100);
          } else {
            discount = Math.min(coupon.amount, subtotal);
          }
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = 0; // Natural stone direct supplier rules
    const total = Math.max(0, taxableAmount + shippingFee + tax);

    return NextResponse.json({
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      appliedCoupon,
      itemsCount: items.length,
    });
  } catch (error) {
    console.error("Error in /api/checkout/calculate:", error);
    return NextResponse.json(
      {
        error: "خطا در محاسبه مبالغ سفارش",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
