"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";

import { Section } from "./section";

const JOURNEY_HIGHLIGHTS = [
  "همکاری مستقیم با معادن سنگ کشور و حذف واسطه‌ها",
  "برش، فرآوری و پرداخت اسلب و تایل با ماشین‌آلات پیشرفته",
  "تضمین کیفیت، بسته‌بندی استاندارد و ارسال به سراسر ایران",
];

/**
 * Brand introduction — editorial split section.
 *
 * Reveal-on-scroll (once, gsap + ScrollTrigger): the image is uncovered by
 * a top-down `clip-path` wipe while its inner photo counter-zooms (spatial
 * continuity), then the story text rises with a short stagger. The section
 * header animates first via its `[data-slot='section-header']` hook.
 *
 * Without JS (or with `prefers-reduced-motion`) nothing is hidden — the
 * content renders fully visible and the animation never runs.
 */
export function AboutJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from("[data-slot='section-header']", {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
      })
        .from(
          "[data-anim='image-clip']",
          { clipPath: "inset(0 0 100% 0)", duration: 1 },
          "-=0.2"
        )
        .from(
          "[data-anim='image']",
          { scale: 1.18, duration: 1.2 },
          "<"
        )
        .from(
          "[data-anim='text'] > *",
          { autoAlpha: 0, y: 22, duration: 0.55, stagger: 0.09 },
          "-=0.7"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} id="about-story" className="scroll-mt-24">
      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Section
          eyebrow="رویکرد ما"
          title="سفری چهار دهه‌ای در دل سنگ"
          aria-label="داستان سنگ سپنتا"
        >
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            {/* Image — top-down clip-path wipe + counter-zoom */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 size-24 rounded-2xl bg-primary/10 sm:size-32"
              />
              <div
                data-anim="image-clip"
                className="relative aspect-[4/5] overflow-hidden rounded-2xl will-change-[clip-path]"
              >
                <Image
                  data-anim="image"
                  src="/test_images/stones/test_2.jpg"
                  alt="برش و فرآوری اسلب سنگ طبیعی در کارخانه سپنتا"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover will-change-transform"
                />
              </div>
            </div>

            {/* Story — staggered rise */}
            <div data-anim="text" className="space-y-5">
              <h3 className="text-xl font-bold leading-snug sm:text-2xl">
                از معدن تا معماری، با وسواس یک صنعتگر
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                صنایع سنگ سپنتا از ابتدای فعالیت با تکیه بر دانش فنی، تجهیزات
                مدرن و همراهی تیمی متخصص، به یکی از مجموعه‌های شناخته‌شده در
                حوزه استخراج، برش و فرآوری سنگ‌های طبیعی تبدیل شده است. ما با
                ارائه مرمر، تراورتن، گرانیت و ده‌ها نوع سنگ ساختمانی، در
                پروژه‌های مسکونی، تجاری و معماری سراسر کشور حضور داشته‌ایم.
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                هر سنگ، دفتری از تاریخ زمین است. ما این دفتر را با دقت ورق
                می‌زنیم تا سنگی صیقل‌خورده، ماندگار و بی‌همتا به پروژه شما
                برسد؛ کیفیت در هر مرحله، از انتخاب بلوک تا تحویل، تضمین
                می‌شود.
              </p>

              <ul className="space-y-3 pt-1">
                {JOURNEY_HIGHLIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed sm:text-base"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}