"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import gsap from "gsap";

import "swiper/css";

import { EmptyState } from "@/components/data-listing";
import { ProductCard, type Product } from "@/features/products";
import { Section } from "./section";
import { SliderArrows } from "./slider-arrows";

/** Imperative API exposed by `FacadeStonesSlider` via ref. */
export type FacadeStonesSliderHandle = {
  slidePrev: () => void;
  slideNext: () => void;
};

type FacadeStonesSliderProps = {
  products: Product[];
};

/**
 * Headless, RTL-aware Swiper of product cards for the "best facade
 * stones" section. Renders only the slides; the parent `Section`
 * provides the header and drives navigation through the imperative
 * handle (same pattern as `CategorySlider`).
 */
export const FacadeStonesSlider = forwardRef<
  FacadeStonesSliderHandle,
  FacadeStonesSliderProps
>(function FacadeStonesSlider({ products }, ref) {
  const swiperRef = useRef<SwiperClass | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideNext: () => swiperRef.current?.slideNext(),
    }),
    []
  );

  if (products.length === 0) {
    return (
      <EmptyState
        title="محصولی یافت نشد"
        description="در حال حاضر سنگی برای نمایش در این بخش وجود ندارد."
      />
    );
  }

  const canLoop = products.length > 5;

  return (
    <Swiper
      modules={[A11y, Keyboard]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      loop={canLoop}
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
          <ProductCard product={product} variant="default" showRating showPrice />
        </SwiperSlide>
      ))}
    </Swiper>
  );
});

type FacadeStonesShowcaseProps = {
  products: Product[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
};

/**
 * Drop-in "Best exterior facade stones" section for storefront pages.
 *
 * Composes the reusable `Section` divider (eyebrow + title + slider
 * arrows in the action slot) with the headless `FacadeStonesSlider`.
 *
 * Animates the header and slide content in once on mount with GSAP
 * (never scroll-gated), skipping users who prefer reduced motion.
 * Only the slide *content* is animated so Swiper's own transforms are
 * never touched.
 *
 * ```tsx
 * <FacadeStonesShowcase products={facadeProducts} />
 * ```
 */
export function FacadeStonesShowcase({
  products,
  eyebrow = "نمای خارجی",
  title = "بهترین سنگ های نمای خارجی",
}: FacadeStonesShowcaseProps) {
  const sliderRef = useRef<FacadeStonesSliderHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from("[data-slot='section-header']", { autoAlpha: 0, y: 16, duration: 0.35 })
        .from(
          ".swiper-slide > *",
          { autoAlpha: 0, y: 20, duration: 0.4, stagger: 0.04 },
          "-=0.15"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <Section
        eyebrow={eyebrow}
        title={title}
        aria-label="بهترین سنگ‌های نمای خارجی"
        action={
          <SliderArrows
            onPrev={() => sliderRef.current?.slidePrev()}
            onNext={() => sliderRef.current?.slideNext()}
            prevLabel="سنگ‌های قبلی"
            nextLabel="سنگ‌های بعدی"
          />
        }
      >
        <FacadeStonesSlider ref={sliderRef} products={products} />
      </Section>
    </div>
  );
}