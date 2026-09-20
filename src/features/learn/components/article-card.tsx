"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ArrowLeft, Tag } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Article } from "../types";

type ArticleCardProps = {
  article: Article;
  className?: string;
};

export function ArticleCard({ article, className }: ArticleCardProps) {
  const detailHref = `/learn/${article.slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
        className
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm border border-border/60 text-xs">
            {article.categoryLabel}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/90 z-10">
          <span className="flex items-center gap-1 font-medium drop-shadow-md">
            <Clock className="size-3.5 text-primary-foreground" />
            {article.readTimeMinutes} دقیقه مطالعه
          </span>
          <Badge variant="outline" className="bg-black/40 text-white border-white/20 text-[10px]">
            {article.difficulty}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 text-right">
        <div>
          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary leading-snug line-clamp-2">
            <Link href={detailHref}>{article.title}</Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md"
                >
                  <Tag className="size-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <div className="relative size-7 overflow-hidden rounded-full border border-border">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          <Button asChild size="sm" variant="ghost" className="gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10">
            <Link href={detailHref}>
              <span>مطالعه</span>
              <ArrowLeft className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
