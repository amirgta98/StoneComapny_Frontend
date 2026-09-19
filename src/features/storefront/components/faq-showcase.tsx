import Link from "next/link";

import { Button } from "@/components/ui";

import type { FaqItem } from "../data/test-faqs";
import { testFaqs } from "../data/test-faqs";
import { FaqAccordion } from "./faq-accordion";

type FaqShowcaseProps = {
  /** Q&A content; defaults to the shared test FAQ data. */
  faqs?: FaqItem[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Intro heading on the info side. */
  title?: string;
  /** Supporting text under the heading. */
  description?: string;
  /** Call-to-action label under the description. */
  ctaLabel?: string;
  /** Call-to-action destination (e.g. consultation/contact page). */
  ctaHref?: string;
  /**
   * When `false`, the intro/info column, section heading and CTA are
   * hidden and only the accordion is rendered (full width). Defaults to
   * `true`, i.e. the two-column intro + accordion layout.
   */
  showIntro?: boolean;
};

/**
 * Drop-in Q&A / FAQ section for storefront pages.
 *
 * Premium editorial split layout (RTL-aware):
 * - Right (start): intro info — eyebrow, title, short description and a CTA.
 * - Left (end): the single-open FAQ accordion (the only client-hydrated part).
 * - On mobile the two areas stack vertically in the same visual order.
 *
 * Server Component by design; interactivity lives entirely inside
 * `FaqAccordion` to keep client JS minimal.
 *
 * Set `showIntro={false}` to render only the full-width accordion
 * (no intro/heading/CTA).
 *
 * ```tsx
 * <section>
 *   <FaqShowcase />
 * </section>
 * ```
 */
export function FaqShowcase({
  faqs = testFaqs,
  eyebrow = "پرسش‌های پرتکرار",
  title = "چرا سنگ سپنا؟",
  description =
    "پاسخ پرتکرارترین سوالات مشتریان درباره سنگ‌ها، خدمات و روند همکاری را اینجا بخوانید؛ اگر پاسخ موردنظرتان را پیدا نکردید، کارشناسان ما کنار شما هستند.",
  ctaLabel = "دریافت مشاوره رایگان",
  ctaHref = "/contact",
  showIntro = true,
}: FaqShowcaseProps) {
  if (faqs.length === 0) return null;

  if (!showIntro) {
    return <FaqAccordion items={faqs} />;
  }

  return (
    <div
      aria-label="سوالات متداول"
      className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
    >
      {/* Intro/info — first in DOM, so it lands on the right side in RTL */}
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
          <h2 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            {title}
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          {description}
        </p>

        <Button asChild size="lg" className="min-w-56">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>

      {/* Accordion — second in DOM, so it lands on the left side in RTL */}
      <FaqAccordion items={faqs} />
    </div>
  );
}