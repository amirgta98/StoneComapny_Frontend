import type { Metadata } from "next";

import {
  AboutCta,
  AboutGallery,
  AboutHero,
  AboutJourney,
  AboutProcess,
  AboutStats,
} from "@/features/storefront";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "داستان صنایع سنگ سپنتا؛ چهار دهه استخراج، برش و فرآوری سنگ‌های طبیعی ایرانی — از انتخاب بلوک در معدن تا تحویل اسلب و تایل در سراسر ایران.",
};

/**
 * /about — premium animated brand story.
 *
 * Thin route-level composition (feature-first): the editorial split hero is
 * client island (motion/react load entrance); the narrative
 * sections (story split, stats count-up, process line-draw, texture strip)
 * each own their restrained, reduced-motion-aware animation.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Page content — flows directly under the light editorial hero */}
      <div className="relative z-10">
        <AboutJourney />
        <AboutStats />
        <AboutProcess />
        <AboutGallery />
        <AboutCta />
      </div>
    </>
  );
}