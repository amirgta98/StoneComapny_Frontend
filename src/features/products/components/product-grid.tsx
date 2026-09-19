import { ProductCard } from "./product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: Product[];
  columns?: 2 | 3 | 4;
  /**
   * Column count on the smallest screens (below the `sm` breakpoint).
   * Defaults to 1; pass 2 when the card variant stays usable at ~160px.
   */
  mobileColumns?: 1 | 2;
  className?: string;
};

export function ProductGrid({
  products,
  columns = 3,
  mobileColumns = 1,
  className,
}: ProductGridProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-10",
        mobileColumns === 2 ? "grid-cols-2" : "grid-cols-1",
        gridCols,
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}