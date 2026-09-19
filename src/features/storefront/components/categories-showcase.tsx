"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  CategorySlider,
  type Category,
  type CategorySliderHandle,
} from "@/features/categories";

import { Section } from "./section";
import { SliderArrows } from "./slider-arrows";

type CategoriesShowcaseProps = {
  categories: Category[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
};

/**
 * Drop-in "Browse by Category" section.
 *
 * Composes the reusable `Section` divider (eyebrow + title + slider
 * arrows in the action slot) with the headless `CategorySlider`.
 * Can be used on any storefront page.
 *
 * Animates in once on mount with GSAP (header first, then cards with a
 * short staggered rise) — never scroll-gated, so items are always
 * already shown when the user reaches this section.
 *
 * Only the *content* of each slide is animated (`> *` inside slides);
 * Swiper's own wrapper/slide transforms are never touched. Motion is
 * skipped for users who prefer reduced motion.
 *
 * ```tsx
 * <CategoriesShowcase
 *   categories={categories}
 *   eyebrow="دسته بندی سنگ ها"
 *   title="دسته بندی بر اساس نوع"
 * />
 * ```
 */
export function CategoriesShowcase({
  categories,
  eyebrow = "دسته بندی سنگ ها",
  title = "دسته بندی بر اساس نوع",
}: CategoriesShowcaseProps) {
  const sliderRef = useRef<CategorySliderHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip animation entirely when the user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Play once on mount (NOT on scroll) so items are already shown by
    // the time the user reaches this section — no hidden-while-waiting.
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from("[data-slot='section-header']", { autoAlpha: 0, y: 16, duration: 0.35 })
        .from(
          ".swiper-slide > *",
          { autoAlpha: 0, y: 20, duration: 0.4, stagger: 0.04 },
          "-=0.15"
        );

      // --- Hover interaction: gentle lift on enter, settle on leave ---
      // Applied to the card content inside each slide so Swiper's own
      // wrapper/slide transforms are never touched.
      const cleanups = gsap.utils
        .toArray<HTMLElement>(".swiper-slide > *")
        .map((item) => {
          const enter = () =>
            gsap.to(item, {
              y: -5,
              boxShadow: "0 12px 24px -8px rgba(0,0,0,0.18)",
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          const leave = () =>
            gsap.to(item, {
              y: 0,
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });

          item.addEventListener("mouseenter", enter);
          item.addEventListener("mouseleave", leave);
          return () => {
            item.removeEventListener("mouseenter", enter);
            item.removeEventListener("mouseleave", leave);
          };
        });

      // gsap.context supports returning a cleanup fn run by ctx.revert().
      return () => cleanups.forEach((fn) => fn());
    }, rootRef);

    return () => ctx.revert();
  }, []);


  return (
    <div ref={rootRef}>
      <Section
        eyebrow={eyebrow}
        title={title}
        aria-label="دسته‌بندی‌ها"
        action={
          <SliderArrows
            onPrev={() => sliderRef.current?.slidePrev()}
            onNext={() => sliderRef.current?.slideNext()}
            prevLabel="دسته‌بندی قبلی"
            nextLabel="دسته‌بندی بعدی"
          />
        }
      >
        <CategorySlider ref={sliderRef} categories={categories} />
      </Section>
    </div>
  );
}
