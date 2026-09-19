import type {
  CheckoutCalculation,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from "../types";

class CheckoutService {
  /**
   * Server-side calculation of order totals including verified stone prices,
   * actual shipping cost, valid coupon discounts, and taxes.
   */
  async calculateTotals(
    payload: {
      items: CheckoutOrderRequest["items"];
      shippingMethodId: string;
      couponCode?: string;
      addressId?: string;
    }
  ): Promise<CheckoutCalculation> {
    const res = await fetch("/api/checkout/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "خطا در محاسبه مبالغ سفارش");
    }

    return res.json();
  }

  /**
   * Submit the order intent and prepare for payment.
   */
  async createOrder(payload: CheckoutOrderRequest): Promise<CheckoutOrderResponse> {
    const res = await fetch("/api/checkout/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "خطا در ثبت سفارش");
    }

    return res.json();
  }

  /**
   * Verify the gateway payment callback.
   */
  async verifyPayment(payload: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    const res = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "خطا در اعتبارسنجی تراکنش پرداخت");
    }

    return res.json();
  }
}

export const checkoutService = new CheckoutService();
