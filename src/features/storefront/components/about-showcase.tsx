import Image from "next/image";

import { CheckCircle2 } from "lucide-react";

import { Section } from "./section";

type AboutShowcaseProps = {
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Image shown on the start (right) side on desktop. */
  image?: string;
  /** Accessible description of the image. */
  imageAlt?: string;
  /** Bold lead-in below the title. */
  subheading?: string;
  /** Main descriptive paragraph. */
  description?: string;
  /** Short highlight points shown as a check list. */
  highlights?: string[];
};

const ABOUT_HIGHLIGHTS = [
  "همکاری مستقیم با معادن سنگ کشور و حذف واسطه‌ها",
  "برش، فرآوری و پرداخت اسلب و تایل با ماشین‌آلات پیشرفته",
  "تضمین کیفیت، بسته‌بندی استاندارد و ارسال به سراسر ایران",
];

/**
 * Drop-in "About the company" section for storefront pages.
 *
 * Premium editorial split layout (RTL-aware):
 * - On desktop the image sits on the right and the text on the left.
 * - On mobile everything stacks vertically (image first, then text).
 *
 * Composes the reusable `Section` divider with an image-led two-column
 * grid. Uses only theme tokens, keeps the image space reserved to avoid
 * layout shift, and ships as a Server Component (no interactivity).
 *
 * ```tsx
 * <AboutShowcase
 *   eyebrow="درباره ما"
 *   title="درباره سنگ سپنتا"
 *   image="/test_images/stones/test_1.jpg"
 * />
 * ```
 */
export function AboutShowcase({
  eyebrow = "درباره ما",
  title = "درباره سنگ سپنتا",
  image = "/test_images/stones/test_1.jpg",
  imageAlt = "نمایی از سنگ طبیعی سپنتا",
  subheading = "سفری چهار دهه‌ای در صنعت سنگ ایران",
  description =
    "صنایع سنگ سپنتا از ابتدای فعالیت با تکیه بر دانش فنی، تجهیزات مدرن و همراهی تیمی متخصص، به یکی از مجموعه‌های شناخته‌شده در حوزه استخراج، برش و فرآوری سنگ‌های طبیعی تبدیل شده است. ما با ارائه مرمر، تراورتن، گرانیت و ده‌ها نوع سنگ ساختمانی، در پروژه‌های مسکونی، تجاری و معماری سراسر کشور حضور داشته‌ایم و کیفیت را در هر مرحله از تولید تا تحویل تضمین می‌کنیم.",
  highlights = ABOUT_HIGHLIGHTS,
}: AboutShowcaseProps) {
  return (
    <Section eyebrow={eyebrow} title={title} aria-label="درباره سنگ سپنتا">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Image — first in DOM, so it lands on the right side in RTL */}
        <div className="relative">
          {/* Subtle brand accent behind the image */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 size-24 rounded-2xl bg-primary/10 sm:size-32"
          />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Text — second in DOM, so it lands on the left side in RTL */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold leading-snug sm:text-2xl">
            {subheading}
          </h3>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
            {description}
          </p>

          <ul className="space-y-3">
            {highlights.map((item) => (
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
  );
}
