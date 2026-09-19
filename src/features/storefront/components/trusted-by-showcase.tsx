"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import gsap from "gsap";

import "swiper/css";

import { EmptyState } from "@/components/data-listing";
import type { Partner } from "@/features/partners";

import { Section } from "./section";
import { SliderArrows } from "./slider-arrows";

/** Imperative API exposed by `TrustedBySlider` via ref. */
export type TrustedBySliderHandle = {
  slidePrev: () => void;
  slideNext: () => void;
};

type TrustedBySliderProps = {
  partners: Partner[];
};

/**
 * Headless, RTL-aware Swiper of partner/logo cards. Renders only the
 * slides; the parent `Section` provides the header and drives navigation
 * through the imperative handle (same pattern as the other sliders).
 */
export const TrustedBySlider = forwardRef<
  TrustedBySliderHandle,
  TrustedBySliderProps
>(function TrustedBySlider({ partners }, ref) {
  const swiperRef = useRef<SwiperClass | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideNext: () => swiperRef.current?.slideNext(),
    }),
    []
  );

  if (partners.length === 0) {
    return (
      <EmptyState
        title="همکاری به ثبت نرسیده است"
        description="در حال حاضر اطلاعاتی برای نمایش در این بخش وجود ندارد."
      />
    );
  }

  return (
    <Swiper
      modules={[A11y, Keyboard]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      grabCursor
      keyboard={{ enabled: true }}
      slidesPerView={2.5}
      spaceBetween={10}
      breakpoints={{
        480: { slidesPerView: 3.5, spaceBetween: 12 },
        640: { slidesPerView: 4, spaceBetween: 12 },
        900: { slidesPerView: 5, spaceBetween: 14 },
        1100: { slidesPerView: 6, spaceBetween: 16 },
      }}
      className="!py-1"
    >
      {partners.map((partner) => {
        const card = (
          <>
            {/* Compact logo — square, contained (logos are small) */}
            <div className="relative aspect-square w-full overflow-hidden bg-accent/30">
              <Image
                src={partner.image}
                alt={partner.imageAlt ?? partner.title}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 640px) 25vw, (max-width: 900px) 18vw, 14vw"
                className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 items-center justify-center px-3 pb-4 pt-2 text-center">
              <h3 className="text-xs font-bold leading-snug sm:text-sm">
                {partner.title}
              </h3>
            </div>
          </>
        );

        const cardClass =
          "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

        return (
          <SwiperSlide key={partner.id} className="!h-auto">
            {partner.href ? (
              <Link href={partner.href} className={cardClass}>
                {card}
              </Link>
            ) : (
              <article className={cardClass}>{card}</article>
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
});

type TrustedByShowcaseProps = {
  partners: Partner[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
};

/**
 * Drop-in "Companies that trusted us" section for storefront pages.
 *
 * Composes the reusable `Section` divider (eyebrow + title + slider
 * arrows in the action slot) with the headless `TrustedBySlider`.
 * Whole cards become links when `partner.href` is set.
 *
 * ```tsx
 * <TrustedByShowcase partners={testPartners} />
 * ```
 */
export function TrustedByShowcase({
  partners,
  eyebrow = "اعتماد شما افتخار ماست",
  title = "کسانی که به ما اعتماد کرده اند",
}: TrustedByShowcaseProps) {
  const sliderRef = useRef<TrustedBySliderHandle>(null);
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
        aria-label="شرکت‌هایی که با ما همکاری کرده‌اند"
        action={
          <SliderArrows
            onPrev={() => sliderRef.current?.slidePrev()}
            onNext={() => sliderRef.current?.slideNext()}
            prevLabel="همکاران قبلی"
            nextLabel="همکاران بعدی"
          />
        }
      >
        <TrustedBySlider ref={sliderRef} partners={partners} />
      </Section>
    </div>
  );
}