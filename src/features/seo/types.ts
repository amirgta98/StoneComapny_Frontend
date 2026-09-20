/**
 * SEO & Search Engine Optimization Feature Type Definitions.
 *
 * Designed for the Stone Factory Management Portal to control meta tags,
 * Google SERP previews, social graph cards, Schema.org structured data,
 * sitemap.xml directives, and robots.txt configurations.
 */

export type PageCategory = "main" | "stones" | "collections" | "showrooms" | "static" | "system";

export type RobotsDirective =
  | "index, follow"
  | "noindex, follow"
  | "noindex, nofollow"
  | "index, nofollow";

export type SchemaType =
  | "WebPage"
  | "CollectionPage"
  | "Product"
  | "Organization"
  | "LocalBusiness"
  | "AboutPage"
  | "ContactPage"
  | "ItemPage";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface OpenGraphMeta {
  title?: string;
  description?: string;
  imageUrl?: string;
  type: "website" | "article" | "product";
}

export type HealthSeverity = "passed" | "warning" | "error" | "info";

export interface HealthIssue {
  id: string;
  level: HealthSeverity;
  message: string;
}

export interface PageSeoItem {
  id: string;
  pageName: string;
  pageNameEn: string;
  slug: string;
  category: PageCategory;
  categoryLabel: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robotsDirective: RobotsDirective;
  openGraph: OpenGraphMeta;
  schemaType: SchemaType;
  priority: number; // 0.1 to 1.0
  changeFreq: ChangeFrequency;
  healthScore: number; // 0 to 100
  healthIssues: HealthIssue[];
  isIndexed: boolean;
  lastModified: string;
}

export interface GlobalSeoSettings {
  siteTitle: string;
  titleSeparator: string;
  titleTemplate: string;
  defaultMetaDescription: string;
  defaultKeywords: string[];
  canonicalBaseUrl: string;
  siteName: string;
  ogDefaultImage: string;
  twitterHandle: string;
  twitterCardType: "summary" | "summary_large_image";
  googleVerificationCode: string;
  bingVerificationCode: string;
  yandexVerificationCode: string;
  indexingEnabled: boolean;
  sitemapEnabled: boolean;
  autoGenerateSitemap: boolean;
  trailingSlash: boolean;
  robotsTxtContent: string;
}

export interface SeoAuditChecklist {
  id: string;
  title: string;
  category: "titles" | "descriptions" | "indexing" | "social" | "schema" | "content";
  status: "passed" | "warning" | "failed";
  score: number;
  weight: number;
  message: string;
  recommendation: string;
  affectedCount?: number;
}

export interface SeoStats {
  overallHealthScore: number;
  totalIndexedPages: number;
  totalPagesCount: number;
  warningPagesCount: number;
  missingDescriptionCount: number;
  sitemapUrlsCount: number;
  schemaCoveragePercentage: number;
  socialGraphReadyPercentage: number;
}

export type SeoActiveTab = "pages" | "global" | "sitemap" | "audit";
export type PageFilterStatus = "all" | "healthy" | "warning" | "noindex";
export type PageFilterCategory = "all" | PageCategory;
export type PageSortOption = "health" | "title" | "slug" | "priority" | "date";
