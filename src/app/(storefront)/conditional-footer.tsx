"use client";

import { usePathname } from "next/navigation";

import { StorefrontFooter } from "@/features/storefront";

/**
 * Layout-level footer, skipped on the homepage.
 *
 * The homepage wraps all of its sections in the `Hero` scroll-animation
 * component, which renders its children inside an absolutely-positioned
 * overlay layer (`.hero-next-section`). That layer covers the normal-flow
 * layout footer with opaque `bg-background` sections, so on the homepage
 * `StorefrontFooter` is rendered as the last element *inside* the sliding
 * content layer instead. Every other storefront page gets the footer
 * from here.
 */
export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return <StorefrontFooter />;
}
