import { ProductDetailSkeleton } from "@/features/products";

/** Route-level loading state — preserves the detail page layout. */
export default function LoadingProductDetail() {
  return (
    <div className="container mx-auto px-4 pb-28 pt-8 sm:px-6 md:pt-10 lg:px-8 lg:pb-16">
      <ProductDetailSkeleton />
    </div>
  );
}