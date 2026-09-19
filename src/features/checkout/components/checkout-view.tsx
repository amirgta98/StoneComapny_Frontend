"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/stores";
import { useAuth } from "@/auth";
import { useAddressStore } from "@/features/account/stores/address-store";

import { CheckoutStepper } from "./checkout-stepper";
import { AddressStep } from "./steps/address-step";
import { ShippingStep } from "./steps/shipping-step";
import { ReviewStep } from "./steps/review-step";
import { PaymentStep } from "./steps/payment-step";
import { CheckoutSummary } from "./summary/checkout-summary";
import { EmptyCartView } from "./empty-cart-view";

import {
  STONE_SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
} from "../constants/shipping-methods";
import { VALID_COUPONS } from "../constants/payment-methods";
import type {
  CheckoutStep,
  PaymentMethodType,
  PaymentGatewayId,
  CheckoutCalculation,
} from "../types";
import { checkoutService } from "../services/checkout-service";
import { formatPrice } from "@/features/products/lib/product-price";

export function CheckoutView() {
  const router = useRouter();
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);

  // Address Store
  const userId = user?.id || "u-user-1";
  const allAddresses = useAddressStore((s) => s.addresses);
  const addresses = useMemo(() => {
    return allAddresses.filter((a) => a.userId === userId);
  }, [allAddresses, userId]);

  // Local Checkout Flow State
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");

  // Selected Address State (Derived default if not explicitly selected)
  const [explicitAddressId, setExplicitAddressId] = useState<string | undefined>(undefined);
  const defaultAddressId = useMemo(() => {
    const defaultAddr = addresses.find((a) => a.isDefaultShipping) || addresses[0];
    return defaultAddr?.id;
  }, [addresses]);
  const selectedAddressId = explicitAddressId ?? defaultAddressId;

  // Selected Shipping Method
  const [selectedShippingMethodId, setSelectedShippingMethodId] =
    useState<string>(DEFAULT_SHIPPING_METHOD_ID);

  // Selected Payment Method & Gateway
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType>("online");
  const [selectedGateway, setSelectedGateway] =
    useState<PaymentGatewayId>("saman");

  // Order Notes & Terms
  const [notes, setNotes] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(
    undefined
  );

  // Submission State
  const [isProcessing, setIsProcessing] = useState(false);

  // Selected Objects
  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const selectedShippingMethod = useMemo(
    () =>
      STONE_SHIPPING_METHODS.find((m) => m.id === selectedShippingMethodId) ||
      STONE_SHIPPING_METHODS[0],
    [selectedShippingMethodId]
  );

  // Synchronous client calculation with backend validation
  const calculation = useMemo<CheckoutCalculation>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );

    const shippingFee = selectedShippingMethod ? selectedShippingMethod.price : 0;

    let discount = 0;
    if (appliedCoupon && VALID_COUPONS[appliedCoupon]) {
      const coupon = VALID_COUPONS[appliedCoupon];
      if (coupon.discountType === "percent") {
        discount = Math.round((subtotal * coupon.amount) / 100);
      } else {
        discount = Math.min(coupon.amount, subtotal);
      }
    }

    // Standard VAT for natural stone orders: 9% (or 0 if promotional)
    const taxableSubtotal = Math.max(0, subtotal - discount);
    // In many stone factory direct orders, tax is included in price or 0 for raw quarry
    const tax = 0;

    const total = Math.max(0, taxableSubtotal + shippingFee + tax);

    return {
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      appliedCoupon,
      itemsCount: items.length,
    };
  }, [items, selectedShippingMethod, appliedCoupon]);

  // Handle Applying Coupon
  const handleApplyCoupon = async (code: string) => {
    const upper = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[upper];

    if (!coupon) {
      throw new Error("کد تخفیف وارد شده معتبر نیست یا منقضی شده است.");
    }

    if (coupon.minOrderSubtotal && calculation.subtotal < coupon.minOrderSubtotal) {
      throw new Error(
        `این کد تخفیف برای سفارش‌های بالای ${formatPrice(coupon.minOrderSubtotal)} تومان معتبر است.`
      );
    }

    setAppliedCoupon(upper);
    toast.success("کد تخفیف با موفقیت اعمال شد", {
      description: coupon.description,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
    toast.info("کد تخفیف حذف شد");
  };

  // Step Validation
  const { canProceed, validationMessage } = useMemo(() => {
    switch (currentStep) {
      case "address":
        if (!selectedAddressId) {
          return {
            canProceed: false,
            validationMessage: "لطفاً آدرس تحویل سفارش را انتخاب فرمایید.",
          };
        }
        return { canProceed: true, validationMessage: undefined };

      case "shipping":
        if (!selectedShippingMethodId) {
          return {
            canProceed: false,
            validationMessage: "لطفاً یکی از روش‌های ارسال باربری را انتخاب نمایید.",
          };
        }
        return { canProceed: true, validationMessage: undefined };

      case "review":
        if (items.length === 0) {
          return {
            canProceed: false,
            validationMessage: "سبد خرید شما خالی است.",
          };
        }
        return { canProceed: true, validationMessage: undefined };

      case "payment":
        if (!agreedTerms) {
          return {
            canProceed: false,
            validationMessage: "پذیرش قوانین و مقررات خرید سنگ برای پرداخت الزامی است.",
          };
        }
        return { canProceed: true, validationMessage: undefined };
    }
  }, [currentStep, selectedAddressId, selectedShippingMethodId, items.length, agreedTerms]);

  // Advance to Next Step or Initiate Payment
  const handleNextStep = async () => {
    if (!canProceed) {
      if (validationMessage) toast.error(validationMessage);
      return;
    }

    if (currentStep === "address") {
      setCurrentStep("shipping");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === "shipping") {
      setCurrentStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === "review") {
      setCurrentStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Final Step: Submit Order & Redirect to Payment Gateway
    if (currentStep === "payment") {
      try {
        setIsProcessing(true);

        const payload = {
          items,
          addressId: selectedAddressId!,
          shippingMethodId: selectedShippingMethodId,
          paymentMethod: selectedPaymentMethod,
          paymentGateway: selectedPaymentMethod === "online" ? selectedGateway : undefined,
          couponCode: appliedCoupon,
          notes: notes.trim() || undefined,
          unloadingRequirements: {
            craneNeeded: selectedAddress?.craneAccess,
            forkliftNeeded: selectedAddress?.deliveryType === "forklift",
          },
        };

        const res = await checkoutService.createOrder(payload);

        if (res.success && res.paymentUrl) {
          // Redirect to payment gateway simulation or callback
          router.push(res.paymentUrl);
        } else {
          throw new Error(res.error || "خطا در برقراری ارتباط با درگاه پرداخت");
        }
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : "خطا در پردازش پرداخت سفارش";
        toast.error(msg);
        setIsProcessing(false);
      }
    }
  };

  // Back to previous step
  const handlePrevStep = () => {
    if (currentStep === "shipping") setCurrentStep("address");
    else if (currentStep === "review") setCurrentStep("shipping");
    else if (currentStep === "payment") setCurrentStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If cart is empty, show empty cart state
  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-4 sm:pt-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Stepper Progress Header */}
        <CheckoutStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            // Only allow clicking back to already visited steps
            const stepOrder: CheckoutStep[] = ["address", "shipping", "review", "payment"];
            const targetIdx = stepOrder.indexOf(step);
            const currentIdx = stepOrder.indexOf(currentStep);
            if (targetIdx < currentIdx) {
              setCurrentStep(step);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />

        {/* 2-Column Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Step Content (Right in RTL - 7 Cols) */}
          <main className="lg:col-span-7 space-y-6">
            {currentStep === "address" && (
              <AddressStep
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={(addr) => setExplicitAddressId(addr.id)}
                userId={userId}
              />
            )}

            {currentStep === "shipping" && (
              <ShippingStep
                selectedShippingMethodId={selectedShippingMethodId}
                onSelectShippingMethod={(m) => setSelectedShippingMethodId(m.id)}
                selectedAddress={selectedAddress}
              />
            )}

            {currentStep === "review" && (
              <ReviewStep
                items={items}
                selectedAddress={selectedAddress}
                selectedShippingMethod={selectedShippingMethod}
                notes={notes}
                onNotesChange={setNotes}
                onNavigateToStep={(s) => {
                  setCurrentStep(s);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentStep === "payment" && (
              <PaymentStep
                selectedPaymentMethod={selectedPaymentMethod}
                onSelectPaymentMethod={setSelectedPaymentMethod}
                selectedGateway={selectedGateway}
                onSelectGateway={setSelectedGateway}
                agreedTerms={agreedTerms}
                onAgreedTermsChange={setAgreedTerms}
                selectedShippingMethod={selectedShippingMethod}
              />
            )}
          </main>

          {/* Sticky Financial Summary Sidebar (Left in RTL - 5 Cols) */}
          <div className="lg:col-span-5">
            <CheckoutSummary
              items={items}
              calculation={calculation}
              currentStep={currentStep}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onNextStep={handleNextStep}
              onPrevStep={currentStep !== "address" ? handlePrevStep : undefined}
              isProcessing={isProcessing}
              canProceed={canProceed}
              proceedValidationMessage={validationMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
