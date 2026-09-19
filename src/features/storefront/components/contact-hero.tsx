"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui";

import { CINEMATIC_EASE } from "./cinematic-hero";

const IMAGE_SRC = "/test_images/stones/test_5.jpg";

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
 * Contact hero — same editorial split language as `AboutHero` (deliberately
 * distinct from the homepage's cinematic full-bleed hero): light cream
 * section, invitation copy on the start side (right under RTL), a tall
 * rounded stone-photo panel on the other side.
 *
 * Loading sequence mirrors the About hero: the image is uncovered by a
 * top-down clip-path wipe while its inner photo counter-zooms, then
 * eyebrow → heading → description → CTAs rise with a short stagger.
 * No scroll interaction. Everything is disabled for
 * `prefers-reduced-motion` (static, visible).
 */
export function ContactHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="تماس با ما" className="bg-background">
      <div className="container mx-auto grid items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:gap-14 md:pb-24 md:pt-16 lg:px-8">
        {/* Invitation copy — first in DOM → right side under RTL */}
        <div>
          <motion.p
            {...reveal(reduceMotion, 0.15)}
            className="text-xs font-medium text-primary"
          >
            تماس با ما
          </motion.p>

          <motion.h1
            {...reveal(reduceMotion, 0.25)}
            className="mt-4 text-3xl font-bold leading-[1.2] text-foreground sm:text-4xl md:text-5xl"
          >
            در گفت‌وگو،
            <br />
            سنگ مناسب پیدا می‌شود
          </motion.h1>

          <motion.p
            {...reveal(reduceMotion, 0.4)}
            className="mt-5 max-w-md text-base leading-8 text-muted-foreground"
          >
            برای مشاوره، استعلام قیمت یا همکاری با ما در تماس باشید؛ کارشناسان
            سپنتا از انتخاب معدن تا تحویل پروژه کنار شما هستند.
          </motion.p>

          <motion.div
            {...reveal(reduceMotion, 0.55)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="#contact-form">ارسال درخواست</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:09130000622">تماس مستقیم</a>
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
                alt="بافت طبیعی اسلب سنگ در نمایشگاه سپنتا"
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
