"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";

import { EmptyState } from "@/components/data-listing";

import type { GalleryItem } from "../types";
import { GalleryItem as GalleryTile } from "./gallery-item";
import { GalleryModal } from "./gallery-modal";

/**
 * Responsive masonry breakpoints → column count.
 *
 * Desktop: 4 · large tablet: 3 · tablet: 2 · mobile: 1.
 */
const BREAKPOINT_COLS = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
} as const;

/**
 * Client island holding the masonry grid and the selected-item modal.
 *
 * `react-masonry-css` requires client rendering; the surrounding page stays
 * a Server Component. Only the selected item is tracked here so exactly one
 * modal can be open at a time. Empty state and broken-item handling live
 * here too (a broken tile never breaks the grid).
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <EmptyState
        title="موردی در گالری یافت نشد"
        description="در حال حاضر هیچ تصویر یا ویدیویی برای نمایش در این بخش وجود ندارد."
      />
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={BREAKPOINT_COLS}
        className="flex w-full"
        columnClassName="bg-clip-padding px-2 first:ps-0 last:pe-0"
      >
        {items.map((item) => (
          <div key={item.id} className="mb-4">
            <GalleryTile item={item} onSelect={setSelected} />
          </div>
        ))}
      </Masonry>

      <GalleryModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}