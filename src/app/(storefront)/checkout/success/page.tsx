"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OrderSuccessView } from "@/features/checkout";
import { useCartStore } from "@/stores";

function SuccessPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const clearCart = useCartStore((s) => s.clearCart);

  // Guarantee cart is cleared once order is confirmed
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return <OrderSuccessView orderId={orderId} />;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessPageInner />
    </Suspense>
  );
}
