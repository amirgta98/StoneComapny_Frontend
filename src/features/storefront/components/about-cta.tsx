import Link from "next/link";

import { Button } from "@/components/ui";

/**
 * Closing call-to-action band for the About page.
 * Server Component — theme-token driven, no interactivity beyond links.
 */
export function AboutCta() {
  return (
    <div className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 md:py-16">
        <p className="text-xs font-medium text-primary-foreground/80">
          همراهی سپنتا
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
          سنگ مناسب پروژه‌تان را با ما انتخاب کنید
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
          کارشناسان ما از انتخاب معدن تا تحویل، کنار شما هستند؛ کافی است
          پروژه‌تان را معرفی کنید.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/stones">مشاهده محصولات</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}