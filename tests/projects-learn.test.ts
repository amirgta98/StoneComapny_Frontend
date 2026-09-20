import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  matchesSearchQuery,
  normalizeSearchTerm,
} from "../src/lib/search-normalization";
import {
  testProjects,
  filterProjects,
  getProjectBySlug,
  getRelatedProjects,
  calculateProjectStats,
  PROJECT_CATEGORIES,
  PROJECT_STONE_CATEGORIES,
} from "../src/features/projects";
import {
  testArticles,
  filterArticles,
  getArticleBySlug,
  getRelatedArticles,
  getFeaturedArticle,
  ARTICLE_CATEGORIES,
  ARTICLE_DIFFICULTIES,
} from "../src/features/learn";

describe("Persian Search Normalization & B2B Guidelines", () => {
  it("converts Arabic Yeh (ي, ى) to Persian ی", () => {
    assert.equal(normalizeSearchTerm("ساختمانی يزد"), "ساختمانی یزد");
    assert.equal(normalizeSearchTerm("کاشى"), "کاشی");
  });

  it("converts Arabic Kaf (ك) to Persian ک", () => {
    assert.equal(normalizeSearchTerm("سنگ گرانيت كوهستان"), "سنگ گرانیت کوهستان");
    assert.equal(normalizeSearchTerm("بلوك"), "بلوک");
  });

  it("normalizes ZWNJ (\u200c) to space", () => {
    assert.equal(normalizeSearchTerm("سنگ\u200cکاری"), "سنگ کاری");
    assert.equal(normalizeSearchTerm("بوک\u200cمچ"), "بوک مچ");
  });

  it("converts Persian digits (۰-۹) to ASCII 0-9", () => {
    assert.equal(normalizeSearchTerm("پروژه ۱۴۰۴"), "پروژه 1404");
    assert.equal(normalizeSearchTerm("متراژ ۱۲۵۰"), "متراژ 1250");
  });

  it("converts Arabic digits (٠-٩) to ASCII 0-9", () => {
    assert.equal(normalizeSearchTerm("رقم ٠١٢٣٤٥٦٧٨٩"), "رقم 0123456789");
  });

  it("normalizes Alef variants (آ, أ, إ, ٱ) to plain Alef (ا)", () => {
    assert.equal(normalizeSearchTerm("آرمان آتشکوه"), "ارمان اتشکوه");
    assert.equal(normalizeSearchTerm("إصفهان أهواز"), "اصفهان اهواز");
  });

  it("strips Persian and Arabic diacritics (harakat / tashkeel / tanween)", () => {
    assert.equal(normalizeSearchTerm("تَراوِرتَنِ سِيلوِر"), "تراورتن سیلور");
    assert.equal(normalizeSearchTerm("مَرمَرٌ خَالِصٌ"), "مرمر خالص");
  });

  it("handles null, undefined, empty, and whitespace strings safely", () => {
    assert.equal(normalizeSearchTerm(null), "");
    assert.equal(normalizeSearchTerm(undefined), "");
    assert.equal(normalizeSearchTerm("   "), "");
    assert.equal(normalizeSearchTerm("  مرمر   سفید  "), "مرمر سفید");
  });

  it("matches needle in haystack bidirectionally with normalization", () => {
    // Needle has Arabic Yeh & Kaf, haystack has Persian
    assert.ok(matchesSearchQuery("سنگ کاری لابی", "سنگ\u200cكاری"));
    // Needle has Persian digits, haystack has ASCII or vice versa
    assert.ok(matchesSearchQuery("سال اجرا ۱۴۰۴", "1404"));
    assert.ok(matchesSearchQuery("سال اجرا 1404", "۱۴۰۴"));
    // Multi-token search in any order
    assert.ok(matchesSearchQuery("اسلب بوک‌مچ مرمر پرشین سیلک", "مرمر سیلک"));
    assert.ok(!matchesSearchQuery("اسلب بوک‌مچ مرمر پرشین سیلک", "گرانیت"));

    // User types without Alef-Madda (ارمان vs آرمان, اتشکوه vs آتشکوه)
    assert.ok(matchesSearchQuery("برج اداری آرمان", "ارمان"));
    assert.ok(matchesSearchQuery("تراورتن سوپر عباس‌آباد", "عباس اباد"));
    assert.ok(matchesSearchQuery("معدن آتشکوه محلات", "اتشکوه"));
    assert.ok(matchesSearchQuery("اسلب مرمر آنیکس", "انیکس"));

    // User types compound word without ZWNJ or space (بوکمچ vs بوک‌مچ, سنگکاری vs سنگ‌کاری)
    assert.ok(matchesSearchQuery("اسلب بوک‌مچ کریستال", "بوکمچ"));
    assert.ok(matchesSearchQuery("اسلب بوکمچ کریستال", "بوک‌مچ"));
    assert.ok(matchesSearchQuery("سنگ‌کاری نمای بیرونی", "سنگکاری"));

    // User types with diacritics / tashkeel
    assert.ok(matchesSearchQuery("سنگ تراورتن سیلور", "تَراوِرتَن"));
  });
});

