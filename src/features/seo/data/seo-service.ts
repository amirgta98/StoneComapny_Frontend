import type {
  PageSeoItem,
  GlobalSeoSettings,
  SeoStats,
  PageFilterCategory,
  PageFilterStatus,
  PageSortOption,
} from "../types";
import {
  MOCK_PAGE_SEO_ITEMS,
  DEFAULT_GLOBAL_SEO_SETTINGS,
} from "./mock-seo-data";

const SEO_STORAGE_KEY = "stone_company_seo_v1";

interface SerializedSeoStorage {
  pages: PageSeoItem[];
  globalSettings: GlobalSeoSettings;
}

export const seoStorage = {
  load(): { pages: PageSeoItem[]; globalSettings: GlobalSeoSettings } {
    if (typeof window === "undefined") {
      return {
        pages: MOCK_PAGE_SEO_ITEMS,
        globalSettings: DEFAULT_GLOBAL_SEO_SETTINGS,
      };
    }
    try {
      const data = localStorage.getItem(SEO_STORAGE_KEY);
      if (data) {
        const parsed: SerializedSeoStorage = JSON.parse(data);
        if (Array.isArray(parsed.pages) && parsed.globalSettings) {
          return {
            pages: parsed.pages,
            globalSettings: parsed.globalSettings,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load SEO configuration from localStorage", e);
    }
    return {
      pages: MOCK_PAGE_SEO_ITEMS,
      globalSettings: DEFAULT_GLOBAL_SEO_SETTINGS,
    };
  },

  save(pages: PageSeoItem[], globalSettings: GlobalSeoSettings): void {
    if (typeof window === "undefined") return;
    try {
      const payload: SerializedSeoStorage = { pages, globalSettings };
      localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to save SEO configuration to localStorage", e);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(SEO_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear SEO configuration from localStorage", e);
    }
  },
};

export const normalizeSearchText = (text?: string | null): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[آأإ]/g, "ا")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export function calculateSeoStats(pages: PageSeoItem[]): SeoStats {
  const total = pages.length;
  if (total === 0) {
    return {
      overallHealthScore: 0,
      totalIndexedPages: 0,
      totalPagesCount: 0,
      warningPagesCount: 0,
      missingDescriptionCount: 0,
      sitemapUrlsCount: 0,
      schemaCoveragePercentage: 0,
      socialGraphReadyPercentage: 0,
    };
  }

  const indexedPages = pages.filter((p) => p.isIndexed);
  const totalScore = pages.reduce((acc, p) => acc + p.healthScore, 0);
  const overallHealthScore = Math.round(totalScore / total);

  const warningPages = pages.filter(
    (p) => p.healthIssues.length > 0 || p.healthScore < 90
  );

  const missingDescriptions = pages.filter(
    (p) => !p.metaDescription || p.metaDescription.trim().length < 50
  );

  const schemaPages = indexedPages.filter(
    (p) => p.schemaType && p.schemaType.length > 0
  );
  const schemaCoveragePercentage = indexedPages.length
    ? Math.round((schemaPages.length / indexedPages.length) * 100)
    : 0;

  const socialPages = indexedPages.filter(
    (p) => p.openGraph?.title && p.openGraph?.imageUrl
  );
  const socialGraphReadyPercentage = indexedPages.length
    ? Math.round((socialPages.length / indexedPages.length) * 100)
    : 0;

  return {
    overallHealthScore,
    totalIndexedPages: indexedPages.length,
    totalPagesCount: total,
    warningPagesCount: warningPages.length,
    missingDescriptionCount: missingDescriptions.length,
    sitemapUrlsCount: indexedPages.length,
    schemaCoveragePercentage,
    socialGraphReadyPercentage,
  };
}

export function filterAndSortPages(
  pages: PageSeoItem[],
  query: string,
  category: PageFilterCategory,
  status: PageFilterStatus,
  sort: PageSortOption
): PageSeoItem[] {
  let result = [...pages];

  const q = normalizeSearchText(query);
  if (q) {
    result = result.filter((p) => {
      const matchName = normalizeSearchText(p.pageName).includes(q);
      const matchNameEn = normalizeSearchText(p.pageNameEn).includes(q);
      const matchSlug = normalizeSearchText(p.slug).includes(q);
      const matchTitle = normalizeSearchText(p.title).includes(q);
      const matchDesc = normalizeSearchText(p.metaDescription).includes(q);
      const matchKeywords = p.keywords.some((k) =>
        normalizeSearchText(k).includes(q)
      );
      return (
        matchName ||
        matchNameEn ||
        matchSlug ||
        matchTitle ||
        matchDesc ||
        matchKeywords
      );
    });
  }

  if (category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  if (status !== "all") {
    if (status === "healthy") {
      result = result.filter((p) => p.healthScore >= 90 && p.isIndexed);
    } else if (status === "warning") {
      result = result.filter((p) => p.healthIssues.length > 0 || p.healthScore < 90);
    } else if (status === "noindex") {
      result = result.filter((p) => !p.isIndexed);
    }
  }

  result.sort((a, b) => {
    switch (sort) {
      case "health":
        return b.healthScore - a.healthScore;
      case "priority":
        return b.priority - a.priority;
      case "title":
        return a.pageName.localeCompare(b.pageName, "fa");
      case "slug":
        return a.slug.localeCompare(b.slug);
      case "date":
        return b.lastModified.localeCompare(a.lastModified);
      default:
        return 0;
    }
  });

  return result;
}

export function generateSitemapXml(
  pages: PageSeoItem[],
  baseUrl: string
): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const indexedPages = pages.filter((p) => p.isIndexed);

  const urlEntries = indexedPages
    .map((page) => {
      const fullUrl = `${cleanBase}${page.slug.startsWith("/") ? "" : "/"}${page.slug}`;
      const imageSnippet = page.openGraph?.imageUrl
        ? `\n    <image:image>\n      <image:loc>${escapeXml(page.openGraph.imageUrl)}</image:loc>\n      <image:title>${escapeXml(page.title)}</image:title>\n    </image:image>`
        : "";
      return `  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${escapeXml(page.changeFreq)}</changefreq>
    <priority>${page.priority.toFixed(2)}</priority>${imageSnippet}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
}
