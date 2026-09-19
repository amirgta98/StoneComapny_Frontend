"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui";

import { CINEMATIC_EASE } from "./cinematic-hero";

const IMAGE_SRC = "/test_images/Hero_1_bg.png";

/** Fade/slide entrance; static (fully visible) when reduced motion is preferred. */
const reveal = (reduceMotion: boolean | null, delay: number) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: CINEMATIC_EASE },
      };

/**
 * About hero — editorial split (deliberately distinct from the homepage's
 * cinematic full-bleed hero): light cream section, story text on one side,
 * a tall rounded stone-photo panel on the other (RTL: text first/right).
 *
 * Loading sequence: the image is uncovered by a top-down clip-path wipe
 * while its inner photo counter-zooms, then eyebrow → heading → description
 * → CTAs rise with a short stagger. No scroll interaction — the narrative
 * sections below own the scroll choreography. Everything is disabled for
 * `prefers-reduced-motion` (static, visible).
 */
export function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="داستان سنگ سپنتا" className="bg-background">
      <div className="container mx-auto grid items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:gap-14 md:pb-24 md:pt-16 lg:px-8">
        {/* Story copy — first in DOM → right side under RTL */}
        <div>
          <motion.p
            {...reveal(reduceMotion, 0.15)}
            className="text-xs font-medium text-primary"
          >
            داستان ما
          </motion.p>

          <motion.h1
            {...reveal(reduceMotion, 0.25)}
            className="mt-4 text-3xl font-bold leading-[1.2] text-foreground sm:text-4xl md:text-5xl"
          >
            سنگی که
            <br />
            به معماری بدل می‌شود
          </motion.h1>

          <motion.p
            {...reveal(reduceMotion, 0.4)}
            className="mt-5 max-w-md text-base leading-8 text-muted-foreground"
          >
            چهار دهه هم‌نفسی با زمین؛ از دل معادن ایران تا نمایی ماندگار در
            ساختمان‌های شما.
          </motion.p>

          <motion.div
            {...reveal(reduceMotion, 0.55)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="#about-story">کشف داستان ما</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/stones">مشاهده سنگ‌ها</Link>
            </Button>
          </motion.div>
        </div>

        {/* Stone photo — clip-path wipe uncovering + inner counter-zoom */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -start-4 hidden h-full w-full rounded-[2rem] bg-primary/10 md:block"
          />
          <motion.div
            initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={
              reduceMotion ? undefined : { clipPath: "inset(0 0 0% 0)" }
            }
            transition={{ duration: 1.1, delay: 0.2, ease: CINEMATIC_EASE }}
            className="relative overflow-hidden rounded-3xl shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 1.15 }}
              animate={reduceMotion ? undefined : { scale: 1 }}
              transition={{ duration: 1.6, delay: 0.2, ease: CINEMATIC_EASE }}
              className="relative aspect-[4/5] w-full"
            >
              <Image
                src={IMAGE_SRC}
                alt="اسلب‌های سنگ طبیعی در کارخانه فرآوری"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
