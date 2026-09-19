import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeSessionCookie, MOCK_SESSION_COOKIE } from "@/auth/session-codec";
import { testProducts } from "@/features/products/data/test-products";
import { STONE_SHIPPING_METHODS } from "@/features/checkout/constants/shipping-methods";
import { VALID_COUPONS } from "@/features/checkout/constants/payment-methods";
import { createOrderSchema } from "@/features/checkout/schemas/checkout-schema";
import type { CustomerOrder, OrderItem } from "@/features/account/data/mock-data";
import { mockOrders } from "@/features/account/data/mock-data";
import {
  runtimeOrders,
  runtimePaymentSessions,
} from "../runtime-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات سفارش نامعتبر است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      items,
      addressId,
      shippingMethodId,
      paymentMethod,
      paymentGateway,
      couponCode,
      notes,
      unloadingRequirements,
    } = parsed.data;

    // Resolve authenticated user from session cookie or mock fallback
    const cookieStore = await cookies();
    const rawSession = cookieStore.get(MOCK_SESSION_COOKIE)?.value;
    const session = decodeSessionCookie(rawSession);
    const userId = session?.uid || "u-user-1";
    const userName = "مشتری نمونه";
    const userPhone = "09120000004";

    // Recalculate authoritative prices and verify stock with inventory module
    const inventoryUseCases = (await import("@/modules/inventory/presentation/controllers/inventory.controller")).InventoryController.getUseCases();
    const { items: allInvItems } = await inventoryUseCases.listItems("tenant-001", { limit: 1000 });

    for (const item of items) {
      const invMatch = allInvItems.find((inv) => inv.productId === item.productId);
      if (invMatch && invMatch.available < item.quantity) {
        return NextResponse.json(
          {
            error: `موجودی قابل استفاده برای ${invMatch.productName} کافی نیست. موجودی در دسترس: ${invMatch.available} ${invMatch.unit}، مقدار درخواستی: ${item.quantity} ${invMatch.unit}.`,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 400 }
        );
      }
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const dbProduct = testProducts.find((p) => p.id === item.productId);
      const unitPrice = dbProduct?.price ?? item.price ?? 0;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: item.productId,
        name: item.name,
        image: item.image || dbProduct?.images[0]?.url || "/test_images/stones/test_1.jpg",
        stoneType: dbProduct?.stoneType || "سنگ طبیعی",
        stoneColor: dbProduct?.color,
        finish: dbProduct?.finish,
        form: dbProduct?.form,
        quantity: item.quantity,
        unit: item.unit || "متر مربع",
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    // Shipping fee lookup
    const shippingMethod = STONE_SHIPPING_METHODS.find(
      (m) => m.id === shippingMethodId
    );
    const shippingFee = shippingMethod ? shippingMethod.price : 0;

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = VALID_COUPONS[cleanCode];
      if (coupon) {
        if (!coupon.minOrderSubtotal || subtotal >= coupon.minOrderSubtotal) {
          if (coupon.discountType === "percent") {
            discount = Math.round((subtotal * coupon.amount) / 100);
          } else {
            discount = Math.min(coupon.amount, subtotal);
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    // Generate identifiers
    const orderId = `ord-c-${Date.now()}`;
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const paymentToken = `pay_tok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Create Order Snapshot
    const newOrder: CustomerOrder = {
      id: orderId,
      orderNumber,
      productName: orderItems[0]?.name || "سفارش سنگ ساختمانی",
      productImage: orderItems[0]?.image || "/test_images/stones/test_1.jpg",
      tenantName: "کارخانه سنگ و سرامیک صنعت",
      tenantId: "tenant-001",
      status: "pending_payment",
      total,
      date: new Date().toISOString(),
      ownerId: userId,
      shippingMethod: shippingMethod?.name || "باربری اختصاصی سنگ",
      timelineStep: 1,
      estimatedDeliveryDate: shippingMethod?.estimatedDays || "۳ تا ۵ روز کاری",
      items: orderItems,
      delivery: {
        method: shippingMethod?.name || "باربری اختصاصی سنگ",
        carrier: shippingMethod?.carrier || "باربری سراسری سنگ",
        shippingCost: shippingFee,
        address: `تهران، پروژه خریدار (شناسه آدرس: ${addressId})`,
        receiverName: userName,
        receiverPhone: userPhone,
        estimatedDeliveryDate: shippingMethod?.estimatedDays || "۳ تا ۵ روز کاری",
        craneAccess: unloadingRequirements?.craneNeeded ?? true,
        forkliftAccess: unloadingRequirements?.forkliftNeeded ?? true,
        deliveryNotes: notes ? `روش پرداخت: ${paymentMethod} — ${notes}` : `روش پرداخت: ${paymentMethod}`,
      },
      summary: {
        subtotal,
        shippingCost: shippingFee,
        discount,
        tax: 0,
        total,
      },
    };

    // Store in runtime and mock lists
    runtimeOrders.set(orderId, newOrder);
    runtimeOrders.set(orderNumber, newOrder);
    mockOrders.unshift(newOrder);

    // Atomically reserve inventory for this order
    for (const item of items) {
      const invMatch = allInvItems.find((inv) => inv.productId === item.productId);
      if (invMatch) {
        try {
          await inventoryUseCases.reserveStock("tenant-001", {
            inventoryItemId: invMatch.id,
            quantity: item.quantity,
            orderId,
            orderNumber,
            customerName: userName,
            notes: `رزرو خرید آنلاین از سبد تسویه حساب مشتری ${userPhone}`,
          });
        } catch (resErr) {
          console.warn("Could not reserve item stock:", resErr);
        }
      }
    }

    // Save payment session for verification
    runtimePaymentSessions.set(paymentToken, {
      orderId,
      orderNumber,
      token: paymentToken,
      amount: total,
      gateway: paymentGateway || paymentMethod,
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins expiry
    });

    const paymentUrl = `/checkout/payment?orderId=${orderId}&token=${paymentToken}&gateway=${paymentGateway || "saman"}&amount=${total}`;

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      paymentUrl,
      paymentToken,
      total,
    });
  } catch (error) {
    console.error("Error in /api/checkout/order:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد سفارش و اتصال به درگاه پرداخت" },
      { status: 500 }
    );
  }
}
