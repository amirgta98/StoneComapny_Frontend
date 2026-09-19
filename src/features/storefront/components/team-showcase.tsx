"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import gsap from "gsap";

import "swiper/css";

import { EmptyState } from "@/components/data-listing";
import { Badge } from "@/components/ui";
import type { TeamMember } from "../data/test-team";

import { Section } from "./section";
import { SliderArrows } from "./slider-arrows";

/** Imperative API exposed by `TeamSlider` via ref. */
export type TeamSliderHandle = {
  slidePrev: () => void;
  slideNext: () => void;
};

type TeamSliderProps = {
  members: TeamMember[];
};

/**
 * Headless, RTL-aware Swiper of team-member cards. Renders only the
 * slides; the parent `Section` provides the header and drives navigation
 * through the imperative handle (same pattern as the other sliders).
 */
export const TeamSlider = forwardRef<TeamSliderHandle, TeamSliderProps>(
  function TeamSlider({ members }, ref) {
    const swiperRef = useRef<SwiperClass | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        slidePrev: () => swiperRef.current?.slidePrev(),
        slideNext: () => swiperRef.current?.slideNext(),
      }),
      []
    );

    if (members.length === 0) {
      return (
        <EmptyState
          title="عضوی ثبت نشده است"
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
        slidesPerView={1.5}
        spaceBetween={10}
        breakpoints={{
          480: { slidesPerView: 2.5, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          900: { slidesPerView: 4, spaceBetween: 14 },
          1100: { slidesPerView: 4, spaceBetween: 16 },
        }}
        className="!py-1"
      >
        {members.map((member) => (
          <SwiperSlide key={member.id} className="!h-auto">
            {/* Team-member card — design-system card idiom */}
            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
              {/* Portrait */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.imageAlt ?? member.name}
                  fill
                  sizes="(max-width: 480px) 90vw, (max-width: 640px) 45vw, (max-width: 900px) 30vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              {/* Name + role badge */}
              <div className="flex flex-1 flex-col items-center gap-2 p-4 text-center">
                <h3 className="text-sm font-bold leading-snug sm:text-base">
                  {member.name}
                </h3>
                <Badge variant="secondary">{member.role}</Badge>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);

type TeamShowcaseProps = {
  members: TeamMember[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
};

/**
 * Drop-in "Sales & consultants team" section for storefront pages.
 *
 * Composes the reusable `Section` divider (eyebrow + title + slider
 * arrows in the action slot) with the headless `TeamSlider`.
 *
 * ```tsx
 * <TeamShowcase members={testTeam} />
 * ```
 */
export function TeamShowcase({
  members,
  eyebrow = "تیم ما",
  title = "تیم فروش و مشاورین",
}: TeamShowcaseProps) {
  const sliderRef = useRef<TeamSliderHandle>(null);
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
        aria-label="تیم فروش و مشاورین صنایع سنگ سپنتا"
        action={
          <SliderArrows
            onPrev={() => sliderRef.current?.slidePrev()}
            onNext={() => sliderRef.current?.slideNext()}
            prevLabel="اعضای قبلی"
            nextLabel="اعضای بعدی"
          />
        }
      >
        <TeamSlider ref={sliderRef} members={members} />
      </Section>
    </div>
  );
}