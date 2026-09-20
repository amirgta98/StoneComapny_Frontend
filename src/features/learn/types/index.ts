export type ArticleCategoryKey =
  | "all"
  | "buying-guide"
  | "installation"
  | "maintenance"
  | "quarries-types"
  | "architecture";

export type ArticleDifficultyKey =
  | "all"
  | "beginner"
  | "intermediate"
  | "advanced";

export type ArticleAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleContentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  callout?: {
    type: "info" | "warning" | "tip";
    title: string;
    text: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  listItems?: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategoryKey;
  categoryLabel: string;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  difficulty: "مبتدی" | "متوسط" | "تخصصی معماران";
  difficultyKey: "beginner" | "intermediate" | "advanced";
  author: ArticleAuthor;
  tags: string[];
  keyTakeaways: string[];
  sections: ArticleContentSection[];
  faqs?: ArticleFaq[];
  relatedStones?: {
    name: string;
    href: string;
    type: string;
  }[];
  relatedArticleSlugs?: string[];
  featured?: boolean;
};

export type LearnFilterState = {
  query: string;
  category: ArticleCategoryKey;
  difficulty: ArticleDifficultyKey;
  sortBy: "newest" | "read-time-asc" | "read-time-desc";
};
