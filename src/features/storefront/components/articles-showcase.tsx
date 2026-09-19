import Image from "next/image";
import Link from "next/link";

import { CalendarDays } from "lucide-react";

import type { Article } from "@/features/articles";

import { Button } from "@/components/ui";
import { Section } from "./section";

type ArticlesShowcaseProps = {
  articles: Article[];
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Supporting text below the title (optional). */
  description?: string;
  /**
   * When provided, a "view all" CTA is always shown linking to this
   * destination (e.g. the full articles-listing page).
   */
  viewAllHref?: string;
};

/** Formats an ISO timestamp as a long-form Jalali (fa-IR) date. */
function formatPublishDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type ArticleCardProps = {
  article: Article;
};

/**
 * Editorial article card: cover image on top, publish time, title and a
 * short excerpt below — consistent with the card idiom of the design
 * system (`rounded-lg border border-border bg-card`).
 */
function ArticleCard({ article }: ArticleCardProps) {
  const body = (
    <>
      {/* Cover image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Text body */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <time
          dateTime={article.publishedAt}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <CalendarDays
            className="size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          {formatPublishDate(article.publishedAt)}
        </time>

        <h3 className="text-base font-bold leading-snug sm:text-lg">
          {article.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
      </div>
    </>
  );

  const cardClass =
    "group flex flex-col overflow-hidden rounded-lg border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  // When a destination exists, wrap the whole card in a link; otherwise
  // render a plain semantic `<article>`.
  return article.href ? (
    <Link href={article.href} className={cardClass}>
      {body}
    </Link>
  ) : (
    <article className={cardClass}>{body}</article>
  );
}

/**
 * Drop-in "latest articles" section for storefront pages.
 *
 * Composes the reusable `Section` divider with a responsive grid of
 * editorial cards (cover image, publish time, title, short description).
 * Ships as a Server Component (no interactivity); dates are formatted on
 * the server so there is no hydration mismatch.
 *
 * ```tsx
 * <ArticlesShowcase
 *   articles={articles}
 *   eyebrow="دانستنی های سنگ"
 *   title="آخرین مقالات"
 * />
 * ```
 */
export function ArticlesShowcase({
  articles,
  eyebrow = "دانستنی های سنگ",
  title = "آخرین مقالات",
  description,
  viewAllHref,
}: ArticlesShowcaseProps) {
  if (articles.length === 0) return null;

  return (
    <Section
      eyebrow={eyebrow}
      title={title}
      description={description}
      aria-label="لیست مقالات"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="min-w-56">
            <Link href={viewAllHref}>مشاهده همه مقالات</Link>
          </Button>
        </div>
      )}
    </Section>
  );
}