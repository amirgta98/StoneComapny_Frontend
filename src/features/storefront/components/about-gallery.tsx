"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const GALLERY_IMAGES = [
  { src: "/test_images/stones/test_1.jpg", caption: "مرمر سفید" },
  { src: "/test_images/stones/test_3.jpg", caption: "گرانیت مشکی" },
  { src: "/test_images/stones/test_9.jpg", caption: "ماسه سنگ" },
  { src: "/test_images/stones/test_10.jpg", caption: "مرمر بژ" },
];

/**
 * Stone texture strip — a wide band of material photography that drifts
 * horizontally as the user scrolls (transform-only, edge-masked), like
 * walking past a showroom wall. Static (fully visible) when reduced
 * motion is preferred.
 */
export function AboutGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-24%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="بافت و رنگ سنگ‌های سپنتا"
      className="overflow-hidden py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium text-muted-foreground">بافت و رنگ</p>
          <h2 className="mt-1 text-xl font-bold leading-tight tracking-tight md:text-2xl">
            هر سنگ، یک اثر هنری از طبیعت
          </h2>
        </div>
      </div>

      <motion.div
        style={reduceMotion ? undefined : { x }}
        className="mt-10 flex w-max gap-4 px-4 [mask-image:linear-gradient(to_left,transparent,black_10%,black_90%,transparent)] md:gap-6"
      >
        {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="group w-60 shrink-0 sm:w-72"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={image.src}
                alt={image.caption}
                fill
                sizes="288px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </section>
  );
}