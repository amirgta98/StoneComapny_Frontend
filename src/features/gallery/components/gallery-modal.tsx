"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, ImageOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";

import type { GalleryItem } from "../types";
import { formatLongDate } from "../format/date";

type GalleryModalProps = {
  /** Selected item, or `null` to close the modal. */
  item: GalleryItem | null;
  onClose: () => void;
};

/**
 * Gallery detail modal — media on the RIGHT, information on the LEFT,
 * preserving this arrangement inside the RTL layout (media is first in the
 * DOM, which places it on the right/start side).
 *
 * Reuses the project's `Dialog` (Radix): escape/outside-click close, focus
 * management, scroll lock and the existing open/close animations. The video
 * element is mounted lazily only when the modal is open, so no video stream
 * loads from the grid.
 */
export function GalleryModal({ item, onClose }: GalleryModalProps) {
          // Track video error so an invalid source degrades to a poster/message.
  // Reset only when the viewed item actually changes (guarded), avoiding
  // a synchronous setState call on render cycles where the item is the same.
  const [videoError, setVideoError] = useState(false);
  const prevItemRef = useRef<GalleryItem | null>(null);
  useEffect(() => {
    const prev = prevItemRef.current;
    if (prev?.id !== item?.id || prev?.src !== item?.src) {
      prevItemRef.current = item;
      setVideoError(false);
    }
    // We intentionally watch item identity change, not the whole `item` shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, item?.src]);

  const isOpen = Boolean(item);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90dvh] w-[95vw] max-w-4xl gap-0 overflow-hidden p-0 sm:rounded-2xl"
        aria-label={item?.title ? `گالری - ${item.title}` : "گالری سنگ سپنتا"}
      >
        {/* Responsive two-pane: media right on desktop, first on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ===== Media — first in DOM = right/start side ===== */}
          <div className="order-1 flex items-center justify-center overflow-hidden bg-black">
            {item?.type === "video" ? (
              <video
                key={item.src}
                controls
                poster={item.thumbnail}
                preload="metadata"
                className="aspect-video h-auto w-full bg-black"
                onError={() => setVideoError(true)}
              >
                <source src={item.src} />
              </video>
            ) : item ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 95vw, 50vw"
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>

          {/* ===== Information — left side ===== */}
          <div className="order-2 flex flex-col gap-4 overflow-y-auto p-6">
            <DialogTitle className="text-xl font-bold leading-snug md:text-2xl">
              {item?.title}
            </DialogTitle>

            {item && formatLongDate(item.uploadedAt) && (
              <p className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                {formatLongDate(item.uploadedAt)}
              </p>
            )}

            <DialogDescription className="text-sm leading-relaxed sm:text-base">
              {videoError && item?.type === "video"
                ? "در پخش این ویدیو خطایی رخ داد. لطفاً دوباره تلاش کنید."
                : item?.description || "توضیحی برای این مورد ثبت نشده است."}
            </DialogDescription>

            {videoError && item?.type === "video" && (
              <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
                <ImageOff className="size-4" aria-hidden="true" />
                منبع ویدیو در دسترس نیست.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}