describe("Projects Feature & Data Integrity (/projects)", () => {
  it("testProjects contains authentic records with required fields", () => {
    assert.ok(testProjects.length >= 6, "Must have at least 6 projects");

    const idSet = new Set<string>();
    const slugSet = new Set<string>();

    for (const project of testProjects) {
      assert.ok(project.id, "Project must have an id");
      assert.ok(!idSet.has(project.id), `Duplicate project id: ${project.id}`);
      idSet.add(project.id);

      assert.ok(project.slug, "Project must have a slug");
      assert.ok(!slugSet.has(project.slug), `Duplicate project slug: ${project.slug}`);
      slugSet.add(project.slug);

      assert.ok(project.title, `Project ${project.id} must have a title`);
      assert.ok(project.image, `Project ${project.id} must have an image`);
      assert.ok(project.publishedAt, `Project ${project.id} must have publishedAt`);
      assert.ok(project.category, `Project ${project.id} must have category`);
      assert.ok(project.stoneType, `Project ${project.id} must have stoneType`);
      assert.ok(project.location, `Project ${project.id} must have location`);
      assert.ok(project.city, `Project ${project.id} must have city`);
      assert.ok(project.year, `Project ${project.id} must have year`);
      assert.ok(project.area, `Project ${project.id} must have area`);
      assert.ok(project.client, `Project ${project.id} must have client`);
      assert.ok(project.description, `Project ${project.id} must have description`);
    }
  });

  it("maintains compatibility with all existing showcase URLs", () => {
    const requiredSlugs = [
      "commercial-tower-arman",
      "residential-mahtab-lobby",
      "hotel-cyrus-floor",
      "zarrin-onyx-wall",
      "damavand-villa-pool",
      "shiraz-university-steps",
    ];

    for (const slug of requiredSlugs) {
      const found = getProjectBySlug(slug);
      assert.ok(found, `Expected project with slug '${slug}' to be present`);
      assert.equal(found.slug, slug);
    }
  });

  it("calculates project dataset statistics accurately", () => {
    const stats = calculateProjectStats(testProjects);
    assert.equal(stats.totalProjects, testProjects.length);
    assert.ok(stats.cities >= 3, "Should cover at least 3 cities");
    assert.ok(stats.stoneTypes >= 3, "Should cover at least 3 stone types");
  });

  it("filters projects by category", () => {
    const facadeProjects = filterProjects(testProjects, {
      query: "",
      category: "facade",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(facadeProjects.length > 0);
    assert.ok(facadeProjects.every((p) => p.category === "facade"));

    const lobbyProjects = filterProjects(testProjects, {
      query: "",
      category: "lobby",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(lobbyProjects.length > 0);
    assert.ok(lobbyProjects.every((p) => p.category === "lobby"));
  });

  it("filters projects by stone category", () => {
    const travertineProjects = filterProjects(testProjects, {
      query: "",
      category: "all",
      stoneCategory: "travertine",
      city: "all",
    });
    assert.ok(travertineProjects.length > 0);
    assert.ok(travertineProjects.every((p) => p.stoneCategory === "travertine"));

    const onyxProjects = filterProjects(testProjects, {
      query: "",
      category: "all",
      stoneCategory: "onyx",
      city: "all",
    });
    assert.ok(onyxProjects.length > 0);
    assert.ok(onyxProjects.every((p) => p.stoneCategory === "onyx"));
  });

  it("filters projects by city", () => {
    const tehranProjects = filterProjects(testProjects, {
      query: "",
      category: "all",
      stoneCategory: "all",
      city: "تهران",
    });
    assert.ok(tehranProjects.length > 0);
    assert.ok(tehranProjects.every((p) => p.city === "تهران"));
  });

  it("searches projects with Persian query normalization", () => {
    // Search with Arabic Yeh
    const resultsArabicYeh = filterProjects(testProjects, {
      query: "آرمان",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(resultsArabicYeh.length >= 1);
    assert.ok(resultsArabicYeh.some((p) => p.slug === "commercial-tower-arman"));

    // Search without Madda (plain Alef: 'ارمان')
    const resultsPlainAlef = filterProjects(testProjects, {
      query: "ارمان",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(resultsPlainAlef.length >= 1);
    assert.ok(resultsPlainAlef.some((p) => p.slug === "commercial-tower-arman"));

    // Search with ZWNJ
    const resultsZwnj = filterProjects(testProjects, {
      query: "سنگ\u200cکاری",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(resultsZwnj.length >= 1);

    // Search compound word without ZWNJ/space (بوکمچ vs بوک‌مچ)
    const resultsBookmatch = filterProjects(testProjects, {
      query: "بوکمچ",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(resultsBookmatch.length >= 1);

    // Search multi-token 'عباس اباد'
    const resultsAbbasAbad = filterProjects(testProjects, {
      query: "عباس اباد",
      category: "all",
      stoneCategory: "all",
      city: "all",
    });
    assert.ok(resultsAbbasAbad.length >= 1);
  });

  it("PROJECT_STONE_CATEGORIES includes all valid stone category keys", () => {
    const keys = PROJECT_STONE_CATEGORIES.map((c) => c.key);
    assert.ok(keys.includes("all"));
    assert.ok(keys.includes("travertine"));
    assert.ok(keys.includes("marble"));
    assert.ok(keys.includes("granite"));
    assert.ok(keys.includes("onyx"));
    assert.ok(keys.includes("limestone"));
    assert.ok(keys.includes("sandstone"));
  });

  it("retrieves related projects without including the current project", () => {
    const targetSlug = "commercial-tower-arman";
    const related = getRelatedProjects(targetSlug, 3);
    assert.ok(related.length <= 3);
    assert.ok(related.every((p) => p.slug !== targetSlug));
  });

  it("returns undefined for non-existent project slug", () => {
    assert.equal(getProjectBySlug("non-existent-project-xyz"), undefined);
  });
});

describe("Learn & Knowledge Base Feature (/learn)", () => {
  it("testArticles contains rich educational articles", () => {
    assert.ok(testArticles.length >= 5, "Must have at least 5 educational articles");

    const idSet = new Set<string>();
    const slugSet = new Set<string>();

    for (const article of testArticles) {
      assert.ok(article.id, "Article must have an id");
      assert.ok(!idSet.has(article.id), `Duplicate article id: ${article.id}`);
      idSet.add(article.id);

      assert.ok(article.slug, "Article must have a slug");
      assert.ok(!slugSet.has(article.slug), `Duplicate article slug: ${article.slug}`);
      slugSet.add(article.slug);

      assert.ok(article.title, `Article ${article.id} must have a title`);
      assert.ok(article.excerpt, `Article ${article.id} must have an excerpt`);
      assert.ok(article.coverImage, `Article ${article.id} must have coverImage`);
      assert.ok(article.publishedAt, `Article ${article.id} must have publishedAt`);
      assert.ok(article.readTimeMinutes > 0, `Article ${article.id} readTime must be > 0`);
      assert.ok(article.author.name, `Article ${article.id} must have author name`);
      assert.ok(article.tags.length > 0, `Article ${article.id} must have tags`);
      assert.ok(article.keyTakeaways.length > 0, `Article ${article.id} must have key takeaways`);
      assert.ok(article.sections.length > 0, `Article ${article.id} must have sections`);
    }
  });

  it("identifies a featured article", () => {
    const featured = getFeaturedArticle(testArticles);
    assert.ok(featured, "Must find a featured or default article");
    assert.ok(featured.title.length > 0);
  });

  it("filters articles by category", () => {
    const buyingGuides = filterArticles(testArticles, {
      query: "",
      category: "buying-guide",
      difficulty: "all",
      sortBy: "newest",
    });
    assert.ok(buyingGuides.length > 0);
    assert.ok(buyingGuides.every((a) => a.category === "buying-guide"));
  });

  it("filters articles by difficulty level", () => {
    const advancedArticles = filterArticles(testArticles, {
      query: "",
      category: "all",
      difficulty: "advanced",
      sortBy: "newest",
    });
    assert.ok(advancedArticles.length > 0);
    assert.ok(advancedArticles.every((a) => a.difficultyKey === "advanced"));
  });

  it("sorts articles by read time", () => {
    const asc = filterArticles(testArticles, {
      query: "",
      category: "all",
      difficulty: "all",
      sortBy: "read-time-asc",
    });
    for (let i = 0; i < asc.length - 1; i++) {
      assert.ok(asc[i].readTimeMinutes <= asc[i + 1].readTimeMinutes);
    }

    const desc = filterArticles(testArticles, {
      query: "",
      category: "all",
      difficulty: "all",
      sortBy: "read-time-desc",
    });
    for (let i = 0; i < desc.length - 1; i++) {
      assert.ok(desc[i].readTimeMinutes >= desc[i + 1].readTimeMinutes);
    }
  });

  it("searches articles with normalized Persian queries", () => {
    const results = filterArticles(testArticles, {
      query: "بوك\u200cمچ", // Arabic Kaf + ZWNJ
      category: "all",
      difficulty: "all",
      sortBy: "newest",
    });
    assert.ok(results.length >= 1);
    assert.ok(results.some((a) => a.slug === "slab-bookmatch-fourmatch-guide"));
  });

  it("retrieves article by slug and handles unknown slugs gracefully", () => {
    const article = getArticleBySlug("facade-stone-selection-guide");
    assert.ok(article);
    assert.equal(article.slug, "facade-stone-selection-guide");

    assert.equal(getArticleBySlug("unknown-article-slug-404"), undefined);
  });

  it("retrieves related articles prioritizing explicit relatedArticleSlugs and same category", () => {
    const targetSlug = "facade-stone-selection-guide";
    const related = getRelatedArticles(targetSlug, 3);
    assert.equal(related.length, 3);
    assert.ok(related.every((a) => a.slug !== targetSlug));

    const relatedSlugs = related.map((a) => a.slug);
    // Should prioritize explicitly designated related articles
    assert.ok(
      relatedSlugs.includes("iranian-travertine-quarries-comparison"),
      "Explicitly related travertine comparison guide should be in top related"
    );
    assert.ok(
      relatedSlugs.includes("dry-system-stone-facade-standards"),
      "Explicitly related dry facade standards guide should be in top related"
    );
  });
});
