"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  X,
  Sparkles,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  GraduationCap,
  Layers,
  FileText,
} from "lucide-react";

import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { EmptyState } from "@/components/data-listing";
import type {
  Article,
  ArticleCategoryKey,
  ArticleDifficultyKey,
  LearnFilterState,
} from "../types";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_DIFFICULTIES,
  filterArticles,
  getFeaturedArticle,
} from "../lib/learn-service";
import { ArticleCard } from "./article-card";
import { FeaturedArticleHero } from "./featured-article-hero";

type LearnPageViewProps = {
  initialArticles: Article[];
};

export function LearnPageView({ initialArticles }: LearnPageViewProps) {
  const [filters, setFilters] = useState<LearnFilterState>({
    query: "",
    category: "all",
    difficulty: "all",
    sortBy: "newest",
  });

  const featuredArticle = useMemo(
    () => getFeaturedArticle(initialArticles),
    [initialArticles]
  );

  const filteredArticles = useMemo(
    () => filterArticles(initialArticles, filters),
    [initialArticles, filters]
  );

  const activeFiltersCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    (filters.difficulty !== "all" ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      query: "",
      category: "all",
      difficulty: "all",
      sortBy: "newest",
    });
  };

  return (
    <div className="w-full bg-background text-foreground text-right">
      {/* Hero Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <GraduationCap className="size-4" />
            <span>دانشنامه و آموزش تخصصی صنعت سنگ</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            مرکز یادگیری و راهنمای جامع سنگ ساختمانی
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            مجموعه مقالات فنی، تجربیات کارگاهی، ضوابط نظام مهندسی نما و راهنماهای کاربردی انتخاب، خرید و نگهداری انواع سنگ‌های طبیعی مرمر، تراورتن، گرانیت و اسلب.
          </p>

          {/* Search Field in Hero */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="جستجو در مقالات (مثال: سنگ نما، اسکوپ، بوک‌مچ، شستشوی مرمر)..."
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              className="pr-10 pl-10 h-12 text-sm bg-card border-border shadow-sm rounded-xl"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="پاک کردن جستجو"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Featured Article Spotlight (when not actively searching) */}
        {!filters.query &&
          filters.category === "all" &&
          filters.difficulty === "all" &&
          featuredArticle && <FeaturedArticleHero article={featuredArticle} />}

        {/* Toolbar: Categories + Difficulty Filter + Sort */}
        <div className="space-y-4">
          {/* Top Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {ARTICLE_CATEGORIES.map((cat) => {
                const active = filters.category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: cat.key }))
                    }
                    className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Difficulty & Sort Selectors */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Difficulty */}
              <div className="w-36">
                <Select
                  value={filters.difficulty}
                  onValueChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      difficulty: val as ArticleDifficultyKey,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-xs bg-card">
                    <SelectValue placeholder="سطح مقاله" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_DIFFICULTIES.map((d) => (
                      <SelectItem key={d.key} value={d.key}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="w-36">
                <Select
                  value={filters.sortBy}
                  onValueChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: val as LearnFilterState["sortBy"],
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-xs bg-card">
                    <SelectValue placeholder="مرتب‌سازی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین مقالات</SelectItem>
                    <SelectItem value="read-time-asc">کوتاه‌ترین زمان مطالعه</SelectItem>
                    <SelectItem value="read-time-desc">طولانی‌ترین زمان مطالعه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count & Reset Filter */}
          <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs sm:text-sm text-muted-foreground">
            <span>
              نمایش <strong>{filteredArticles.length.toLocaleString("fa-IR")}</strong> راهنمای تخصصی از مجموع {initialArticles.length.toLocaleString("fa-IR")}
            </span>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 text-xs text-destructive hover:bg-destructive/10 gap-1 px-2"
              >
                <RotateCcw className="size-3" />
                <span>بازنشانی فیلترها</span>
              </Button>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        <div>
          {filteredArticles.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="مقاله‌ای با این مشخصات یافت نشد"
                description="عبارت جستجو یا فیلترهای سطح و دسته‌بندی را تغییر دهید تا نتایج نمایش داده شوند."
                action={
                  <Button variant="outline" onClick={resetFilters} className="gap-2">
                    <RotateCcw className="size-4" />
                    <span>پاک کردن فیلترها</span>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Stone Knowledge Glossary Strip */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base sm:text-lg">
            <BookOpen className="size-5 text-primary" />
            <span>اصطلاحات پرکاربرد بازار و مهندسی سنگ</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary block">بوک‌مچ (Bookmatch)</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                قرینه‌سازی آینه‌ای دو اسلب متوالی از یک کوپ سنگ جهت ایجاد طرح پیوسته پروانه‌ای یا متقارن.
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary block">اسکوپ سنگ (Stone Scoop)</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                شیارزنی پشت سنگ و مهار با سیم گالوانیزه یا گیره فلزی جهت پیشگیری از سقوط سنگ نما در اثر زلزله.
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary block">ساب ایتالیایی (Italian Polish)</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                پرداخت چندمرحله‌ای سنگ با لقمه‌های الماسه فوق ریز و رزین اپوکسی برای درخشش آینه‌ای و شفافیت کریستال‌ها.
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-1">
              <span className="text-xs font-bold text-primary block">نانو آب‌گریز (Hydrophobic Nano)</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                پوشش نفوذگر مولکولی ضدآب و ضدلک که تنفس طبیعی سنگ را حفظ کرده و مانع از جذب چربی و دوده می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* Expert Consultation Callout */}
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-10 text-right">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                <HelpCircle className="size-4" />
                <span>پاسخگویی به سوالات فنی معماران و سازندگان</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                آیا برای انتخاب نوع سنگ پروژه‌تان سوالی دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                کارشناسان ارشد آزمایشگاه متالورژی و مهندسی نما در صنایع سنگ سپنتا آماده‌اند تا به صورت رایگان شما را در انتخاب سنگ متناسب با اقلیم و شرایط سازه راهنمایی کنند.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2 font-semibold">
                <Link href="/contact">
                  <PhoneCall className="size-4" />
                  <span>تماس با مهندسین مشاور</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border">
                <Link href="/projects">
                  <span>مشاهده پروژه‌های اجرایی</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
