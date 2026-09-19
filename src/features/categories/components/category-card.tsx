import Image from "next/image";
import Link from "next/link";

import type { Category } from "../types";

type CategoryCardProps = {
  category: Category;
};

/**
 * Category card.
 *
 * Shows the category cover image, name and product count.
 * Image-led presentation with a subtle bottom gradient overlay,
 * consistent with the premium stone-commerce direction.
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const { name, slug, image, productCount } = category;

  return (
    <Link
      href={`/categories/${slug}`}
      aria-label={`${name} — ${productCount} محصول`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative overflow-hidden rounded-lg border border-border bg-card will-change-transform">
        {/* Cover image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 480px) 40vw, (max-width: 640px) 25vw, (max-width: 1024px) 20vw, 14vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            unoptimized={image.endsWith(".svg")}
          />
        </div>

        {/* Bottom overlay: name + product count */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-3 pt-10">
          <h3 className="text-sm font-semibold leading-snug text-white">
            {name}
          </h3>
          <p className="mt-0.5 text-[11px] leading-none text-white/75">
            {productCount.toLocaleString("fa-IR")} محصول
          </p>
        </div>
      </div>
    </Link>
  );
}