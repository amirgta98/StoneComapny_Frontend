import Image from "next/image";

import { CheckCircle2 } from "lucide-react";

type FacadeStonesArticleShowcaseProps = {
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Article heading. */
  title?: string;
  /** Bold lead-in below the heading. */
  subheading?: string;
  /** Body paragraphs of the article. */
  paragraphs?: string[];
  /** Key takeaways rendered as a check list at the end. */
  highlights?: string[];
  /** Editorial photo accompanying the article. */
  image?: string;
  /** Accessible description of the image. */
  imageAlt?: string;
};

const FACADE_STONES_PARAGRAPHS = [
  "نمای ساختمان نخستین چیزی است که از یک بنا دیده می‌شود و سنگ طبیعی هنوز صدرنشین این ویترین است. سنگ‌های نمای خارجی به سبب تراکم بالا، عمر بلند و مقاومت در برابر تابش آفتاب، باران و نوسان دما، هم زیبایی ساختمان را برای دهه‌ها حفظ می‌کنند و هم مانند یک سپر محافظ، بدنه اصلی بنا را در برابر شرایط جوی بیمه می‌کنند.",
  "تراورتن به لطف خلل‌وفرج طبیعی و وزن کم، بیشترین چسبندگی را با ملات دارد و همچنان پرطرفدارترین سنگ نمای ایرانی است. گرانیت و بازالت با جذب آب بسیار کم، انتخابی مطمئن برای مناطق سرد و مرطوب هستند و ماسه‌سنگ برای جلوه گرم و کلاسیک پیشنهاد می‌شود. پرداخت پولیش یا تیغه‌ای ظاهری لوکس می‌سازد و سندبلاست مقاومت سطح سنگ را در هوای آزاد بیشتر می‌کند.",
];

const FACADE_STONES_HIGHLIGHTS = [
  "مقاومت بالا در برابر بارش، سرما و یخ‌زدگی",
  "پایداری رنگ در برابر نور مستقیم آفتاب",
  "اجرای خشک (گره‌خور) برای ایمنی و ماندگاری بیشتر",
];

/**
 * Drop-in editorial `<article>` about exterior facade stones for
 * storefront pages.
 *
 * Rendered as `<article>` (meant to sit inside a `<section>` on the page)
 * with a premium editorial split layout (RTL-aware): the image sits on the
 * right on desktop and stacks above the text on mobile. Uses only theme
 * tokens, keeps the image space reserved to avoid layout shift, and ships
 * as a Server Component (no interactivity).
 *
 * ```tsx
 * <section>
 *   <FacadeStonesArticleShowcase />
 * </section>
 * ```
 */
export function FacadeStonesArticleShowcase({
  eyebrow = "راهنمای انتخاب سنگ",
  title = "سنگ های نمای خارجی؛ چهره ماندگار ساختمان",
  subheading = "چرا سنگ طبیعی، بهترین انتخاب برای نمای بیرونی است؟",
  paragraphs = FACADE_STONES_PARAGRAPHS,
  highlights = FACADE_STONES_HIGHLIGHTS,
  image = "/test_images/stones/test_2.jpg",
  imageAlt = "نمای ساختمانی اجراشده با سنگ تراورتن",
}: FacadeStonesArticleShowcaseProps) {
  return (
    <article
      aria-label="مقاله: سنگ های نمای خارجی"
      className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
    >
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

      {/* Article body — second in DOM, so it lands on the left side in RTL */}
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
          <h2 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            {title}
          </h2>
        </div>

        <h3 className="text-lg font-bold leading-snug sm:text-xl">
          {subheading}
        </h3>

        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed"
          >
            {paragraph}
          </p>
        ))}

        <ul className="space-y-3 pt-1">
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
    </article>
  );
}