/**
 * Checkout feature.
 *
 * Manages the multi-step checkout flow, address selection, stone shipping
 * logistics, pricing calculation, coupons, and payment gateway processing.
 */

export { CheckoutView } from "./components/checkout-view";
export { CheckoutStepper } from "./components/checkout-stepper";
export { EmptyCartView } from "./components/empty-cart-view";
export { OrderSuccessView } from "./components/success/order-success-view";
export { AddressStep } from "./components/steps/address-step";
export { ShippingStep } from "./components/steps/shipping-step";
export { ReviewStep } from "./components/steps/review-step";
export { PaymentStep } from "./components/steps/payment-step";
export { CheckoutSummary } from "./components/summary/checkout-summary";
export { CouponInput } from "./components/summary/coupon-input";
export { AddAddressDialog } from "./components/steps/add-address-dialog";

export { checkoutService } from "./services/checkout-service";
export {
  STONE_SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
} from "./constants/shipping-methods";
export {
  PAYMENT_METHODS,
  ONLINE_GATEWAYS,
  VALID_COUPONS,
} from "./constants/payment-methods";

export type {
  CheckoutStep,
  ShippingMethod,
  PaymentMethodType,
  PaymentGatewayId,
  PaymentGateway,
  CouponInfo,
  CheckoutCalculation,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from "./types";