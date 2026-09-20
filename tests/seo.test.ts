import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MOCK_PAGE_SEO_ITEMS,
  DEFAULT_GLOBAL_SEO_SETTINGS,
  MOCK_SEO_AUDIT_ITEMS,
} from "../src/features/seo/data/mock-seo-data";
import {
  calculateSeoStats,
  filterAndSortPages,
  generateSitemapXml,
} from "../src/features/seo/data/seo-service";
import { useSeoStore } from "../src/features/seo/stores/seo-store";

describe("SEO & SERP Management Feature Test Suite", () => {
  it("MOCK_PAGE_SEO_ITEMS has valid schemas, routes, and metadata", () => {
    assert.ok(MOCK_PAGE_SEO_ITEMS.length >= 10, "Should have rich dataset of stone pages");

    const idSet = new Set<string>();
    const validCategories = ["main", "stones", "collections", "showrooms", "static", "system"];
    const validDirectives = ["index, follow", "noindex, follow", "noindex, nofollow", "index, nofollow"];
    const validSchemaTypes = [
      "WebPage",
      "CollectionPage",
      "Product",
      "Organization",
      "LocalBusiness",
      "AboutPage",
      "ContactPage",
      "ItemPage",
    ];

    for (const page of MOCK_PAGE_SEO_ITEMS) {
      assert.ok(page.id, "Page must have an id");
      assert.ok(!idSet.has(page.id), `Page id ${page.id} must be unique`);
      idSet.add(page.id);

      assert.ok(page.pageName, `Page ${page.id} must have a Persian name`);
      assert.ok(page.pageNameEn, `Page ${page.id} must have an English name`);
      assert.ok(page.slug.startsWith("/"), `Page slug ${page.slug} must start with '/'`);
      assert.ok(
        validCategories.includes(page.category),
        `Category ${page.category} must be valid`
      );
      assert.ok(page.title.length > 0, "Title cannot be empty");
      assert.ok(page.metaDescription.length > 0, "Meta description cannot be empty");
      assert.ok(Array.isArray(page.keywords), "Keywords must be an array");
      assert.ok(
        page.canonicalUrl.startsWith("https://"),
        `Canonical URL ${page.canonicalUrl} must be https`
      );
      assert.ok(
        validDirectives.includes(page.robotsDirective),
        `Robots directive ${page.robotsDirective} must be valid`
      );
      assert.ok(
        validSchemaTypes.includes(page.schemaType),
        `Schema type ${page.schemaType} must be valid`
      );
      assert.ok(page.priority >= 0 && page.priority <= 1.0, "Priority must be between 0 and 1");
      assert.ok(page.healthScore >= 0 && page.healthScore <= 100, "Health score must be 0-100");
    }
  });

  it("calculates SEO summary statistics accurately", () => {
    const stats = calculateSeoStats(MOCK_PAGE_SEO_ITEMS);

    assert.equal(stats.totalPagesCount, MOCK_PAGE_SEO_ITEMS.length);
    const expectedIndexed = MOCK_PAGE_SEO_ITEMS.filter((p) => p.isIndexed).length;
    assert.equal(stats.totalIndexedPages, expectedIndexed);

    assert.ok(stats.overallHealthScore >= 80 && stats.overallHealthScore <= 100);
    assert.ok(stats.schemaCoveragePercentage >= 80);
    assert.ok(stats.socialGraphReadyPercentage >= 80);
    assert.equal(stats.sitemapUrlsCount, expectedIndexed);
  });

  it("filters pages by search query correctly", () => {
    // Search by Persian stone name
    const travertineResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "عباس‌آباد",
      "all",
      "all",
      "health"
    );
    assert.ok(travertineResults.length >= 1);
    assert.ok(travertineResults.some((p) => p.slug.includes("travertine")));

    // Search by English slug
    const graniteResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "granite",
      "all",
      "all",
      "health"
    );
    assert.ok(graniteResults.length >= 1);
    assert.ok(graniteResults.some((p) => p.slug.includes("natanz")));

    // Search by keyword
    const inquiryResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "استعلام",
      "all",
      "all",
      "health"
    );
    assert.ok(inquiryResults.length >= 1);
    assert.ok(inquiryResults.some((p) => p.slug === "/inquiries"));
  });

  it("filters pages by category and indexing status", () => {
    const stonesOnly = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "",
      "stones",
      "all",
      "health"
    );
    assert.ok(stonesOnly.length >= 4);
    for (const page of stonesOnly) {
      assert.equal(page.category, "stones");
    }

    const noIndexOnly = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "",
      "all",
      "noindex",
      "health"
    );
    assert.ok(noIndexOnly.length >= 2);
    for (const page of noIndexOnly) {
      assert.equal(page.isIndexed, false);
    }
  });

  it("sorts pages correctly by health score and priority", () => {
    const sortedByHealth = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "",
      "all",
      "all",
      "health"
    );
    for (let i = 0; i < sortedByHealth.length - 1; i++) {
      assert.ok(
        sortedByHealth[i].healthScore >= sortedByHealth[i + 1].healthScore,
        "Should sort descending by health score"
      );
    }

    const sortedByPriority = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "",
      "all",
      "all",
      "priority"
    );
    for (let i = 0; i < sortedByPriority.length - 1; i++) {
      assert.ok(
        sortedByPriority[i].priority >= sortedByPriority[i + 1].priority,
        "Should sort descending by priority"
      );
    }
  });

  it("generates a compliant sitemap.xml with indexed pages", () => {
    const xml = generateSitemapXml(MOCK_PAGE_SEO_ITEMS, "https://alborzstone.ir");

    assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
    assert.ok(xml.includes("<loc>https://alborzstone.ir/</loc>"));
    assert.ok(xml.includes("<loc>https://alborzstone.ir/stones</loc>"));
    assert.ok(xml.includes("<priority>1.00</priority>"));

    // Excluded pages should not be present in sitemap
    assert.ok(!xml.includes("https://alborzstone.ir/account"));
    assert.ok(!xml.includes("https://alborzstone.ir/checkout"));
  });

  it("normalizes Persian/Arabic text, ZWNJ, and digits in search filtering", () => {
    // 1. ZWNJ variation: "عباس اباد" vs "عباس‌آباد"
    const zwnjResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "عباس اباد",
      "all",
      "all",
      "health"
    );
    assert.ok(
      zwnjResults.length >= 1,
      "Should match page despite missing ZWNJ (نیم‌فاصله)"
    );
    assert.ok(zwnjResults.some((p) => p.slug.includes("abbas-abad")));

    // 2. Arabic Yeh and Kaf: "سنگبري" vs "سنگبری"
    const arabicResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "سنگبري",
      "all",
      "all",
      "health"
    );
    assert.ok(
      arabicResults.length >= 1,
      "Should match despite Arabic Yeh/Kaf characters"
    );

    // 3. Persian/Arabic digits: "۲" vs "2"
    const digitResults = filterAndSortPages(
      MOCK_PAGE_SEO_ITEMS,
      "۲",
      "all",
      "all",
      "health"
    );
    assert.ok(digitResults.length >= 1);
  });

  it("escapes special XML characters and includes image metadata in sitemap.xml", () => {
    const specialPages = [
      {
        ...MOCK_PAGE_SEO_ITEMS[0],
        id: "special-1",
        slug: "/stones/test?param1=foo&param2=bar",
        title: "سنگ اسلب <گرانیت> & 'تراورتن' \"ممتاز\"",
        openGraph: {
          imageUrl: "https://alborzstone.ir/images/slab.jpg?w=1200&q=80",
          type: "product" as const,
        },
        isIndexed: true,
      },
    ];

    const xml = generateSitemapXml(specialPages, "https://alborzstone.ir");
    // Ensure raw & is escaped to &amp;
    assert.ok(!xml.includes("param1=foo&param2=bar"));
    assert.ok(xml.includes("param1=foo&amp;param2=bar"));
    assert.ok(xml.includes("&lt;گرانیت&gt;"));
    assert.ok(xml.includes("&amp;"));
    assert.ok(xml.includes("<image:image>"));
    assert.ok(xml.includes("<image:loc>https://alborzstone.ir/images/slab.jpg?w=1200&amp;q=80</image:loc>"));
  });

  it("manages state, draft changes, and indexing toggles in useSeoStore", () => {
    const store = useSeoStore.getState();

    // Reset to defaults
    store.resetToDefaults();
    const initialPages = useSeoStore.getState().pages;
    const firstPage = initialPages[0];

    // Toggle indexing
    store.togglePageIndexing(firstPage.id);
    const updatedFirstPage = useSeoStore.getState().pages.find((p) => p.id === firstPage.id);
    assert.equal(updatedFirstPage?.isIndexed, false);
    assert.equal(updatedFirstPage?.robotsDirective, "noindex, nofollow");

    // Toggle back
    store.togglePageIndexing(firstPage.id);
    const restoredFirstPage = useSeoStore.getState().pages.find((p) => p.id === firstPage.id);
    assert.equal(restoredFirstPage?.isIndexed, true);
    assert.equal(restoredFirstPage?.robotsDirective, "index, follow");

    // Test editing draft with health recalculation
    store.openEditDialog(firstPage);
    // Set a very short title and empty description
    store.updateEditingDraft({
      title: "کوتاه",
      metaDescription: "",
      keywords: [],
    });
    const draft = useSeoStore.getState().editingPage;
    assert.ok(draft);
    assert.ok(draft.healthScore < 60, "Health score should drop significantly for poor metadata");
    assert.ok(draft.healthIssues.length >= 2, "Should record health issues");

    // Close dialog
    store.closeEditDialog();
    assert.equal(useSeoStore.getState().editingPage, null);

    // Reset back
    store.resetToDefaults();
  });

  it("guarantees deep state isolation and snapshot rollback on discardChanges", async () => {
    const store = useSeoStore.getState();
    store.resetToDefaults();

    assert.equal(store.hasUnsavedChanges(), false);

    // Modify a nested property
    store.updateGlobalSettings({
      defaultKeywords: [...store.globalSettings.defaultKeywords, "کلیدواژه آزمایشی"],
    });
    assert.equal(store.hasUnsavedChanges(), true);

    // Discard
    store.discardChanges();
    assert.equal(store.hasUnsavedChanges(), false);
    assert.ok(
      !useSeoStore.getState().globalSettings.defaultKeywords.includes("کلیدواژه آزمایشی"),
      "Discarded keyword should be gone"
    );

    // Toggle indexing on a page
    const firstPage = store.pages[0];
    store.togglePageIndexing(firstPage.id);
    assert.equal(useSeoStore.getState().hasUnsavedChanges(), true);

    // Save
    await store.saveAllChanges();
    assert.equal(useSeoStore.getState().hasUnsavedChanges(), false);
  });
});

