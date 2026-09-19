"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Play, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { GalleryItem } from "../types";
import { formatShortDate } from "../format/date";

/** Aspect ratio hint used to reserve space before the image loads. */
function aspectRatioCss(item: GalleryItem): string {
  if (item.width && item.height) return `${item.width} / ${item.height}`;
  return item.type === "video" ? "16 / 9" : "4 / 5";
}

/**
 * A single masonry tile (image or video). Clicking opens the detail modal;
 * videos show a poster + play badge and never autoplay/load the stream in
 * the grid.
 *
 * Uses a real `<button>` so keyboard users can activate items; broken
 * media falls back to a neutral placeholder instead of failing the grid.
 */
export function GalleryItem({
  item,
  onSelect,
}: {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const handleError = useCallback(() => setImgError(true), []);

  const poster = item.thumbnail ?? item.src;
  const showPlaceholder = imgError || !poster;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`باز کردن ${item.title}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg border border-border bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-200 hover:border-primary/40"
      )}
    >
      <div
        className="w-full"
        style={{ aspectRatio: aspectRatioCss(item) }}
      >
        {showPlaceholder ? (
          /* Broken/missing image fallback */
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-accent/40 text-muted-foreground">
            <ImageIcon className="size-8" aria-hidden="true" />
            <span className="px-3 text-center text-xs">{item.title}</span>
          </div>
        ) : (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 24vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={handleError}
          />
        )}
      </div>

      {/* Bottom gradient + title reveal */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-2.5 pt-8">
        <p className="truncate text-start text-xs font-semibold leading-snug text-white">
          {item.title}
        </p>
      </div>

      {/* Video play indicator */}
      {item.type === "video" && (
        <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
          <Play className="size-5 fill-current" aria-hidden="true" />
        </span>
      )}

      {/* Upload time pill */}
      {formatShortDate(item.uploadedAt) && (
        <span className="pointer-events-none absolute start-2 top-2 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {formatShortDate(item.uploadedAt)}
        </span>
      )}
    </button>
  );
}