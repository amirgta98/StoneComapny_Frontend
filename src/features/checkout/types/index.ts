import type { CartItem } from "@/stores/cart-store";

export type CheckoutStep = "address" | "shipping" | "review" | "payment";

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
  carrier: string;
  supportsCrane?: boolean;
  supportsForklift?: boolean;
  badge?: string;
}

export type PaymentMethodType = "online" | "bank_transfer" | "on_delivery";

export type PaymentGatewayId = "saman" | "mellat" | "zarinpal";

export interface PaymentGateway {
  id: PaymentGatewayId;
  name: string;
  description: string;
  logoUrl?: string;
  isDefault?: boolean;
}

export interface PaymentMethodOption {
  id: PaymentMethodType;
  title: string;
  description: string;
  badge?: string;
  icon: string;
  enabled: boolean;
}

export interface CouponInfo {
  code: string;
  discountType: "percent" | "fixed";
  amount: number;
  description: string;
  minOrderSubtotal?: number;
}

export interface CheckoutCalculation {
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  appliedCoupon?: string;
  itemsCount: number;
}

export interface CheckoutOrderRequest {
  items: CartItem[];
  addressId: string;
  shippingMethodId: string;
  paymentMethod: PaymentMethodType;
  paymentGateway?: PaymentGatewayId;
  couponCode?: string;
  notes?: string;
  unloadingRequirements?: {
    craneNeeded?: boolean;
    forkliftNeeded?: boolean;
  };
}

export interface CheckoutOrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentUrl: string;
  paymentToken: string;
  total: number;
  error?: string;
}

export interface PaymentVerifyRequest {
  orderId: string;
  paymentToken: string;
  gateway: string;
  trackingNumber?: string;
  cardPan?: string;
  status: "success" | "failed";
}

export interface PaymentVerifyResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  redirectUrl: string;
  trackingNumber?: string;
  error?: string;
}
