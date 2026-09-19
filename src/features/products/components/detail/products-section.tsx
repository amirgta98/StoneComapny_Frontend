import { EmptyState } from "@/components/data-listing";

import { ProductGrid } from "../product-grid";
import type { Product } from "@/types";

type ProductsSectionProps = {
  products: Product[];
  /** Accessible label for the empty state. */
  emptyTitle: string;
  className?: string;
};

/**
 * Shared grid section for Related / Similar products.
 *
 * Reuses the existing `ProductGrid` → `ProductCard` family (default
 * vertical variant) so detail-page product lists look exactly like the
 * rest of the storefront. Renders the shared EmptyState when the data
 * yields no products instead of leaving blank space.
 */
export function ProductsSection({
  products,
  emptyTitle,
  className,
}: ProductsSectionProps) {
  if (products.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description="سایر محصولات فروشنده را در فهرست سنگ‌ها ببینید."
        />
      </div>
    );
  }

  return (
    <ProductGrid
      products={products}
      columns={4}
      mobileColumns={2}
      className={className}
    />
  );
}