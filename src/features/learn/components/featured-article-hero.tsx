"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { Article } from "../types";

type FeaturedArticleHeroProps = {
  article: Article;
};

export function FeaturedArticleHero({ article }: FeaturedArticleHeroProps) {
  const detailHref = `/learn/${article.slug}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 lg:p-10 shadow-lg text-right">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left / Text info (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
              <Sparkles className="size-3.5" />
              راهنمای برگزیده هفته
            </span>
            <Badge variant="outline" className="border-border text-xs">
              {article.categoryLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              سطح: {article.difficulty}
            </Badge>
          </div>

          <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground leading-tight">
            <Link href={detailHref} className="hover:text-primary transition-colors">
              {article.title}
            </Link>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>

          {/* Key Takeaways preview */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
              <span className="text-xs font-bold text-foreground block">
                مهم‌ترین نکات کلیدی:
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {article.keyTakeaways.slice(0, 2).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-full border border-border">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-bold text-foreground">
                  {article.author.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {article.author.role}
                </span>
              </div>
            </div>

            <Button asChild size="lg" className="gap-2 font-bold shadow-md">
              <Link href={detailHref}>
                <span>مطالعه کامل مقاله</span>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right / Big Visual Image (5 cols on desktop) */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-md">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 450px"
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>زمان مطالعه: {article.readTimeMinutes} دقیقه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
