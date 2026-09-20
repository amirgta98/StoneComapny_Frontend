/**
 * Learn & Knowledge Base module.
 *
 * Provides stone architectural educational articles, selection guides,
 * installation standards, maintenance tutorials, and quarry insights (/learn and /learn/[slug]).
 */

export * from "./types";
export { testArticles } from "./data/test-articles";
export {
  filterArticles,
  getArticleBySlug,
  getRelatedArticles,
  getFeaturedArticle,
  ARTICLE_CATEGORIES,
  ARTICLE_DIFFICULTIES,
} from "./lib/learn-service";
export { ArticleCard } from "./components/article-card";
export { FeaturedArticleHero } from "./components/featured-article-hero";
export { LearnPageView } from "./components/learn-page-view";
export { ArticleDetailView } from "./components/article-detail-view";
