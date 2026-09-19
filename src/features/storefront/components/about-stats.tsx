"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { value: 40, suffix: "+", label: "سال تجربه" },
  { value: 10, suffix: "+", label: "نوع سنگ طبیعی" },
  { value: 12, suffix: "+", label: "معدن همکار" },
  { value: 31, suffix: "", label: "استان تحت پوشش" },
];

/**
 * Company stats band with Persian count-up numbers.
 *
 * Cards rise with a short stagger; each number counts from 0 to its target
 * with `toLocaleString("fa-IR")` formatting the moment it enters the
 * viewport (once). Server-rendered HTML always shows the final values, so
 * the content is complete without JS; with `prefers-reduced-motion` the
 * count-up is skipped entirely.
 */
export function AboutStats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-anim='stat']", {
        autoAlpha: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.utils
        .toArray<HTMLElement>("[data-count]")
        .forEach((el, index) => {
          const target = Number(el.dataset.count ?? "0");
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.4,
            delay: 0.2 + index * 0.09,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toLocaleString(
                "fa-IR"
              );
            },
          });
        });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="border-y bg-muted/40">
        <div className="container mx-auto px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                data-anim="stat"
                className="text-center will-change-transform"
              >
                <dd className="text-4xl font-bold tabular-nums text-primary sm:text-5xl">
                  <span data-count={stat.value}>
                    {stat.value.toLocaleString("fa-IR")}
                  </span>
                  {stat.suffix}
                </dd>
                <dt className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}