"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import gsap from "gsap";

import "swiper/css";

import { EmptyState } from "@/components/data-listing";
import { Button } from "@/components/ui";
import type { Project } from "@/features/projects";

import { Section } from "./section";
import { SliderArrows } from "./slider-arrows";

/** Formats an ISO timestamp as a long-form Jalali (fa-IR) date. */
function formatPublishDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Imperative API exposed by `ProjectsSlider` via ref. */
export type ProjectsSliderHandle = {
  slidePrev: () => void;
  slideNext: () => void;
};

type ProjectsSliderProps = {
  projects: Project[];
};

/**
 * Headless, RTL-aware Swiper of completed-project cards. Renders only the
 * slides; the parent `Section` provides the header and drives navigation
 * through the imperative handle (same pattern as `FacadeStonesSlider`
 * and `CategorySlider`).
 */
export const ProjectsSlider = forwardRef<
  ProjectsSliderHandle,
  ProjectsSliderProps
>(function ProjectsSlider({ projects }, ref) {
  const swiperRef = useRef<SwiperClass | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideNext: () => swiperRef.current?.slideNext(),
    }),
    []
  );

  if (projects.length === 0) {
    return (
      <EmptyState
        title="پروژه ای یافت نشد"
        description="در حال حاضر پروژه ای برای نمایش در این بخش وجود ندارد."
      />
    );
  }

  const canLoop = projects.length > 5;

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
      {projects.map((project) => (
        <SwiperSlide key={project.id} className="!h-auto">
          {/* Completed-project card — design-system card idiom */}
          <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
            {/* Cover photo */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.imageAlt ?? project.title}
                fill
                sizes="(max-width: 480px) 90vw, (max-width: 900px) 45vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* Body: publish time, title and the per-card "view more" CTA */}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <time
                dateTime={project.publishedAt}
                className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <CalendarDays
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {formatPublishDate(project.publishedAt)}
              </time>

              <h3 className="text-sm font-bold leading-snug sm:text-base">
                {project.title}
              </h3>

              <div className="mt-auto pt-2">
                {project.href ? (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={project.href}>مشاهده بیشتر</Link>
                  </Button>
                ) : (
                  <span
                    aria-hidden="true"
                    className="block h-8 rounded-md border border-input bg-background shadow-sm opacity-60 sm:text-xs"
                  />
                )}
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
});

type ProjectsShowcaseProps = {
  projects: Project[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Destination of the "view all projects" CTA below the slider. */
  viewAllHref?: string;
};

/**
 * Drop-in "Completed projects" section for storefront pages.
 *
 * Composes the reusable `Section` divider (eyebrow + title + slider
 * arrows in the action slot) with the headless `ProjectsSlider`, and adds
 * a centered "view all projects" button under the carousel.
 *
 * Animates the header and slide content in once on mount with GSAP
 * (never scroll-gated), skipping users who prefer reduced motion.
 *
 * ```tsx
 * <ProjectsShowcase projects={testProjects} viewAllHref="/projects" />
 * ```
 */
export function ProjectsShowcase({
  projects,
  eyebrow = "نمونه کارها",
  title = "پروژه های انجام شده صنایع سنگ سپنتا",
  viewAllHref,
}: ProjectsShowcaseProps) {
  const sliderRef = useRef<ProjectsSliderHandle>(null);
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
        aria-label="پروژه های انجام شده صنایع سنگ سپنتا"
        action={
          <SliderArrows
            onPrev={() => sliderRef.current?.slidePrev()}
            onNext={() => sliderRef.current?.slideNext()}
            prevLabel="پروژه های قبلی"
            nextLabel="پروژه های بعدی"
          />
        }
      >
        <ProjectsSlider ref={sliderRef} projects={projects} />

        {viewAllHref && projects.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="min-w-56">
              <Link href={viewAllHref}>مشاهده همه پروژه های انجام شده</Link>
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
}