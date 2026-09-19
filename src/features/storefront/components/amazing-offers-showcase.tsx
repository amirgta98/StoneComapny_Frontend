"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Keyboard } from "swiper/modules";

import { ProductCard } from "@/features/products";
import type { Product } from "@/types";

import "swiper/css";

type AmazingOffersShowcaseProps = {
  products: Product[];
  /** Panel heading below the promotional icon. */
  title?: string;
  /** Promotional icon shown above the title. */
  image?: string;
  /**
   * ISO date-time the offer ends at.
   * The countdown timer renders only when this is provided.
   */
  endsAt?: string;
  /** "View all" link target. */
  viewAllHref?: string;
  className?: string;
};

/** Remaining milliseconds until `endsAt`; null before mount / when absent. */
function useCountdown(endsAt?: string) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!endsAt) return;

    const target = new Date(endsAt).getTime();
    const tick = () => setRemainingMs(Math.max(0, target - Date.now()));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return remainingMs;
}

/** Two-digit Persian numeral (e.g. ۰۷). */
function formatFaTwoDigits(value: number) {
  return value.toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

/**
 * "Amazing Offers" (شگفت‌انگیز) promotional box.
 *
 * Layout (RTL): a panel on the start side — tinted with the tenant's
 * `primary` theme color — holding the percent icon, the title, an
 * optional countdown timer and a "view all" button. The rest is a
 * Swiper carousel of offer cards that users can **swipe themselves**
 * (touch on mobile, drag with the mouse on desktop). A circular
 * swipe-left control on the end edge also advances the carousel.
 */
export function AmazingOffersShowcase({
  products,
  title = "شگفت‌انگیز",
  image = "/test_images/amazing-offers-percent.svg",
  endsAt,
  viewAllHref = "/stones",
  className,
}: AmazingOffersShowcaseProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const remainingMs = useCountdown(endsAt);

  const totalSeconds =
    remainingMs !== null ? Math.floor(remainingMs / 1000) : null;
  const hours = totalSeconds !== null ? Math.floor(totalSeconds / 3600) : null;
  const minutes =
    totalSeconds !== null ? Math.floor((totalSeconds % 3600) / 60) : null;
  const seconds = totalSeconds !== null ? totalSeconds % 60 : null;

  /** Advance to the next slide (reveals the following cards). */
  const swipeLeft = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-primary p-4 sm:p-6 ${
        className ?? ""
      }`}
    >
      <div className="flex gap-4 sm:gap-6">
        {/* Side panel — start (right) side in RTL, vertically centered */}
        <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-4 sm:w-36">
          <div className="flex flex-col items-center gap-2 text-center">
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              className="size-12 object-contain sm:size-16"
              unoptimized={image.endsWith(".svg")}
            />
            <h2 className="text-base font-bold text-primary-foreground sm:text-xl">
              {title}
            </h2>
          </div>

          {/* Countdown timer — rendered only when `endsAt` is provided */}
          {hours !== null && minutes !== null && seconds !== null && (
            <div
              role="timer"
              aria-label="زمان باقی‌مانده تا پایان پیشنهاد"
              className="flex items-center gap-1"
            >
              {[hours, minutes, seconds].map((unit, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="text-sm font-bold text-primary-foreground"
                    >
                      :
                    </span>
                  )}
                  <span className="flex min-w-8 items-center justify-center rounded-md bg-background px-1 py-1 text-sm font-bold tabular-nums text-primary shadow-sm">
                    {formatFaTwoDigits(unit)}
                  </span>
                </Fragment>
              ))}
            </div>
          )}

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 rounded-md bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-background/90 sm:text-sm"
          >
            مشاهده همه
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Products — Swiper carousel: swipeable with touch AND mouse,
            so users can swipe the cards themselves, not just via button. */}
        <div className="relative min-w-0 flex-1">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[A11y, Keyboard]}
            grabCursor
            keyboard={{ enabled: true }}
            slidesPerView={1.4}
            spaceBetween={10}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 12 },
              640: { slidesPerView: 2.5, spaceBetween: 12 },
              900: { slidesPerView: 3, spaceBetween: 14 },
              1100: { slidesPerView: 4, spaceBetween: 16 },
            }}
            className="!py-1"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <ProductCard product={product} variant="offer" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swipe-left control — small, at the left edge; users can still
              swipe anywhere on the cards, this button just also advances. */}
          <button
            type="button"
            onClick={swipeLeft}
            aria-label="مشاهده محصولات بعدی"
            className="absolute left-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
