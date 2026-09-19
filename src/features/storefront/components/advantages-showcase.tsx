"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { BadgePercent, Handshake, Truck, Warehouse } from "lucide-react";

import { Section } from "./section";

type Advantage = {
  title: string;
  description: string;
  Icon: typeof Truck;
};

/**
 * Company advantages data.
 * Temporary static content — can be moved to CMS/page data later.
 */
const ADVANTAGES: Advantage[] = [
  {
    title: "ضمانت قیمت",
    description:
      "با حذف واسطه ها و همکاری مستقیم با معادن، بهترین قیمت را تضمین می کنیم؛ کیفیت ممتاز با قیمتی منصفانه و شفاف.",
    Icon: BadgePercent,
  },
  {
    title: "امکان گزینش سنگ",
    description:
      "قبل از خرید، سنگ ها را از نزدیک ببینید و انتخاب کنید؛ گزینش دقیق اسلب و تایل مطابق سلیقه و پروژه شما انجام می شود.",
    Icon: Warehouse,
  },
  {
    title: "تحویل سریع",
    description:
      "سفارش شما در کوتاه ترین زمان ممکن، بسته بندی شده و به سراسر کشور ارسال می شود تا پروژه شما بدون توقف پیش برود.",
    Icon: Truck,
  },
  {
    title: "اسکان مشتریان",
    description:
      "برای مشتریانی که از شهرهای دیگر برای بازدید و انتخاب سنگ تشریف می آورند، امکانات اسکان مناسب فراهم است.",
    Icon: Handshake,
  },
];

type AdvantagesShowcaseProps = {
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
};

/**
 * Drop-in "Why choose us" section for storefront pages.
 *
 * Shows the company's key advantages as a responsive grid of
 * icon-led cards (4 on desktop, 2 on tablet, 1 on mobile).
 *
 * Animates in once on mount with GSAP (header first, then cards with a
 * short staggered rise, icons popping subtly) — never scroll-gated, so
 * items are always already shown when the user reaches this section.
 *
 * Motion is intentionally subtle and disabled for users who prefer
 * reduced motion (`prefers-reduced-motion`).
 *
 * ```tsx
 * <AdvantagesShowcase
 *   eyebrow="چرا سپنتا؟"
 *   title="مزیت های همکاری با ما"
 * />
 * ```
 */
export function AdvantagesShowcase({
  eyebrow = "چرا سپنتا؟",
  title = "مزیت های همکاری با ما",
}: AdvantagesShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip animation entirely when the user prefers reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Play once on mount (NOT on scroll) so items are already shown by
    // the time the user reaches this section — no hidden-while-waiting.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from("[data-slot='section-header']", { autoAlpha: 0, y: 16, duration: 0.35 })
        .from(
          "[data-anim='card']",
          { autoAlpha: 0, y: 20, duration: 0.4, stagger: 0.06 },
          "-=0.15"
        )
        .from(
          "[data-anim='icon']",
          { scale: 0.7, autoAlpha: 0, duration: 0.3, ease: "back.out(1.8)", stagger: 0.06 },
          "-=0.25"
        );

      // --- Hover interaction: gentle lift on enter, settle on leave ---
      const cleanups = gsap.utils
        .toArray<HTMLElement>("[data-anim='card']")
        .map((card) => {
          const enter = () =>
            gsap.to(card, {
              y: -6,
              boxShadow: "0 12px 24px -8px rgba(0,0,0,0.18)",
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          const leave = () =>
            gsap.to(card, {
              y: 0,
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });

          card.addEventListener("mouseenter", enter);
          card.addEventListener("mouseleave", leave);
          return () => {
            card.removeEventListener("mouseenter", enter);
            card.removeEventListener("mouseleave", leave);
          };
        });

      // gsap.context supports returning a cleanup fn run by ctx.revert().
      return () => cleanups.forEach((fn) => fn());
    }, rootRef);

    return () => ctx.revert();
  }, []);


  return (
    <div ref={rootRef}>
      <Section eyebrow={eyebrow} title={title} aria-label="مزیت های شرکت">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map(({ title: advantageTitle, description, Icon }) => (
            <div
              key={advantageTitle}
              data-anim="card"
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 will-change-transform"
            >
              {/* Icon */}
              <div
                data-anim="icon"
                className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </div>

              {/* Title */}
              <h3 className="font-semibold leading-snug">{advantageTitle}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

