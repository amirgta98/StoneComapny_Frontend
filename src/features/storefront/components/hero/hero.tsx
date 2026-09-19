"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import type { HeroMediaData } from "./hero-media";
import {
  CinematicHeroBackground,
  CinematicHeroCopy,
  CinematicHeroScrollHint,
  type CinematicHeroCta,
} from "../cinematic-hero";
import type { ReactNode } from "react";

export type HeroCta = CinematicHeroCta;

export type HeroData = {
  companyName: string;
  slogan: string;
  media?: HeroMediaData | null;
  /** Optional multi-line heading (falls back to the slogan on one line). */
  headingLines?: readonly string[];
  /** Optional supporting paragraph under the heading. */
  description?: string;
  /** Optional CTAs (first = primary, second = outline secondary). */
  ctas?: readonly HeroCta[];
};

type HeroProps = {
  data: HeroData;
  children: ReactNode;
};

export function Hero({ data, children }: HeroProps) {
  const reduceMotion = useReducedMotion();

  // Scroll-driven choreography (background parallax + darkening scrim),
  // implemented with framer MotionValues instead of CSS
  // `animation-timeline: scroll()` layers. The CSS scroll-driven scrim
  // mis-resolved in Chromium/Edge (its animation never applied, leaving a
  // plain `bg-black` div at opacity 1) and painted the hero solid black.
  // framer's scrollY-driven MotionValues avoid that class of bug entirely
  // and work even without @supports — same pattern as the /about page.
  const { scrollY } = useScroll();

  // All scroll effects play over the first 100vh of page scroll, matching
  // the original CSS `animation-range: 0vh 100vh`.
  const [viewportH, setViewportH] = useState(0);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const vh = viewportH > 0 ? viewportH : 1;

  const scrollProgress = useTransform(scrollY, [0, vh], [0, 1]);
  const bgY = useTransform(scrollProgress, [0, 1], ["0%", "-12%"]);
  const bgScale = useTransform(scrollProgress, [0, 1], [1, 1.08]);
  // Darkening scrim curve (0 → 0.35), as the next section slides over.
  const scrimOpacity = useTransform(
    scrollProgress,
    [0, 0.35, 0.7, 1],
    [0, 0.05, 0.2, 0.35],
  );
  const parallax = !reduceMotion;

  const eyebrow = data.companyName;
  const headingLines =
    data.headingLines && data.headingLines.length > 0
      ? data.headingLines
      : [data.slogan];
  const [primaryCta, secondaryCta] = data.ctas ?? [];
  const imageSrc = data.media?.type === "image" ? data.media.url : null;

  return (
    <section
      className="relative w-full"
      aria-label="Hero"
    >
      {/*
        Scroll animation area.

        200vh gives us enough scroll distance
        for the hero animation.
      */}
      <div className="relative">
        {/* =====================================================
            STICKY HERO — cinematic (zoom-settle entrance, staggered
            copy reveal) inside the sticky scroll layer
            ===================================================== */}

        <div className="sticky top-0 z-10 h-[75vh] w-full overflow-hidden">
          {/* Hero background — framer-driven scroll parallax (above); the
              child adds the entrance zoom-settle. Transforms compose. */}
          <motion.div
            style={parallax ? { y: bgY, scale: bgScale } : undefined}
            className="absolute inset-0 origin-center"
          >
            {imageSrc && <CinematicHeroBackground src={imageSrc} alt="" />}
          </motion.div>

          {/* Scroll scrim — JS-driven (framer) so its opacity can never
              mis-resolve to opaque black like the CSS scroll-timeline did.
              Reduced motion keeps it transparent. */}
          <motion.div
            aria-hidden="true"
            style={
              parallax
                ? { backgroundColor: "black", opacity: scrimOpacity }
                : { opacity: 0 }
            }
            className="pointer-events-none absolute inset-0"
          />

          {/* Cinematic gradient overlay — reveals with opacity on load */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"
          />

          {/* Hero copy — staggered cinematic reveal; `.hero-content` adds
              the scroll fade/lift as the next section covers the hero */}
          <div className="hero-content absolute inset-0 flex items-center justify-center">
            <CinematicHeroCopy
              eyebrow={eyebrow}
              headingLines={headingLines}
              description={data.description}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
            />
          </div>

          <CinematicHeroScrollHint />
        </div>

        {/* =====================================================
            CONTENT THAT SLIDES OVER HERO
            ===================================================== */}

        <div className="hero-next-section absolute inset-x-0 top-0 z-20">
          {children}
        </div>
      </div>
    </section>
  );
}
