import { StorefrontHeader } from "@/features/storefront";
import { CartDrawer } from "@/features/cart";

import { ConditionalFooter } from "./conditional-footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader
        slogan="سنگ طبیعی، زیبایی ماندگار"
        companyName="سنگ"
      />
      {/* Global cart sidebar — opens from the navbar trigger */}
      <CartDrawer />
      <main className="flex-1">{children}</main>
      {/* Route-aware footer: skipped on "/" where the Hero sliding layer
          renders its own footer (see conditional-footer.tsx). */}
      <ConditionalFooter />
    </div>
  );
}