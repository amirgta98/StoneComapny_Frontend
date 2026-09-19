"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

import { EmptyState } from "@/components/data-listing";
import { CategoryCard } from "./category-card";
import type { Category } from "../types";

/** Imperative API exposed by `CategorySlider` via ref. */
export type CategorySliderHandle = {
  slidePrev: () => void;
  slideNext: () => void;
};

type CategorySliderProps = {
  categories: Category[];
};

/**
 * Responsive, RTL-aware categories slider built on Swiper.
 *
 * Headless presentation component: it renders only the slides.
 * Section headers and navigation controls are composed by the parent
 * (see `Section` + `SliderArrows` in the storefront feature), which can
 * drive navigation through the imperative handle:
 *
 * ```tsx
 * const sliderRef = useRef<CategorySliderHandle>(null);
 * <CategorySlider ref={sliderRef} categories={categories} />
 * sliderRef.current?.slideNext();
 * ```
 *
 * - Touch/drag swiping on all devices
 * - Keyboard accessible
 * - Breakpoint-based slides-per-view (≈2 → 7)
 *
 * Note: The app is RTL-first (`dir="rtl"` on <html>), so Swiper
 * automatically reverses slide order/direction.
 */
export const CategorySlider = forwardRef<CategorySliderHandle, CategorySliderProps>(
  function CategorySlider({ categories }, ref) {
    const swiperRef = useRef<SwiperClass | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        slidePrev: () => swiperRef.current?.slidePrev(),
        slideNext: () => swiperRef.current?.slideNext(),
      }),
      []
    );

    if (categories.length === 0) {
      return (
        <EmptyState
          title="دسته‌بندی‌ای یافت نشد"
          description="در حال حاضر دسته‌بندی‌ای برای نمایش وجود ندارد."
        />
      );
    }

    const canLoop = categories.length > 7;

    return (
      <Swiper
        modules={[A11y, Keyboard]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        loop={canLoop}
        grabCursor
        keyboard={{ enabled: true }}
        slidesPerView={2.2}
        spaceBetween={10}
        breakpoints={{
          480: { slidesPerView: 3, spaceBetween: 12 },
          640: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 5, spaceBetween: 14 },
          1024: { slidesPerView: 6, spaceBetween: 16 },
          1280: { slidesPerView: 7, spaceBetween: 18 },
        }}
        className="!py-1"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!h-auto">
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);