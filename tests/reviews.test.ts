import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { MOCK_REVIEWS } from "../src/features/reviews/data/mock-reviews-data";
import { reviewsService } from "../src/features/reviews/data/reviews-service";
import { useReviewsStore } from "../src/features/reviews/stores/reviews-store";

describe("Customer Reviews Management Logic & Store", () => {
  beforeEach(() => {
    useReviewsStore.getState().resetToMock();
  });

  it("MOCK_REVIEWS contains valid mock data matching requirements", () => {
    assert.ok(MOCK_REVIEWS.length >= 8, "Should have at least 8 mock reviews");

    for (const review of MOCK_REVIEWS) {
      assert.ok(review.id, "Every review must have an id");
      assert.ok(review.customerName, "Every review must have customerName");
      assert.ok(review.productId, "Every review must have productId");
      assert.ok(review.productTitle, "Every review must have productTitle");
      assert.ok(review.comment, "Every review must have comment text");
      assert.ok(
        review.rating >= 1 && review.rating <= 5,
        `Rating ${review.rating} must be between 1 and 5`
      );
      assert.ok(
        ["PENDING", "APPROVED", "REJECTED"].includes(review.status),
        `Status ${review.status} must be valid`
      );
      assert.ok(
        typeof review.createdAtIso === "string" && review.createdAtIso.length > 0,
        "Every review must have a valid createdAtIso string for sorting"
      );
    }
  });

  it("calculates summary metrics accurately", () => {
    const stats = reviewsService.calculateStats(MOCK_REVIEWS);

    assert.equal(stats.total, MOCK_REVIEWS.length);
    assert.equal(
      stats.pending,
      MOCK_REVIEWS.filter((r) => r.status === "PENDING").length
    );
    assert.equal(
      stats.approved,
      MOCK_REVIEWS.filter((r) => r.status === "APPROVED").length
    );
    assert.equal(
      stats.rejected,
      MOCK_REVIEWS.filter((r) => r.status === "REJECTED").length
    );
    assert.ok(stats.averageRating > 0 && stats.averageRating <= 5);
  });

  it("filters reviews by status correctly", () => {
    const pendingReviews = MOCK_REVIEWS.filter((r) => r.status === "PENDING");
    const approvedReviews = MOCK_REVIEWS.filter((r) => r.status === "APPROVED");
    const rejectedReviews = MOCK_REVIEWS.filter((r) => r.status === "REJECTED");

    assert.ok(pendingReviews.length > 0, "Should have pending reviews");
    assert.ok(approvedReviews.length > 0, "Should have approved reviews");
    assert.ok(rejectedReviews.length > 0, "Should have rejected reviews");

    assert.ok(pendingReviews.every((r) => r.status === "PENDING"));
    assert.ok(approvedReviews.every((r) => r.status === "APPROVED"));
    assert.ok(rejectedReviews.every((r) => r.status === "REJECTED"));
  });

  it("searches reviews with Persian and English digits across customer, product, comment, phone, and reply", () => {
    const normalizeSearch = (s: string) =>
      s
        .toLowerCase()
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

    // Customer name search
    const qName = "شفیعی";
    assert.ok(
      MOCK_REVIEWS.some((r) => normalizeSearch(r.customerName).includes(qName))
    );

    // Stone product search
    const qProd = "مرمر";
    assert.ok(
      MOCK_REVIEWS.some((r) => normalizeSearch(r.productTitle).includes(qProd))
    );

    // Product ID search
    const qId = "prod-onx-01";
    assert.ok(
      MOCK_REVIEWS.some((r) => normalizeSearch(r.productId).includes(qId))
    );

    // Persian vs English digit phone search
    const qPhoneEn = "09121110023";
    const qPhoneFa = "۰۹۱۲۱۱۱۰۰۲۳";
    const matchPhone = MOCK_REVIEWS.filter((r) => {
      const p = r.customerPhone ? normalizeSearch(r.customerPhone) : "";
      return p.includes(normalizeSearch(qPhoneEn)) || p.includes(normalizeSearch(qPhoneFa));
    });
    assert.ok(matchPhone.length > 0);
    assert.equal(matchPhone[0].id, "rev-102");

    // Reply text search
    const qReply = "مهندس شفیعی عزیز";
    const matchReply = MOCK_REVIEWS.filter((r) =>
      r.reply?.comment ? normalizeSearch(r.reply.comment).includes(qReply) : false
    );
    assert.ok(matchReply.length > 0);
  });

  it("sorts reviews correctly (oldest, newest, rating_high, rating_low)", () => {
    const list = [...MOCK_REVIEWS];

    // Rating high
    const sortedRatingHigh = [...list].sort((a, b) => b.rating - a.rating);
    assert.ok(sortedRatingHigh[0].rating >= sortedRatingHigh[sortedRatingHigh.length - 1].rating);
    assert.equal(sortedRatingHigh[0].rating, 5);

    // Rating low
    const sortedRatingLow = [...list].sort((a, b) => a.rating - b.rating);
    assert.ok(sortedRatingLow[0].rating <= sortedRatingLow[sortedRatingLow.length - 1].rating);
    assert.equal(sortedRatingLow[0].rating, 1);

    // Oldest first
    const sortedOldest = [...list].sort(
      (a, b) =>
        (a.createdAtIso || "").localeCompare(b.createdAtIso || "") ||
        a.id.localeCompare(b.id)
    );
    assert.equal(sortedOldest[0].id, "rev-110"); // September 10 (oldest)
    assert.equal(sortedOldest[sortedOldest.length - 1].id, "rev-101"); // September 19 (newest)

    // Newest first
    const sortedNewest = [...list].sort(
      (a, b) =>
        (b.createdAtIso || "").localeCompare(a.createdAtIso || "") ||
        b.id.localeCompare(a.id)
    );
    assert.equal(sortedNewest[0].id, "rev-101"); // September 19 (newest)
    assert.equal(sortedNewest[sortedNewest.length - 1].id, "rev-110"); // September 10 (oldest)
  });

  it("REAL useReviewsStore moderation: approves review and clears rejectionReason", () => {
    const store = useReviewsStore.getState();
    const target = store.reviews.find((r) => r.status === "PENDING");
    assert.ok(target, "Must have a pending review");

    store.approveReview(target.id);

    const updated = useReviewsStore.getState().reviews.find((r) => r.id === target.id);
    assert.equal(updated?.status, "APPROVED");
    assert.equal(updated?.rejectionReason, undefined);
  });

  it("REAL useReviewsStore moderation: rejects review with reason", () => {
    const store = useReviewsStore.getState();
    const target = store.reviews.find((r) => r.status === "PENDING");
    assert.ok(target, "Must have a pending review");

    const reason = "عدم تطابق با استانداردهای کارخانه";
    store.rejectReview(target.id, reason);

    const updated = useReviewsStore.getState().reviews.find((r) => r.id === target.id);
    assert.equal(updated?.status, "REJECTED");
    assert.equal(updated?.rejectionReason, reason);
    assert.equal(useReviewsStore.getState().isRejectOpen, false);
  });

  it("REAL useReviewsStore moderation: submits managerial reply", () => {
    const store = useReviewsStore.getState();
    const target = store.reviews[0];

    const comment = "پاسخ رسمی مدیریت کارخانه سنگ به پروژه شما";
    store.submitReply(target.id, comment, "واحد فنی", "مدیر تضمین کیفیت");

    const updated = useReviewsStore.getState().reviews.find((r) => r.id === target.id);
    assert.ok(updated?.reply);
    assert.equal(updated?.reply?.author, "واحد فنی");
    assert.equal(updated?.reply?.authorRole, "مدیر تضمین کیفیت");
    assert.equal(updated?.reply?.comment, comment);
    assert.equal(useReviewsStore.getState().isReplyOpen, false);
  });

  it("REAL useReviewsStore moderation: deletes item and clamps pagination safely", () => {
    const store = useReviewsStore.getState();
    store.setItemsPerPage(5);
    store.setCurrentPage(2);
    assert.equal(useReviewsStore.getState().currentPage, 2);

    const initialLength = store.reviews.length;
    const itemToDelete = store.reviews[0];

    // Open detail dialog on item
    store.openDetailDialog(itemToDelete);
    assert.equal(useReviewsStore.getState().isDetailOpen, true);
    assert.equal(useReviewsStore.getState().detailReview?.id, itemToDelete.id);

    // Delete item
    store.deleteReviewItem(itemToDelete.id);

    const stateAfter = useReviewsStore.getState();
    assert.equal(stateAfter.reviews.length, initialLength - 1);
    assert.equal(stateAfter.reviews.find((r) => r.id === itemToDelete.id), undefined);
    // Detail modal should be cleanly closed, avoiding orphaned modal state
    assert.equal(stateAfter.isDetailOpen, false);
    assert.equal(stateAfter.detailReview, null);
    assert.equal(stateAfter.isDeleteOpen, false);
  });

  it("REAL useReviewsStore: resetToMock restores default state", () => {
    const store = useReviewsStore.getState();
    store.deleteReviewItem(store.reviews[0].id);
    assert.equal(useReviewsStore.getState().reviews.length, MOCK_REVIEWS.length - 1);

    store.resetToMock();
    assert.equal(useReviewsStore.getState().reviews.length, MOCK_REVIEWS.length);
    assert.equal(useReviewsStore.getState().statusFilter, "ALL");
    assert.equal(useReviewsStore.getState().searchQuery, "");
    assert.equal(useReviewsStore.getState().currentPage, 1);
  });

  it("normalizeSearchText handles Arabic Yeh/Kaf, ZWNJ, and Persian/Arabic digits", () => {
    const { normalizeSearchText } = require("../src/features/reviews/components/reviews-manager-view");

    // Arabic Yeh vs Persian Yeh
    assert.equal(normalizeSearchText("عليرضا شفييعي"), "علیرضا شفییعی");

    // Arabic Kaf vs Persian Kaf
    assert.equal(normalizeSearchText("تكتشر سنگ"), "تکتشر سنگ");

    // ZWNJ normalization (بوش‌همر -> بوش همر)
    assert.equal(normalizeSearchText("بوش\u200cهمر"), "بوش همر");

    // Persian and Arabic digits to ASCII
    assert.equal(normalizeSearchText("۰۹۱۲۳۴۵۶۷۸۹"), "09123456789");
    assert.equal(normalizeSearchText("٠١٢٣٤٥٦٧٨٩"), "0123456789");

    // Substring matching across ZWNJ and Arabic variations
    const title = "اسلب مرمریت لاشتر بوش\u200cهمر چرمی عمیق";
    const queryEn = "بوش همر";
    assert.ok(
      normalizeSearchText(title).includes(normalizeSearchText(queryEn)),
      "Searching 'بوش همر' without ZWNJ must match 'بوش‌همر' with ZWNJ"
    );

    const customer = "مهندس علیرضا شفیعی";
    const queryArabic = "عليرضا"; // with Arabic Yeh
    assert.ok(
      normalizeSearchText(customer).includes(normalizeSearchText(queryArabic)),
      "Searching with Arabic keyboard must match Persian name"
    );
  });

  it("getPaginationRange generates correct windowed ranges with ellipsis", () => {
    const { getPaginationRange } = require("../src/features/reviews/components/reviews-manager-view");

    // Small total (<= 5)
    assert.deepEqual(getPaginationRange(1, 3), [1, 2, 3]);
    assert.deepEqual(getPaginationRange(3, 5), [1, 2, 3, 4, 5]);

    // Near start
    assert.deepEqual(getPaginationRange(2, 10), [1, 2, 3, 4, "ellipsis-1", 10]);

    // Near end
    assert.deepEqual(getPaginationRange(9, 10), [1, "ellipsis-1", 7, 8, 9, 10]);

    // In middle
    assert.deepEqual(getPaginationRange(5, 10), [1, "ellipsis-1", 4, 5, 6, "ellipsis-2", 10]);
  });

  it("Enforces tenant isolation using canAccessTenantResource", () => {
    const { canAccessTenantResource } = require("../src/auth/tenantScope");

    const managerTenant1 = {
      id: "usr-01",
      name: "مدیر کارخانه ۱",
      role: "MANAGER",
      tenantId: "tenant-001",
    };

    const managerTenant2 = {
      id: "usr-02",
      name: "مدیر کارخانه ۲",
      role: "MANAGER",
      tenantId: "tenant-002",
    };

    const superAdmin = {
      id: "admin-01",
      name: "مدیر کل پلتفرم",
      role: "SUPER_ADMIN",
    };

    // Manager of tenant-001 can access tenant-001 review
    assert.equal(canAccessTenantResource(managerTenant1, "tenant-001"), true);
    // Manager of tenant-001 CANNOT access tenant-002 review
    assert.equal(canAccessTenantResource(managerTenant1, "tenant-002"), false);

    // Manager of tenant-002 can access tenant-002 review
    assert.equal(canAccessTenantResource(managerTenant2, "tenant-002"), true);
    // Manager of tenant-002 CANNOT access tenant-001 review
    assert.equal(canAccessTenantResource(managerTenant2, "tenant-001"), false);

    // Super Admin has global access to all tenants
    assert.equal(canAccessTenantResource(superAdmin, "tenant-001"), true);
    assert.equal(canAccessTenantResource(superAdmin, "tenant-002"), true);
  });

  it("deleteReviewItem cleans up replyReview and rejectReviewItem states if matched", () => {
    const store = useReviewsStore.getState();
    const item = store.reviews[0];

    // Open reply dialog on item
    store.openReplyDialog(item);
    assert.equal(useReviewsStore.getState().isReplyOpen, true);
    assert.equal(useReviewsStore.getState().replyReview?.id, item.id);

    // Open reject dialog on item
    store.openRejectDialog(item);
    assert.equal(useReviewsStore.getState().isRejectOpen, true);
    assert.equal(useReviewsStore.getState().rejectReviewItem?.id, item.id);

    // Delete item
    store.deleteReviewItem(item.id);

    const state = useReviewsStore.getState();
    assert.equal(state.isReplyOpen, false);
    assert.equal(state.replyReview, null);
    assert.equal(state.isRejectOpen, false);
    assert.equal(state.rejectReviewItem, null);
  });

  it("normalizeSearchText is resilient to null/undefined, normalizes Persian Alef variations and Arabic diacritics", () => {
    const { normalizeSearchText } = require("../src/features/reviews/components/reviews-manager-view");

    // Null and undefined safety
    assert.equal(normalizeSearchText(null), "");
    assert.equal(normalizeSearchText(undefined), "");
    assert.equal(normalizeSearchText(""), "");

    // Alef with Madda / Hamza normalization (آ / أ / إ -> ا)
    assert.equal(normalizeSearchText("آتشکوه"), "اتشکوه");
    assert.equal(normalizeSearchText("اتشکوه"), "اتشکوه");
    assert.equal(normalizeSearchText("آرش"), "ارش");
    assert.equal(normalizeSearchText("ارش"), "ارش");

    // Cross matching with/without Alef Madda
    const stoneTitle = "اسلب تراورتن آتشکوه سوپر کرم";
    assert.ok(
      normalizeSearchText(stoneTitle).includes(normalizeSearchText("اتشکوه")),
      "Searching 'اتشکوه' must match 'آتشکوه'"
    );

    // Arabic Tashkeel removal (Fatha, Damma, Kasra, Shadda)
    assert.equal(normalizeSearchText("مُحَمَّد"), "محمد");
  });

  it("reviewsService.getReviews enforces multi-tenant scoping correctly", async () => {
    // Global scope (SUPER_ADMIN)
    const all = await reviewsService.getReviews();
    assert.equal(all.length, 10);

    // Tenant-001 scope (سنگ و سرامیک صنعت)
    const tenant1Reviews = await reviewsService.getReviews("tenant-001");
    assert.equal(tenant1Reviews.length, 7);
    assert.ok(tenant1Reviews.every((r) => !r.tenantId || r.tenantId === "tenant-001"));

    // Tenant-002 scope (تجارت سنگ‌های قیمتی)
    const tenant2Reviews = await reviewsService.getReviews("tenant-002");
    assert.equal(tenant2Reviews.length, 3);
    assert.ok(tenant2Reviews.every((r) => r.tenantId === "tenant-002"));

    // Tenant-002 has reviews covering PENDING, APPROVED, and REJECTED
    assert.ok(tenant2Reviews.some((r) => r.status === "PENDING"));
    assert.ok(tenant2Reviews.some((r) => r.status === "APPROVED"));
    assert.ok(tenant2Reviews.some((r) => r.status === "REJECTED"));

    // Stats isolation
    const stats1 = reviewsService.calculateStats(tenant1Reviews);
    const stats2 = reviewsService.calculateStats(tenant2Reviews);
    assert.equal(stats1.total, 7);
    assert.equal(stats2.total, 3);
    assert.equal(stats1.total + stats2.total, all.length);
  });

  it("searches reviews by customer email address", () => {
    const { normalizeSearchText } = require("../src/features/reviews/components/reviews-manager-view");
    const emailQuery = "sabouri";
    const found = MOCK_REVIEWS.filter((r) =>
      r.customerEmail ? normalizeSearchText(r.customerEmail).includes(emailQuery) : false
    );
    assert.equal(found.length, 1);
    assert.equal(found[0].id, "rev-101");
    assert.equal(found[0].customerEmail, "sara.sabouri.interior@gmail.com");
  });
});
