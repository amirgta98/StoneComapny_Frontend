"use client";

import { useTransition } from "react";
import { HeartOff } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layouts";
import { ProductCard } from "@/features/products";
import { useFavoritesStore } from "@/stores";
import { testProducts } from "@/features/products/data/test-products";
import { Button } from "@/components/ui";

/**
 * Customer favorites page (skill: Customer Dashboard).
 *
 * Reads the live favorites list from the favorites store, resolves each
 * item to its full Product (from the test catalog) by slug, and renders
 * them as horizontal product cards with a remove button overlay.
 */
export function FavoritesList() {
  const favorites = useFavoritesStore((s) => s.items);
  const removeItem = useFavoritesStore((s) => s.removeItem);
  const [pending, startTransition] = useTransition();

  // Resolve each favorite to its full Product by slug (skip stale entries).
  const products = favorites
    .map((fav) => ({
      fav,
      product: testProducts.find((p) => p.slug === fav.slug),
    }))
    .filter((item): item is { fav: typeof item.fav; product: NonNullable<typeof item.product> } => item.product !== undefined);

  const handleRemove = (productId: string, name: string) => {
    startTransition(() => {
      removeItem(productId);
      toast.success(`\u00ab${name}\u00bb از علاقه‌مندی‌ها حذف شد`);
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="علاقه‌مندی‌ها"
        description="محصولاتی که ذخیره کرده‌اید"
      />

      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map(({ fav, product }) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} variant="horizontal" showPrice />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`حذف ${product.name} از علاقه‌مندی‌ها`}
                disabled={pending}
                className="absolute end-2 top-2 z-10 size-8 rounded-full bg-background/80 text-destructive shadow-sm backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemove(fav.productId, product.name)}
              >
                <HeartOff className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">
            هنوز محصولی به علاقه‌مندی‌ها اضافه ن\u200cکرده\u200cاید.
          </p>
        </div>
      )}
    </div>
  );
}