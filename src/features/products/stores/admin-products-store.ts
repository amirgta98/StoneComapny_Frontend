import { create } from "zustand";
import type { Product, ProductStatus } from "@/types";
import { testProducts } from "../data/test-products";

// Pre-seeded rich stone products for tenant-001 and tenant-002
const INITIAL_MANAGER_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    tenantId: "tenant-001",
    name: "سنگ مرمریت کالاتا گلد",
    slug: "calacatta-gold-marble",
    description: "اسلب‌های بوک‌مچ با زمینه سفید کریستالی و رگه‌های طلایی و خردلی بسیار چشم‌نواز مناسب فضاهای لوکس لابی و دیواره TV Wall.",
    status: "published",
    stoneType: "marble",
    color: "gold",
    finish: "polished",
    form: "slab",
    origin: "معدن کاشان، اصفهان",
    quarry: "معدن اختصاصی کالاتا",
    grade: "سوپر صادراتی",
    thickness: 2,
    dimensions: "۲۸۰ × ۱۶۰ سانتی‌متر",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 12_600_000,
    compareAtPrice: 14_000_000,
    rating: 4.9,
    reviewCount: 42,
    images: [
      {
        id: "img-1-1",
        url: "/test_images/stones/test_1.jpg",
        alt: "اسلب مرمریت کالاتا گلد",
        sortOrder: 0,
        isPrimary: true,
      },
      {
        id: "img-1-2",
        url: "/test_images/stones/test_2.jpg",
        alt: "نمای بوک‌مچ کالاتا گلد",
        sortOrder: 1,
      },
    ],
    attributes: [
      { id: "att-1", name: "درصد جذب آب", value: "۰.۱۸", unit: "درصد" },
      { id: "att-2", name: "مقاومت فشاری", value: "۱۲۵۰", unit: "kg/cm²" },
      { id: "att-3", name: "وزن مخصوص", value: "۲.۷", unit: "gr/cm³" },
    ],
    variants: [
      { id: "var-1", sku: "CAL-SL-280", name: "اسلب بوک‌مچ جفت", inventory: 840, price: 12_600_000, attributes: [] },
    ],
    categories: ["marble", "dehbid-marble"],
    collections: ["luxury-slabs", "bookmatch"],
    createdAt: "۱۴۰۳/۰۳/۱۵",
    updatedAt: "۱۴۰۳/۰۶/۱۰",
  },
  {
    id: "prod-2",
    tenantId: "tenant-001",
    name: "تراورتن کرم آتشکوه سوپر",
    slug: "cream-atashkooh-travertine",
    description: "تراورتن موج‌دار ساب‌خورده با چسبندگی فوق‌العاده و مقاومت در برابر شرایط جوی سرما و گرمای شدید، ویژه نمای ساختمان.",
    status: "published",
    stoneType: "travertine",
    color: "cream",
    finish: "polished",
    form: "tile",
    origin: "معدن آتشکوه، محلات",
    quarry: "آتشکوه مرکزی",
    grade: "سوپر ممتاز",
    thickness: 1.8,
    dimensions: "۴۰ طولی آزاد",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 1_450_000,
    compareAtPrice: 1_650_000,
    rating: 4.8,
    reviewCount: 38,
    images: [
      {
        id: "img-2-1",
        url: "/test_images/stones/test_5.jpg",
        alt: "تراورتن کرم آتشکوه",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { id: "att-2-1", name: "تخلخل", value: "۸.۵", unit: "درصد" },
      { id: "att-2-2", name: "مقاومت فشاری", value: "۵۴۰", unit: "kg/cm²" },
    ],
    variants: [
      { id: "var-2", sku: "TRV-AT-040", name: "تایل ۴۰ طولی نما", inventory: 4200, price: 1_450_000, attributes: [] },
    ],
    categories: ["travertine", "dare-bokhari-travertine"],
    collections: ["facade-stones"],
    createdAt: "۱۴۰۳/۰۴/۰۱",
    updatedAt: "۱۴۰۳/۰۶/۱۲",
  },
  {
    id: "prod-3",
    tenantId: "tenant-001",
    name: "اسلب مرمر (آنیکس) سبز زمردی",
    slug: "emerald-green-onyx-slab",
    description: "سنگ مرمر شفاف نورگذر با توری و رزین پشت توری ایتالیایی، منحصر به‌فرد برای کانتر لابی، تی‌وی‌وال و بار کانتر لوکس.",
    status: "published",
    stoneType: "onyx",
    color: "green",
    finish: "polished",
    form: "slab",
    origin: "معدن قروه، کردستان",
    quarry: "آنیکس خاص زمردی",
    grade: "سوپر صادراتی VIP",
    thickness: 2,
    dimensions: "۲۷۰ × ۱۸۰ سانتی‌متر",
    pricingUnit: "per-slab",
    inventoryUnit: "slab",
    price: 120_000_000,
    compareAtPrice: 135_000_000,
    rating: 5.0,
    reviewCount: 19,
    images: [
      {
        id: "img-3-1",
        url: "/test_images/stones/test_6.jpg",
        alt: "اسلب آنیکس سبز زمردی",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { id: "att-3-1", name: "قابلیت عبور نور", value: "فوق شفاف ۱۰۰٪", unit: "" },
      { id: "att-3-2", name: "ضریب جذب آب", value: "۰.۰۵", unit: "درصد" },
    ],
    variants: [
      { id: "var-3", sku: "ONX-GR-002", name: "اسلب تک قواره", inventory: 14, price: 120_000_000, attributes: [] },
    ],
    categories: ["onyx-marble", "emerald-green-onyx"],
    collections: ["backlit-stones", "luxury-slabs"],
    createdAt: "۱۴۰۳/۰۵/۱۰",
    updatedAt: "۱۴۰۳/۰۶/۱۵",
  },
  {
    id: "prod-4",
    tenantId: "tenant-001",
    name: "گرانیت مشکی نطنز چرمی",
    slug: "natanz-black-granite-leathered",
    description: "گرانیت مشکی با پرداخت چرمی ابریشمی بسیار مقاوم در برابر خط و خش و مواد شیمیایی مناسب برای صفحه کابینت و پله.",
    status: "published",
    stoneType: "granite",
    color: "black",
    finish: "leathered",
    form: "slab",
    origin: "معدن نطنز، اصفهان",
    quarry: "نطنز گرانیت مرکزی",
    grade: "ممتاز درجه ۱",
    thickness: 3,
    dimensions: "۳۰۰ × ۱۸۰ سانتی‌متر",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 3_800_000,
    compareAtPrice: 4_200_000,
    rating: 4.7,
    reviewCount: 24,
    images: [
      {
        id: "img-4-1",
        url: "/test_images/stones/test_3.jpg",
        alt: "گرانیت مشکی نطنز چرمی",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    attributes: [
      { id: "att-4-1", name: "مقاومت سایش", value: "۰.۴", unit: "میلی‌متر" },
      { id: "att-4-2", name: "مقاومت فشاری", value: "۱۸۵۰", unit: "kg/cm²" },
    ],
    variants: [
      { id: "var-4", sku: "GRN-NTZ-30", name: "اسلب ۳ سانت", inventory: 560, price: 3_800_000, attributes: [] },
    ],
    categories: ["granite", "natanz-black-granite"],
    collections: ["countertop-stones"],
    createdAt: "۱۴۰۳/۰۵/۲۰",
    updatedAt: "۱۴۰۳/۰۶/۱۸",
  },
  {
    id: "prod-5",
    tenantId: "tenant-001",
    name: "مرمریت لاشتر بوش‌همر چرمی",
    slug: "lashtor-bushhammered-leathered",
    description: "سنگ مرمریت خاکستری پیترا گری با فینیش بوش‌همر چرمی ضد لغزش مناسب محوطه‌سازی، استخر و کفپوش‌های پرتردد.",
    status: "draft",
    stoneType: "marble",
    color: "grey",
    finish: "leathered",
    form: "tile",
    origin: "معدن لاشتر، اصفهان",
    quarry: "لاشتر سنگبری نو",
    grade: "درجه ۱",
    thickness: 2,
    dimensions: "۶۰ × ۶۰ سانتی‌متر",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 1_250_000,
    rating: 4.6,
    reviewCount: 15,
    images: [
      {
        id: "img-5-1",
        url: "/test_images/stones/test_4.jpg",
        alt: "مرمریت لاشتر بوش‌همر چرمی",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    attributes: [],
    variants: [
      { id: "var-5", sku: "LSH-60-BUSH", name: "تایل ۶۰×۶۰", inventory: 0, price: 1_250_000, attributes: [] },
    ],
    categories: ["marble", "lashtor-marble"],
    collections: ["outdoor-stones"],
    createdAt: "۱۴۰۳/۰۶/۰۱",
    updatedAt: "۱۴۰۳/۰۶/۰۱",
  },
  {
    id: "prod-6",
    tenantId: "tenant-002",
    name: "چینی کریستال نیریز اسلب بوک‌مچ",
    slug: "neyriz-crystal-slab-bookmatch",
    description: "سنگ چینی سفید درخشان نیریز با خطوط مشکی و طوسی ملایم طرح بوک‌مچ ۴ تایی.",
    status: "published",
    stoneType: "marble",
    color: "white",
    finish: "polished",
    form: "slab",
    origin: "معدن نیریز، فارس",
    quarry: "نیریز کریستال سپهر",
    grade: "سوپر ممتاز",
    thickness: 2,
    dimensions: "۲۹۰ × ۱۸۵ سانتی‌متر",
    pricingUnit: "per-sqm",
    inventoryUnit: "sqm",
    price: 4_500_000,
    compareAtPrice: 5_100_000,
    rating: 4.8,
    reviewCount: 31,
    images: [
      {
        id: "img-6-1",
        url: "/test_images/stones/test_7.jpg",
        alt: "چینی نیریز اسلب بوک‌مچ",
        sortOrder: 0,
        isPrimary: true,
      },
    ],
    attributes: [],
    variants: [
      { id: "var-6", sku: "NYR-BM-01", name: "اسلب بوک‌مچ", inventory: 340, price: 4_500_000, attributes: [] },
    ],
    categories: ["marble"],
    collections: ["bookmatch"],
    createdAt: "۱۴۰۳/۰۳/۲۰",
    updatedAt: "۱۴۰۳/۰۶/۰۵",
  },
];

export interface AdminProductsState {
  products: Product[];
  activeTenantId: string;

  // Actions
  initForTenant: (tenantId: string) => void;
  getProductsByTenant: (tenantId: string) => Product[];
  getProductById: (id: string) => Product | undefined;

  addProduct: (
    data: Partial<Product>,
    tenantId: string
  ) => { success: boolean; newId?: string; error?: string };

  updateProduct: (
    id: string,
    data: Partial<Product>
  ) => { success: boolean; error?: string };

  deleteProduct: (id: string) => { success: boolean; error?: string };

  duplicateProduct: (id: string) => { success: boolean; newId?: string; error?: string };

  toggleStatus: (id: string) => void;

  getStats: (tenantId: string) => {
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalStockValue: number;
    outOfStockCount: number;
  };
}

export const useAdminProductsStore = create<AdminProductsState>((set, get) => ({
  products: INITIAL_MANAGER_PRODUCTS,
  activeTenantId: "tenant-001",

  initForTenant: (tenantId: string) => {
    set({ activeTenantId: tenantId });
  },

  getProductsByTenant: (tenantId: string) => {
    const { products } = get();
    return products.filter((p) => p.tenantId === tenantId);
  },

  getProductById: (id: string) => {
    const { products } = get();
    return products.find((p) => p.id === id);
  },

  addProduct: (data: Partial<Product>, tenantId: string) => {
    if (!data.name?.trim()) {
      return { success: false, error: "نام سنگ الزامی است." };
    }

    const newId = `prod-${Date.now()}`;
    const now = new Date().toLocaleDateString("fa-IR");

    const newProduct: Product = {
      id: newId,
      tenantId,
      name: data.name.trim(),
      slug: data.slug?.trim() || `stone-${Date.now()}`,
      description: data.description?.trim() || "",
      status: data.status || "published",
      stoneType: data.stoneType || "marble",
      color: data.color || "white",
      finish: data.finish || "polished",
      form: data.form || "slab",
      application: data.application || "facade",
      origin: data.origin || "",
      quarry: data.quarry || "",
      grade: data.grade || "سوپر ممتاز",
      thickness: data.thickness || 2,
      dimensions: data.dimensions || "",
      pricingUnit: data.pricingUnit || "per-sqm",
      inventoryUnit: data.inventoryUnit || "sqm",
      price: data.price || 0,
      compareAtPrice: data.compareAtPrice,
      rating: 5.0,
      reviewCount: 0,
      images: data.images && data.images.length > 0 ? data.images : [
        {
          id: `img-${Date.now()}`,
          url: "/test_images/stones/test_1.jpg",
          alt: data.name,
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      attributes: data.attributes || [],
      variants: data.variants || [
        {
          id: `var-${Date.now()}`,
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          inventory: 100,
          attributes: [],
          price: data.price,
        },
      ],
      categories: data.categories || [],
      collections: data.collections || [],
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      products: [newProduct, ...state.products],
    }));

    return { success: true, newId };
  },

  updateProduct: (id: string, data: Partial<Product>) => {
    const { products } = get();
    const existing = products.find((p) => p.id === id);
    if (!existing) {
      return { success: false, error: "محصول یافت نشد." };
    }

    const now = new Date().toLocaleDateString("fa-IR");

    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...data,
          name: data.name?.trim() || p.name,
          slug: data.slug?.trim() || p.slug,
          updatedAt: now,
        };
      }),
    }));

    return { success: true };
  },

  deleteProduct: (id: string) => {
    const { products } = get();
    const existing = products.find((p) => p.id === id);
    if (!existing) {
      return { success: false, error: "محصول جهت حذف یافت نشد." };
    }

    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));

    return { success: true };
  },

  duplicateProduct: (id: string) => {
    const { products } = get();
    const original = products.find((p) => p.id === id);
    if (!original) return { success: false, error: "محصول اصلی یافت نشد." };

    const newId = `prod-${Date.now()}`;
    const now = new Date().toLocaleDateString("fa-IR");

    const copy: Product = {
      ...original,
      id: newId,
      name: `${original.name} (نسخه رونوشت)`,
      slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      products: [copy, ...state.products],
    }));

    return { success: true, newId };
  },

  toggleStatus: (id: string) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const nextStatus: ProductStatus =
          p.status === "published"
            ? "draft"
            : p.status === "draft"
            ? "archived"
            : "published";
        return { ...p, status: nextStatus, updatedAt: new Date().toLocaleDateString("fa-IR") };
      }),
    }));
  },

  getStats: (tenantId: string) => {
    const tenantProducts = get().products.filter((p) => p.tenantId === tenantId);

    const published = tenantProducts.filter((p) => p.status === "published").length;
    const draft = tenantProducts.filter((p) => p.status === "draft").length;
    const archived = tenantProducts.filter((p) => p.status === "archived").length;

    let totalStockValue = 0;
    let outOfStockCount = 0;

    for (const p of tenantProducts) {
      const inventory = p.variants.reduce((acc, v) => acc + (v.inventory || 0), 0);
      const unitPrice = p.price || 0;
      totalStockValue += inventory * unitPrice;
      if (inventory <= 0) outOfStockCount++;
    }

    return {
      total: tenantProducts.length,
      published,
      draft,
      archived,
      totalStockValue,
      outOfStockCount,
    };
  },
}));
