"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CINEMATIC_EASE } from "@/lib/motion";

export { CINEMATIC_EASE };

export type CinematicHeroCta = {
  readonly label: string;
  readonly href: string;
  readonly variant?: "default" | "outline";
};

type CinematicHeroCopyProps = {
  eyebrow: string;
  headingLines: readonly string[];
  description?: string;
  primaryCta?: CinematicHeroCta;
  secondaryCta?: CinematicHeroCta;
};

/**
 * Cinematic hero background — settles from a slight zoom (scale 1.12 → 1)
 * on load. Pure transform animation; on the homepage it is nested inside
 * the Hero's framer-driven parallax wrapper (transforms compose).
 */
export function CinematicHeroBackground({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 1.12 }}
      animate={reduceMotion ? undefined : { scale: 1 }}
      transition={{ duration: 2.2, ease: CINEMATIC_EASE }}
      className="absolute inset-0"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </motion.div>
  );
}

/** Fade/slide entrance; no-op object when reduced motion is preferred. */
const entrance = (reduceMotion: boolean | null, delay: number) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: CINEMATIC_EASE },
      };

/**
 * Cinematic hero copy — staggered loading sequence (transform/opacity only):
 * eyebrow → heading revealed line-by-line through an overflow mask →
 * description → CTAs. The copy always sits over a dark image, so
 * white-on-image styles are baked in (identical to the homepage hero).
 */
export function CinematicHeroCopy({
  eyebrow,
  headingLines,
  description,
  primaryCta,
  secondaryCta,
}: CinematicHeroCopyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
      <motion.p
        {...entrance(reduceMotion, 0.5)}
        className="text-xs font-medium text-white/80"
      >
        {eyebrow}
      </motion.p>

      {/* Heading reveals line-by-line through an overflow mask */}
      <h1 className="mt-4 text-4xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl">
        {headingLines.map((line, index) => (
          <span key={`${index}-${line}`} className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={reduceMotion ? false : { y: "110%" }}
              animate={reduceMotion ? undefined : { y: "0%" }}
              transition={{
                duration: 0.9,
                delay: 0.65 + index * 0.14,
                ease: CINEMATIC_EASE,
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {description && (
        <motion.p
          {...entrance(reduceMotion, 1.05)}
          className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
        >
          {description}
        </motion.p>
      )}

      {(primaryCta || secondaryCta) && (
        <motion.div
          {...entrance(reduceMotion, 1.25)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {primaryCta && (
            <Button asChild size="lg">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          )}
          {secondaryCta && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}

/** Decorative scroll indicator pinned to the hero's bottom edge. */
export function CinematicHeroScrollHint({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 bottom-6 z-10 flex justify-center text-white/70",
        className
      )}
    >
      <ChevronDown className="size-5" />
    </div>
  );
}

