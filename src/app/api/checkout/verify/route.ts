import { NextResponse } from "next/server";
import { paymentVerifySchema } from "@/features/checkout/schemas/checkout-schema";
import { mockOrders } from "@/features/account/data/mock-data";
import {
  runtimeOrders,
  runtimePaymentSessions,
} from "../runtime-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = paymentVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "اطلاعات اعتبارسنجی پرداخت ناقص است", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderId, paymentToken, gateway, status, cardPan } = parsed.data;

    // Find the order
    const order =
      runtimeOrders.get(orderId) ||
      mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId);

    if (!order) {
      return NextResponse.json(
        { error: "سفارش مورد نظر در سیستم یافت نشد" },
        { status: 404 }
      );
    }

    // Idempotency: If order was already paid, return success immediately
    if (order.status === "paid" || order.status === "processing") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: `/checkout/success?orderId=${order.id}`,
        trackingNumber: order.freightBillNumber || "TRX-ALREADY-VERIFIED",
      });
    }

    const trackingNumber = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

    if (status === "success") {
      // Transition order status to paid / processing
      order.status = "processing";
      order.timelineStep = 2;
      order.freightBillNumber = trackingNumber;
      if (gateway || cardPan) {
        order.packaging = `پرداخت از درگاه ${gateway}${cardPan ? ` (کارت: ${cardPan})` : ""}`;
      }

      // Update in memory collections
      runtimeOrders.set(order.id, order);
      if (order.orderNumber) {
        runtimeOrders.set(order.orderNumber, order);
      }

      // Sync mockOrders entry
      const mockIdx = mockOrders.findIndex((o) => o.id === order.id);
      if (mockIdx !== -1) {
        mockOrders[mockIdx] = { ...order };
      }

      // Clean up session token
      runtimePaymentSessions.delete(paymentToken);

      // Consume inventory reservation into finalized stock issue
      try {
        const inventoryUseCases = (await import("@/modules/inventory/presentation/controllers/inventory.controller")).InventoryController.getUseCases();
        await inventoryUseCases.consumeReservation(order.id, "tenant-001", `درگاه بانکی ${gateway || "آنلاین"}`);
      } catch (invErr) {
        console.warn("Error consuming inventory reservation on verify:", invErr);
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: `/checkout/success?orderId=${order.id}`,
        trackingNumber,
      });
    } else {
      // Payment Failed
      order.status = "failed";

      const mockIdx = mockOrders.findIndex((o) => o.id === order.id);
      if (mockIdx !== -1) {
        mockOrders[mockIdx].status = "failed";
      }

      // Release inventory reservations for failed order
      try {
        const inventoryUseCases = (await import("@/modules/inventory/presentation/controllers/inventory.controller")).InventoryController.getUseCases();
        const reservations = await inventoryUseCases.listReservations("tenant-001");
        for (const res of reservations) {
          if (res.orderId === order.id && res.status === "ACTIVE") {
            await inventoryUseCases.releaseReservation(res.id, "tenant-001", "لغو تراکنش پرداخت");
          }
        }
      } catch (relErr) {
        console.warn("Error releasing inventory reservation on verify failure:", relErr);
      }

      return NextResponse.json({
        success: false,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: `/checkout/result?status=failed&orderId=${order.id}&reason=${encodeURIComponent(
          "تراکنش توسط کاربر لغو گردید یا موجودی حساب کافی نبود."
        )}`,
      });
    }
  } catch (error) {
    console.error("Error in /api/checkout/verify:", error);
    return NextResponse.json(
      { error: "خطا در تأیید تراکنش درگاه بانکی" },
      { status: 500 }
    );
  }
}
