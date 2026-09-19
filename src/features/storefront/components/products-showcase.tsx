"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

import {
  ProductCard,
  ProductSearchBar,
  useProductSearch,
  useProductSearchStore,
  type Product,
} from "@/features/products";

import { Button } from "@/components/ui";
import { Section } from "./section";

/** Default maximum products displayed before the "view all" button. */
const DEFAULT_MAX_VISIBLE = 12;

type ProductsShowcaseProps = {
  products: Product[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Supporting text below the title (optional). */
  description?: string;
  /** Max products shown; a "view all" button appears when there are more. */
  maxVisible?: number;
  /**
   * When provided, a "view all" CTA is always shown linking to this
   * destination (e.g. the full product-listing page).
   */
  viewAllHref?: string;
  /**
   * Whether to render the visible search bar and wire the list to the
   * shared product-search state (query + advanced filters).
   *
   * Set to `false` for secondary/static lists (e.g. another showcase on
   * the same page): the search bar is hidden and the list renders the
   * given `products` untouched (capped by `maxVisible`), unaffected by
   * searches performed elsewhere.
   */
  showSearch?: boolean;
};

/**
 * Drop-in "product list" section for storefront pages.
 *
 * Composes the reusable `Section` divider with:
 * - a visible search bar that opens the advanced stone-search modal,
 * - a responsive grid of horizontal `ProductCard`s driven by the
 *   shared search/filter state (query + filters update the list live),
 *   unless `showSearch={false}` hides the search bar and renders the
 *   given products statically (intended for secondary lists that share
 *   the page with a searchable `ProductsShowcase`).
 *
 * ```tsx
 * <ProductsShowcase
 *   products={products}
 *   eyebrow="محصولات منتخب"
 *   title="پرفروش ترین سنگ ها"
 * />
 * ```
 */
export function ProductsShowcase({
  products,
  eyebrow = "محصولات منتخب",
  title = "سنگ های ویژه سپنتا",
  description,
  maxVisible = DEFAULT_MAX_VISIBLE,
  viewAllHref,
  showSearch = true,
}: ProductsShowcaseProps) {
  // Search wiring is only meaningful when `showSearch` is true. Hooks are
  // always called (stable hook order); their values are simply ignored for
  // static (`showSearch: false`) instances.
  const { results, clearFilters } = useProductSearch(products);
  const searchQuery = useProductSearchStore((s) => s.query.trim());
  const isSearchActive = showSearch && searchQuery !== "";

  // Searchable lists follow the shared query/filters; static lists ignore
  // them completely and render the given `products` as-is.
  const sourceList = showSearch ? results : products;

  // While searching/filtering, show every match; otherwise cap the list.
  const visibleProducts = isSearchActive
    ? sourceList
    : sourceList.slice(0, maxVisible);
  // Offer the CTA when there is more to show; when a `viewAllHref` is
  // provided, always render it (as long as there are products).
  const hasMore = viewAllHref ? true : sourceList.length > maxVisible;
  const showViewAllButton = !isSearchActive && sourceList.length > 0 && hasMore;
  const hasNoResults = showSearch && sourceList.length === 0;

  return (
    <Section
      eyebrow={eyebrow}
      title={title}
      description={description}
      aria-label="لیست محصولات"
    >
      {/* Visible search bar — opens the advanced modal on click/focus */}
      {showSearch && (
        <div className="mb-6">
          <ProductSearchBar products={products} />
        </div>
      )}

      {hasNoResults ? (
        /* Empty / no-result state */
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <SearchX className="size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium">محصولی مطابق جستجوی شما یافت نشد</p>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            می توانید عبارت دیگری را جستجو کنید یا فیلترهای اعمال شده را حذف کنید.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            پاک کردن فیلترها
          </Button>
        </div>
      ) : (
        /* Filtered product list */
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="horizontal"
                showRating
                showPrice
              />
            ))}
          </div>

          {showViewAllButton && (
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="min-w-56">
                <Link href={viewAllHref ?? "/stones"}>مشاهده همه محصولات</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </Section>
  );
}