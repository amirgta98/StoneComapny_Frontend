import type { Metadata } from "next";
import { DashboardShell, SidebarNav } from "@/components/layouts";
import { StorefrontHeader } from "@/features/storefront";
import { CartDrawer } from "@/features/cart";
import { customerNav } from "@/config";

export const metadata: Metadata = {
  title: "حساب کاربری",
  description: "پنل مدیریت حساب مشتری — سفارش‌ها، استعلام‌ها، علاقه‌مندی‌ها و تنظیمات.",
};

/**
 * Customer account panel layout (skill: Customer Dashboard S2).
 *
 * The main storefront header (logo, nav, cart, auth) is preserved so the
 * account panel feels like part of the same product. Below it, a
 * two-column RTL layout: fixed sidebar on the right + main content on the
 * left. On mobile the sidebar collapses and a BottomNav (built into
 * DashboardShell) takes over.
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader slogan="سنگ طبیعی، زیبایی ماندگار" companyName="سنگ" />
      <CartDrawer />
      <DashboardShell
        sidebar={<SidebarNav sections={customerNav} />}
        navSections={customerNav}
      >
        {children}
      </DashboardShell>
    </div>
  );
}