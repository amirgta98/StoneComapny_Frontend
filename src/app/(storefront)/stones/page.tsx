import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { StonesListing, testProducts } from "@/features/products";

export const metadata: Metadata = {
  title: "سنگ‌ها | صنایع سنگ سپنتا",
  description:
    "فهرست کامل سنگ‌های طبیعی؛ مرمر، تراورتن، گرانیت، آنیکس و… با جستجو و فیلتر بر اساس نوع سنگ، رنگ، نوع محصول، کاربرد و پرداخت سطح.",
};

/**
 * /stones — stone products listing.
 *
 * Thin route-level composer (feature-first): the server component renders
 * the breadcrumb and page heading, then hands the (tenant) product list to
 * the `StonesListing` client island, which owns search, quick filters,
 * active filters, sorting, the filter sidebar/drawer and the product grid
 * (reusing the existing `ProductCard`).
 */
export default function StonesPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                خانه
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              سنگ‌ها
            </li>
          </ol>
        </nav>

        {/* Page title + short description */}
        <header className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            سنگ‌های طبیعی
          </h1>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            مجموعه‌ای منتخب از سنگ‌های طبیعی ممتاز؛ بر اساس نوع سنگ، رنگ،
            نوع محصول، کاربرد و پرداخت سطح جستجو و فیلتر کنید.
          </p>
        </header>

        {/* Search, quick filters, active filters, count/sort, sidebar + grid */}
        <div className="mt-8">
          <StonesListing products={testProducts} />
        </div>
      </div>
    </div>
  );
}