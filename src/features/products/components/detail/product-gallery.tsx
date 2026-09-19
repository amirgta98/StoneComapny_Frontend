"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageOff,
  TriangleAlert,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

type ProductGalleryProps = {
  images: ProductImage[];
  /** Product name — used for accessible labels and alt fallbacks. */
  name: string;
  /** Extra class(es) for the main stage container (e.g. radius override). */
  stageClassName?: string;
  className?: string;
};

/**
 * Product gallery (Client Component): main image + thumbnails + hover
 * zoom + accessible lightbox. Thumbnails form a vertical rail on the
 * start side (desktop) and a strip below the image on mobile. The
 * lightbox arrows are RTL-aware (previous points toward the start side,
 * like the shared `SliderArrows`). Covers loading/error/empty states.
 *
 * Note: the data model currently carries images only; when product
 * videos are added to `Product`, extend the stage here (no new gallery).
 */
export function ProductGallery({
  images,
  name,
  stageClassName,
  className,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [zoomOpen, setZoomOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const count = images.length;
  const current = images[Math.min(active, Math.max(count - 1, 0))];

  const goPrev = () => setActive((i) => (i - 1 + count) % count);
  const goNext = () => setActive((i) => (i + 1) % count);

  /* Empty state — no gallery data at all. */
  if (count === 0) {
    return (
      <div
        className={
          "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground " +
          (className ?? "")
        }
      >
        <ImageOff className="size-8" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm">تصویری برای این محصول ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div
      className={
        "flex flex-col-reverse gap-3 md:grid md:grid-cols-[80px_minmax(0,1fr)] " +
        (className ?? "")
      }
    >
      {/* Thumbnails — start-side rail on desktop, strip on mobile */}
      <ul
        aria-label="تصاویر محصول"
        className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
      >
        {images.map((image, index) => (
          <li key={image.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`نمایش تصویر ${(index + 1).toLocaleString("fa-IR")}`}
              aria-current={active === index}
              className={cn(
                "relative block aspect-square size-16 overflow-hidden rounded-md border-2 bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-full",
                active === index
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized={image.url.endsWith(".svg")}
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Main stage */}
      <div
        className={cn(
          "group relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted",
          stageClassName
        )}
      >
        {current && !failed[active] ? (
          <Image
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            onLoad={() => setLoaded((prev) => ({ ...prev, [active]: true }))}
            onError={() => setFailed((prev) => ({ ...prev, [active]: true }))}
            style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
            className={cn(
              "object-cover transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
              loaded[active] ? "opacity-100" : "opacity-0",
              "group-hover:scale-[1.5]"
            )}
            unoptimized={current.url.endsWith(".svg")}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setOrigin({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
          />
        ) : current ? (
          /* Error state — image failed to load */
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <TriangleAlert className="size-8" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm">خطا در بارگذاری تصویر</p>
          </div>
        ) : null}

        {/* Loading skeleton — preserves the final layout */}
        {!loaded[active] && !failed[active] && (
          <Skeleton className="absolute inset-0 rounded-none" aria-hidden="true" />
        )}

        {/* Fullscreen trigger */}
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="نمایش تصویر در اندازه بزرگ"
          className="absolute end-3 bottom-3 flex size-9 items-center justify-center rounded-md border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Expand className="size-4" aria-hidden="true" />
        </button>

        {/* Counter */}
        <span className="absolute start-3 bottom-3 rounded-md bg-background/80 px-2 py-0.5 text-xs tabular-nums text-muted-foreground backdrop-blur">
          {(active + 1).toLocaleString("fa-IR")} / {count.toLocaleString("fa-IR")}
        </span>
      </div>

      {/* Lightbox — accessible full-size view */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-background/80 [&>button]:text-foreground [&>button]:hover:bg-background">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <DialogDescription className="sr-only">
            نمای کامل تصویر محصول
          </DialogDescription>

          <div
            className="relative"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") goNext(); // RTL: left = next
              if (event.key === "ArrowRight") goPrev(); // RTL: right = prev
            }}
          >
            {current && (
              <Image
                src={current.url}
                alt={current.alt || name}
                width={1600}
                height={1600}
                priority
                className="mx-auto max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
                unoptimized={current.url.endsWith(".svg")}
              />
            )}

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="تصویر قبلی"
                  className="absolute end-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="تصویر بعدی"
                  className="absolute start-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
