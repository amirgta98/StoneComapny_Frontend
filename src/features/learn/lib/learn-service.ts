import type {
  Article,
  ArticleCategoryKey,
  ArticleDifficultyKey,
  LearnFilterState,
} from "../types";
import { matchesSearchQuery } from "@/lib/search-normalization";
import { testArticles } from "../data/test-articles";

export const ARTICLE_CATEGORIES: { key: ArticleCategoryKey; label: string }[] = [
  { key: "all", label: "همه مقالات و راهنماها" },
  { key: "buying-guide", label: "راهنمای خرید و انتخاب" },
  { key: "installation", label: "اصول نصب و مهندسی نما" },
  { key: "maintenance", label: "نگهداری، ساب و ترمیم" },
  { key: "quarries-types", label: "معادن و شناخت انواع سنگ" },
  { key: "architecture", label: "معماری و دکوراسیون" },
];

export const ARTICLE_DIFFICULTIES: {
  key: ArticleDifficultyKey;
  label: string;
}[] = [
  { key: "all", label: "همه سطوح آموزشی" },
  { key: "beginner", label: "مبتدی و عمومی" },
  { key: "intermediate", label: "متوسط و سازندگان" },
  { key: "advanced", label: "تخصصی معماران و مهندسان" },
];

export function filterArticles(
  articles: Article[],
  filters: LearnFilterState
): Article[] {
  const filtered = articles.filter((article) => {
    // 1. Category filter
    if (filters.category !== "all" && article.category !== filters.category) {
      return false;
    }

    // 2. Difficulty filter
    if (
      filters.difficulty !== "all" &&
      article.difficultyKey !== filters.difficulty
    ) {
      return false;
    }

    // 3. Search query normalization (Persian/Arabic standards)
    if (filters.query && filters.query.trim()) {
      const haystack = [
        article.title,
        article.excerpt,
        article.categoryLabel,
        article.author.name,
        article.author.role,
        ...(article.tags || []),
        ...(article.keyTakeaways || []),
        ...(article.sections.map((s) => `${s.title} ${s.paragraphs.join(" ")}`) || []),
        ...(article.faqs?.map((f) => `${f.question} ${f.answer}`) || []),
      ].join(" ");

      if (!matchesSearchQuery(haystack, filters.query)) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  return filtered.sort((a, b) => {
    if (filters.sortBy === "read-time-asc") {
      return a.readTimeMinutes - b.readTimeMinutes;
    }
    if (filters.sortBy === "read-time-desc") {
      return b.readTimeMinutes - a.readTimeMinutes;
    }
    // "newest" by default
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getArticleBySlug(slug: string): Article | undefined {
  return testArticles.find((a) => a.slug === slug);
}

export function getFeaturedArticle(articles: Article[]): Article | undefined {
  return articles.find((a) => a.featured) || articles[0];
}

export function getRelatedArticles(
  currentSlug: string,
  limit: number = 3
): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return testArticles.slice(0, limit);

  return testArticles
    .filter((a) => a.slug !== current.slug)
    .sort((a, b) => {
      // 1. Explicitly designated related article slugs (+10 score)
      const explicitA = current.relatedArticleSlugs?.includes(a.slug) ? 10 : 0;
      const explicitB = current.relatedArticleSlugs?.includes(b.slug) ? 10 : 0;

      // 2. Same category (+3 score)
      const sameCatA = a.category === current.category ? 3 : 0;
      const sameCatB = b.category === current.category ? 3 : 0;

      // 3. Shared tags (+1 score per shared tag)
      const sharedTagsA = a.tags.filter((t) => current.tags.includes(t)).length;
      const sharedTagsB = b.tags.filter((t) => current.tags.includes(t)).length;

      const scoreA = explicitA + sameCatA + sharedTagsA;
      const scoreB = explicitB + sameCatB + sharedTagsB;

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // Tie-breaker: newest published first
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}
