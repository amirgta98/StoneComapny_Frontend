"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  HelpCircle,
  Layers,
  ArrowRight,
  Check,
  PhoneCall,
  UserCheck,
} from "lucide-react";

import { Button, Badge } from "@/components/ui";
import { copyToClipboard } from "@/lib/clipboard";
import type { Article } from "../types";
import { ArticleCard } from "./article-card";

type ArticleDetailViewProps = {
  article: Article;
  relatedArticles: Article[];
};

export function ArticleDetailView({
  article,
  relatedArticles,
}: ArticleDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const success = await copyToClipboard(
        window.location.href,
        "لینک مقاله آموزشی کپی شد",
        "خطا در کپی لینک مقاله"
      );
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="w-full bg-background pb-16 text-right">
      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="size-3.5" />
              </li>
              <li>
                <Link
                  href="/learn"
                  className="hover:text-foreground transition-colors"
                >
                  دانشنامه و آموزش
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="size-3.5" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md"
              >
                {article.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        {/* Back Link & Share Action */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/learn">
              <ArrowRight className="size-4" />
              <span>بازگشت به دانشنامه</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs border-border"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-600">لینک کپی شد!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                <span>اشتراک‌گذاری مقاله</span>
              </>
            )}
          </Button>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary font-medium text-xs">
              {article.categoryLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              سطح: {article.difficulty}
            </Badge>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl text-foreground leading-snug">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author & Meta Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-border/60 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="relative size-9 overflow-hidden rounded-full border border-border">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-bold text-foreground">
                  {article.author.name}
                </span>
                <span>{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                {article.readTimeMinutes} دقیقه مطالعه
              </span>
              <span className="opacity-40">•</span>
              <span>
                تاریخ انتشار:{" "}
                {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </header>

        {/* Main Cover Image */}
        <div className="relative mt-8 aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Two-Column Grid: Content & Sticky Sidebar */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 max-w-6xl">
          {/* Main Article Body (8 cols on desktop) */}
          <article className="lg:col-span-8 space-y-10">
            {/* Key Takeaways Box */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span>نکات کلیدی این راهنما در یک نگاه</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                  {article.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-4 pt-2">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl border-r-4 border-primary pr-3">
                  {section.title}
                </h2>

                <div className="space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Callout */}
                {section.callout && (
                  <div
                    className={`rounded-xl border p-4 sm:p-5 my-4 space-y-1.5 ${
                      section.callout.type === "warning"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200"
                        : section.callout.type === "tip"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
                        : "border-primary/20 bg-primary/5 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {section.callout.type === "warning" && (
                        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                      )}
                      {section.callout.type === "tip" && (
                        <Lightbulb className="size-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {section.callout.type === "info" && (
                        <Info className="size-4 text-primary" />
                      )}
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Comparison Table */}
                {section.comparisonTable && (
                  <div className="my-6 overflow-x-auto rounded-xl border border-border shadow-sm">
                    <table className="w-full text-right text-xs sm:text-sm">
                      <thead className="bg-muted/70 text-foreground font-semibold border-b border-border">
                        <tr>
                          {section.comparisonTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {section.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/30">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 ${
                                  cIdx === 0
                                    ? "font-bold text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* List Items */}
                {section.listItems && section.listItems.length > 0 && (
                  <ul className="my-4 space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                    {section.listItems.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* FAQs Accordion */}
            {article.faqs && article.faqs.length > 0 && (
              <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg sm:text-xl">
                  <HelpCircle className="size-5 text-primary" />
                  <span>پرسش‌های متداول و تجارب کارگاهی</span>
                </div>

                <div className="space-y-4">
                  {article.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-foreground">
                        {faq.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Biography Box */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 text-center sm:text-right">
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-bold">
                  <UserCheck className="size-3.5" />
                  نویسنده و پژوهشگر
                </span>
                <h4 className="text-base font-bold text-foreground">
                  {article.author.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {article.author.role} در صنایع سنگ سپنتا؛ فعال در حوزه استانداردسازی فرآوری سنگ‌های ساختمانی و راهنمای پروژه‌های شاخص ملی.
                </p>
              </div>
            </div>
          </article>

          {/* Sticky Sidebar (4 cols on desktop) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
                فهرست سرفصل‌های مقاله
              </h3>

              <nav className="space-y-2">
                {article.sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    <span className="size-1.5 rounded-full bg-primary/40 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </a>
                ))}
              </nav>

              {/* Related Stones Shortcut */}
              {article.relatedStones && article.relatedStones.length > 0 && (
                <div className="border-t border-border pt-4 space-y-2.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-primary" />
                    سنگ‌های مرتبط با این راهنما:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {article.relatedStones.map((st, i) => (
                      <Button
                        key={i}
                        asChild
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Link href={st.href}>{st.name}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Technical Consultation CTA */}
              <div className="border-t border-border pt-4 space-y-3">
                <span className="text-xs font-bold text-foreground block">
                  نیاز به مشاوره فنی دارید؟
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  برای برآورد فنی و دریافت نمونه سنگ واقعی جهت تست مقاومت در آزمایشگاه، با تیم ما تماس حاصل نمایید.
                </p>
                <Button asChild className="w-full gap-2 font-semibold text-xs">
                  <Link href="/contact">
                    <PhoneCall className="size-3.5" />
                    <span>مشاوره مهندسی با سپنتا</span>
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                  مقالات و راهنماهای مرتبط
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  مطالعه سایر آموزش‌های فنی در همین حوزه
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/learn">
                  <span>مشاهده همه مقالات</span>
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
