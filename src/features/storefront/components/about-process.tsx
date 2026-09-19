"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Mountain, ShieldCheck, Truck } from "lucide-react";

import { Section } from "./section";

const PROCESS_STEPS = [
  {
    title: "استخراج",
    description: "گزینش و استخراج بلوک‌های مرغوب از معادن منتخب ایران.",
    Icon: Mountain,
  },
  {
    title: "برش و فرآوری",
    description: "برش اسلب و تایل با ماشین‌آلات CNC و پرداخت دقیق سطح.",
    Icon: Layers,
  },
  {
    title: "کنترل کیفیت",
    description: "بازبینی رنگ، ابعاد و صیقل در هر مرحله از تولید.",
    Icon: ShieldCheck,
  },
  {
    title: "تحویل سراسری",
    description: "بسته‌بندی استاندارد و ارسال به سراسر ایران.",
    Icon: Truck,
  },
];

/**
 * Production process — four steps along a drawn line.
 *
 * The connector line paints itself via `scaleX` (transform-only, origin at
 * the RTL start edge) while the step cards rise with a short stagger, so
 * the eye follows the story from extraction to delivery.
 */
export function AboutProcess() {
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
          "[data-anim='line']",
          { scaleX: 0, transformOrigin: "right center", duration: 1.1 },
          "-=0.2"
        )
        .from(
          "[data-anim='step']",
          { autoAlpha: 0, y: 26, duration: 0.55, stagger: 0.12 },
          "-=0.7"
        )
        .from(
          "[data-anim='step-icon']",
          { scale: 0.7, autoAlpha: 0, duration: 0.35, ease: "back.out(1.6)", stagger: 0.12 },
          "-=0.9"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Section
          eyebrow="فرآیند ما"
          title="از معدن تا پروژه شما"
          description="هر سنگ پیش از رسیدن به پروژه شما، مسیر دقیق و کنترل‌شده‌ای را طی می‌کند."
          aria-label="فرآیند تولید سنگ سپنتا"
        >
          <div className="relative">
            {/* Connector line — draws itself from the RTL start edge */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-6 hidden h-px bg-border lg:block"
            >
              <div data-anim="line" className="h-full w-full bg-primary/40" />
            </div>

            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} data-anim="step" className="will-change-transform">
                  <div className="relative">
                    <div
                      data-anim="step-icon"
                      className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm"
                    >
                      <step.Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-4 block text-xs font-medium tabular-nums text-muted-foreground"
                    >
                      {(index + 1).toLocaleString("fa-IR")}
                    </span>
                    <h3 className="mt-1 font-semibold leading-snug">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      </div>
    </div>
  );
}