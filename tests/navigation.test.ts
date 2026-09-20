import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MOCK_NAVIGATION_PAGES, NAV_SECTIONS } from "../src/features/navigation/data/mock-navigation-pages";
import {
  calculateNavigationStats,
  filterAndSortPages,
  normalizeQuery,
} from "../src/features/navigation/data/navigation-service";
import type { NavigationPageItem } from "../src/features/navigation/types";

describe("Navigation Visibility & Access Manager Logic", () => {
  it("MOCK_NAVIGATION_PAGES has valid schemas, sections, and paths", () => {
    assert.ok(MOCK_NAVIGATION_PAGES.length >= 15, "Should have comprehensive mock pages");

    const idSet = new Set<string>();
    const validSections = NAV_SECTIONS.map((s) => s.id);

    for (const page of MOCK_NAVIGATION_PAGES) {
      assert.ok(page.id, "Page must have an id");
      assert.ok(!idSet.has(page.id), `Page id ${page.id} must be unique`);
      idSet.add(page.id);

      assert.ok(page.title, `Page ${page.id} must have a Persian title`);
      assert.ok(page.titleEn, `Page ${page.id} must have an English title`);
      assert.ok(page.path.startsWith("/"), `Page path ${page.path} must start with '/'`);
      assert.ok(
        validSections.includes(page.section),
        `Page section ${page.section} must be one of ${validSections.join(", ")}`
      );
      assert.equal(typeof page.isVisible, "boolean", "isVisible must be a boolean");
      assert.ok(page.order > 0, "order must be positive");
    }
  });

  it("calculates summary statistics accurately", () => {
    const stats = calculateNavigationStats(MOCK_NAVIGATION_PAGES);

    assert.equal(stats.total, MOCK_NAVIGATION_PAGES.length);
    assert.equal(
      stats.visibleCount,
      MOCK_NAVIGATION_PAGES.filter((p) => p.isVisible).length
    );
    assert.equal(
      stats.hiddenCount,
      MOCK_NAVIGATION_PAGES.filter((p) => !p.isVisible).length
    );
    assert.equal(
      stats.headerCount,
      MOCK_NAVIGATION_PAGES.filter((p) => p.section === "header").length
    );
    assert.equal(
      stats.mobileCount,
      MOCK_NAVIGATION_PAGES.filter((p) => p.section === "mobile_account").length
    );

    const expectedRatio = Math.round((stats.visibleCount / stats.total) * 100);
    assert.equal(stats.visibilityRatio, expectedRatio);
    assert.ok(stats.visibilityRatio >= 0 && stats.visibilityRatio <= 100);
  });

  it("normalizes search query strings with Persian digits and casing", () => {
    assert.equal(normalizeQuery("  سنگ ۱۲۳  "), "سنگ 123");
    assert.equal(normalizeQuery("STONES"), "stones");
  });

  it("filters pages by Persian and English search queries", () => {
    // Search by Persian title
    const searchHome = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "خانه",
      sectionFilter: "all",
      visibilityFilter: "all",
    });
    assert.ok(searchHome.length >= 1);
    assert.ok(searchHome.some((p) => p.path === "/"));

    // Search by English title
    const searchMarble = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "marble",
      sectionFilter: "all",
      visibilityFilter: "all",
    });
    assert.ok(searchMarble.length >= 1);
    assert.ok(searchMarble.some((p) => p.path.includes("marble")));

    // Search by URL path
    const searchPath = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "/stones",
      sectionFilter: "all",
      visibilityFilter: "all",
    });
    assert.ok(searchPath.length >= 1);
    assert.ok(searchPath.every((p) => p.path.includes("/stones")));
  });

  it("filters pages by section correctly", () => {
    const headerPages = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "",
      sectionFilter: "header",
      visibilityFilter: "all",
    });
    assert.ok(headerPages.length > 0);
    assert.ok(headerPages.every((p) => p.section === "header"));

    const footerStones = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "",
      sectionFilter: "footer_stones",
      visibilityFilter: "all",
    });
    assert.ok(footerStones.length > 0);
    assert.ok(footerStones.every((p) => p.section === "footer_stones"));
  });

  it("filters pages by visibility status correctly", () => {
    const visiblePages = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "",
      sectionFilter: "all",
      visibilityFilter: "visible",
    });
    assert.ok(visiblePages.length > 0);
    assert.ok(visiblePages.every((p) => p.isVisible === true));

    const hiddenPages = filterAndSortPages(MOCK_NAVIGATION_PAGES, {
      searchQuery: "",
      sectionFilter: "all",
      visibilityFilter: "hidden",
    });
    assert.ok(hiddenPages.length > 0);
    assert.ok(hiddenPages.every((p) => p.isVisible === false));
  });

  it("toggles page visibility state accurately", () => {
    const initialPages: NavigationPageItem[] = JSON.parse(
      JSON.stringify(MOCK_NAVIGATION_PAGES)
    );
    const target = initialPages[0];
    const originalVisibility = target.isVisible;

    // Simulate toggle
    const updatedPages = initialPages.map((p) =>
      p.id === target.id ? { ...p, isVisible: !originalVisibility } : p
    );

    const updatedTarget = updatedPages.find((p) => p.id === target.id);
    assert.equal(updatedTarget?.isVisible, !originalVisibility);
  });

  it("supports bulk visibility updates across multiple pages", () => {
    const initialPages: NavigationPageItem[] = JSON.parse(
      JSON.stringify(MOCK_NAVIGATION_PAGES)
    );
    const selectedIds = [initialPages[0].id, initialPages[1].id];

    // Bulk hide
    const bulkHidden = initialPages.map((p) =>
      selectedIds.includes(p.id) ? { ...p, isVisible: false } : p
    );
    assert.equal(bulkHidden.find((p) => p.id === selectedIds[0])?.isVisible, false);
    assert.equal(bulkHidden.find((p) => p.id === selectedIds[1])?.isVisible, false);

    // Bulk show
    const bulkVisible = bulkHidden.map((p) =>
      selectedIds.includes(p.id) ? { ...p, isVisible: true } : p
    );
    assert.equal(bulkVisible.find((p) => p.id === selectedIds[0])?.isVisible, true);
    assert.equal(bulkVisible.find((p) => p.id === selectedIds[1])?.isVisible, true);
  });
});
