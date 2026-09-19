import {
  Award,
  Droplets,
  Gem,
  Layers,
  Leaf,
  Lightbulb,
  Mountain,
  Ruler,
  ShieldCheck,
  Snowflake,
  Truck,
} from "lucide-react";

import type { StoneApplication, StoneType } from "@/constants";

import { testProducts } from "./test-products";
import {
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "../constants";
import type {
  ProductDetail,
  ProductFeatureItem,
  ProductQuickAction,
  ProductReview,
  ProductSeller,
  ProductSellUnit,
  ProductSpecification,
} from "../types";

/**
 * Temporary product-detail test data (dev/preview only).
 *
 * Composes `ProductDetail` views from the temporary `testProducts` list
 * until the real product-detail query exists. Everything here is clearly
 * test data; the product-detail *view* stays purely data-driven and will
 * work unchanged once a server query returns the same `ProductDetail`
 * shape.
 */

/* -------------------------------------------------------------------------- */
/*  Static test content                                                        */
/* -------------------------------------------------------------------------- */

/** Seller/factory summaries keyed by tenant id (test data). */

/**
 * Multi-unit sell data for a few demo products (test data).
 *
 * Lets the purchase panel demonstrate the "واحد فروش" selector — the same
 * stone can be sold by area / count / weight, each with its own per-unit
 * price. Products not listed here keep the single-unit behavior.
 */
const TEST_SELL_UNITS: Record<string, ProductSellUnit[]> = {
  p1: [
    { unit: "per-sqm", price: 2_450_000, compareAtPrice: 2_900_000 },
    { unit: "per-piece", price: 140_000 },
    { unit: "per-ton", price: 9_800_000 },
  ],
  p2: [
    { unit: "per-sqm", price: 1_180_000, compareAtPrice: 1_480_000 },
    { unit: "per-piece", price: 65_000 },
  ],
  p3: [
    { unit: "per-sqm", price: 3_750_000 },
    { unit: "per-slab", price: 78_000_000 },
    { unit: "per-ton", price: 15_000_000 },
  ],
};


/** Curated customer reviews for a few test products (others stay empty). */
const TEST_REVIEWS: Record<string, ProductReview[]> = {
  p1: [
    {
      id: "r1",
      author: "مهندس رضایی",
      rating: 5,
      date: "2025-07-12T00:00:00Z",
      title: "کیفیت فوق‌العاده برای لابی",
      content:
        "برای کف لابی پروژه استفاده کردیم؛ یکدستی رنگ و کیفیت پرداخت سطح واقعاً عالی بود. بسته‌بندی هم بسیار تمیز و ایمن انجام شد.",
    },
    {
      id: "r2",
      author: "شرکت ساختمانی آرین",
      rating: 4,
      date: "2025-08-03T00:00:00Z",
      title: "ارسال سریع",
      content:
        "سفارش در کمتر از یک هفته به کارگاه رسید. تنها نکته اینکه چند قطعه اختلاف رنگ جزئی داشتند که با هماهنگی فروشنده برطرف شد.",
    },
    {
      id: "r3",
      author: "کاوه م.",
      rating: 5,
      date: "2025-08-20T00:00:00Z",
      title: "دقیقاً مثل تصاویر",
      content:
        "رگه‌های سنگ دقیقاً مطابق تصاویر سایت بود. برای پذیرایی منزل تهیه کردم و نتیجه خیلی لوکس شد.",
    },
  ],
  p10: [
    {
      id: "r4",
      author: "آتلیه معماری نوید",
      rating: 5,
      date: "2025-08-11T00:00:00Z",
      title: "انتخاب اول برای پروژه‌های شاخص",
      content:
        "برای دیوار ویژه پنت‌هاوس استفاده کردیم. یکپارچگی اسلب‌ها و پیوستگی رگه‌ها بعد از نصب، ترکیب book-match فوق‌العاده‌ای ساخت.",
    },
    {
      id: "r5",
      author: "م. صادقی",
      rating: 4,
      date: "2025-08-25T00:00:00Z",
      title: "قیمت مناسب نسبت به کیفیت",
      content:
        "نسبت به نمونه‌های مشابه بازار، قیمت منصفانه‌ای داشت. فقط زمان آماده‌سازی کمی بیشتر از حد انتظار بود.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Data-driven composition helpers                                            */
/* -------------------------------------------------------------------------- */

/** Extra technical profile per stone type (typical lab-range values). */
const STONE_TECHNICAL_PROFILES: Record<StoneType, ProductSpecification[]> = {
  marble: [
    { label: "جذب آب", value: "0.2%" },
    { label: "چگالی", value: "2.71 g/cm³" },
    { label: "مقاومت فشاری", value: "120 MPa" },
  ],
  travertine: [
    { label: "جذب آب", value: "0.5%" },
    { label: "چگالی", value: "2.40 g/cm³" },
    { label: "مقاومت فشاری", value: "95 MPa" },
  ],
  granite: [
    { label: "جذب آب", value: "0.4%" },
    { label: "چگالی", value: "2.65 g/cm³" },
    { label: "مقاومت فشاری", value: "190 MPa" },
  ],
  limestone: [
    { label: "جذب آب", value: "2.0%" },
    { label: "چگالی", value: "2.30 g/cm³" },
    { label: "مقاومت فشاری", value: "80 MPa" },
  ],
  onyx: [
    { label: "جذب آب", value: "0.1%" },
    { label: "چگالی", value: "2.55 g/cm³" },
    { label: "مقاومت فشاری", value: "105 MPa" },
  ],
  quartzite: [
    { label: "جذب آب", value: "0.3%" },
    { label: "چگالی", value: "2.65 g/cm³" },
    { label: "مقاومت فشاری", value: "180 MPa" },
  ],
  slate: [
    { label: "جذب آب", value: "0.3%" },
    { label: "چگالی", value: "2.80 g/cm³" },
    { label: "مقاومت فشاری", value: "150 MPa" },
  ],
  sandstone: [
    { label: "جذب آب", value: "3.0%" },
    { label: "چگالی", value: "2.20 g/cm³" },
    { label: "مقاومت فشاری", value: "65 MPa" },
  ],
  basalt: [
    { label: "جذب آب", value: "0.2%" },
    { label: "چگالی", value: "2.90 g/cm³" },
    { label: "مقاومت فشاری", value: "250 MPa" },
  ],
  porcelain: [
    { label: "جذب آب", value: "0.05%" },
    { label: "چگالی", value: "2.40 g/cm³" },
    { label: "مقاومت فشاری", value: "—" },
  ],
};
const TEST_SELLERS: Record<string, ProductSeller> = {
  t1: {
    id: "t1",
    name: "صنایع سنگ سپنتا",
    slug: "sepanta-stone",
    location: "اصفهان، ایران",
    verified: true,
    phone: "+983132800000",
  },
};

/** Shared quick contact/order actions for test products. */
const TEST_QUICK_ACTIONS: ProductQuickAction[] = [
  { id: "inquiry", label: "استعلام قیمت", kind: "link", href: "/contact" },
  { id: "call", label: "تماس با فروشنده", kind: "tel", href: "+983132800000" },
];

/** Feature pools per stone type; combined with the common set per product. */
const COMMON_FEATURES: ProductFeatureItem[] = [
  {
    id: "strength",
    title: "مقاومت بالا",
    description: "مناسب برای پروژه‌های پرتردد و فضاهای پررفت‌وآمد",
    icon: ShieldCheck,
  },
  {
    id: "shipping",
    title: "ارسال به سراسر کشور",
    description: "بارگیری ایمن و ارسال مستقیم به کارگاه پروژه شما",
    icon: Truck,
  },
  {
    id: "cutting",
    title: "برش سفارشی",
    description: "امکان برش در ابعاد سفارشی پروژه با دقت بالا",
    icon: Ruler,
  },
];

const STONE_FEATURES: Partial<Record<StoneType, ProductFeatureItem[]>> = {
  marble: [
    {
      id: "luxury",
      title: "ظاهر لوکس",
      description: "رگه‌های طبیعی و منحصربه‌فرد در هر اسلب",
      icon: Gem,
    },
    {
      id: "water",
      title: "جذب آب پایین",
      description: "مناسب برای محیط‌های مرطوب و سرویس‌های بهداشتی",
      icon: Droplets,
    },
  ],
  travertine: [
    {
      id: "natural",
      title: "بافت طبیعی متخلخل",
      description: "عایق حرارتی بهتر برای نماهای ساختمانی",
      icon: Leaf,
    },
    {
      id: "facade",
      title: "محبوب نمای ساختمان",
      description: "انتخاب کلاسیک نماهای مدرن و کلاسیک ایرانی",
      icon: Layers,
    },
  ],
  granite: [
    {
      id: "hard",
      title: "سختی بسیار بالا",
      description: "مقاوم در برابر خط‌وخش و ضربه در استفاده روزمره",
      icon: Mountain,
    },
    {
      id: "outdoor",
      title: "مناسب فضای باز",
      description: "پایداری رنگ در برابر نور مستقیم آفتاب و یخ‌زدگی",
      icon: Snowflake,
    },
  ],
  onyx: [
    {
      id: "backlight",
      title: "قابلیت نورگذاری",
      description: "عبور نور از بدنه سنگ برای دیوارها و دهلیزهای ویژه",
      icon: Lightbulb,
    },
    {
      id: "rare",
      title: "سنگی کمیاب",
      description: "تیراژ محدود؛ هر اسلب اثر منحصربه‌فردی از طبیعت است",
      icon: Award,
    },
  ],
};

/** Default applications per product form (usage families). */
const FORM_APPLICATIONS: Record<string, StoneApplication[]> = {
  slab: ["flooring", "wall-cladding", "countertop", "staircase"],
  tile: ["flooring", "wall-cladding", "bathroom"],
  "cut-to-size": ["flooring", "staircase", "facade"],
  mosaic: ["bathroom", "kitchen", "wall-cladding"],
  veneer: ["feature-wall", "fireplace"],
  block: ["landscaping", "outdoor"],
  countertop: ["countertop", "kitchen"],
  vanity: ["bathroom", "countertop"],
};

/** Build the full detail view for one product from its base data. */
function buildProductDetail(
  product: (typeof testProducts)[number]
): ProductDetail {
  const typeLabel = stoneLabel(STONE_TYPE_LABELS, product.stoneType);
  const colorLabel = stoneLabel(STONE_COLOR_LABELS, product.color);
  const finishLabel = stoneLabel(STONE_FINISH_LABELS, product.finish);
  const formLabel = stoneLabel(STONE_FORM_LABELS, product.form);

  const applications =
    FORM_APPLICATIONS[product.form ?? ""] ?? ["flooring", "wall-cladding"];

  const specifications: ProductSpecification[] = [
    { label: "نوع سنگ", value: typeLabel ?? "—" },
    ...(colorLabel ? [{ label: "رنگ غالب", value: colorLabel }] : []),
    ...(finishLabel ? [{ label: "پرداخت سطح", value: finishLabel }] : []),
    ...(formLabel ? [{ label: "نوع محصول", value: formLabel }] : []),
    ...(product.origin ? [{ label: "مبدا", value: product.origin }] : []),
    ...(product.quarry ? [{ label: "معدن", value: product.quarry }] : []),
    ...(product.grade ? [{ label: "گرید", value: product.grade }] : []),
    ...(product.dimensions
      ? [{ label: "ابعاد", value: product.dimensions }]
      : []),
    ...(product.thickness
      ? [{ label: "ضخامت", value: `${product.thickness} cm` }]
      : []),
    ...(product.stoneType ? STONE_TECHNICAL_PROFILES[product.stoneType] : []),
  ];

  const features = [
    ...COMMON_FEATURES,
    ...(product.stoneType ? (STONE_FEATURES[product.stoneType] ?? []) : []),
  ];

  const shortBase = [
    typeLabel,
    colorLabel,
    `با پرداخت ${finishLabel ?? "طبیعی"}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...product,
    quality: (product.rating ?? 0) >= 4.5 ? "درجه یک" : undefined,
    shortDescription: `${shortBase}؛ انتخابی مطمئن برای ${formLabel ?? "پروژه‌های ساختمانی"}.`,
    descriptionParagraphs: [
      `${product.name} نمونه‌ای ${colorLabel ?? ""} از ${typeLabel ?? "سنگ طبیعی"} ایرانی است که از ${product.origin ?? "معدن‌های منتخب"} استخراج می‌شود. بافت یکدست و رنگ آرام این سنگ، آن را به گزینه‌ای محبوب برای فضاهایی تبدیل کرده که حس معمارانه و لوکس بودن در آن‌ها اهمیت دارد.`,
      `پرداخت ${finishLabel ?? "طبیعی"} سطح، بازتاب نور را کنترل می‌کند و جزئیات رگه‌های طبیعی را بدون درخشندگی افراطی به نمایش می‌گذارد. هر برش از این سنگ الگوی منحصربه‌فرد خود را دارد؛ به همین دلیل توصیه می‌کنیم پیش از اجرای نهایی پروژه، تیره و موجودی فعلی را با کارشناسان فروش هماهنگ کنید.`,
      `تیم فنی ما امکان مشاوره پیش از خرید، انتخاب تیره و برش در ابعاد سفارشی پروژه را ارائه می‌دهد. بارگیری و ارسال با بسته‌بندی استاندارد و بیمه حمل انجام می‌شود تا سنگ بدون آسیب به کارگاه شما برسد.`,
    ],
    descriptionNotes: [
      "پیش از نصب، سطح زیرکار باید کاملاً تراز، تمیز و خشک باشد.",
      "برای نگهداری روزمره از مواد شوینده با pH خنثی استفاده کنید.",
      "استفاده از آب‌بند (سیلر) پس از نصب، ماندگاری سطح را افزایش می‌دهد.",
    ],
    applications,
    features,
    specifications,
    reviews: TEST_REVIEWS[product.id] ?? [],
    purchase: { minQuantity: 2, step: 1 },
    /* Multi-unit selling: default unit falls back to the first sell unit
       so the price line always shows "/ unit" when units are defined. */
    pricingUnit: product.pricingUnit ?? TEST_SELL_UNITS[product.id]?.[0]?.unit,
    sellUnits: TEST_SELL_UNITS[product.id],
    quickActions: TEST_QUICK_ACTIONS,
    seller: TEST_SELLERS[product.tenantId],
  };
}

/* -------------------------------------------------------------------------- */
/*  Public data access (dev stand-ins for the real queries)                     */
/* -------------------------------------------------------------------------- */

/** All product slugs — used by `generateStaticParams` on the detail route. */
export function getAllProductSlugs(): { slug: string }[] {
  return testProducts.map((product) => ({ slug: product.slug }));
}

/** Full detail view for a single product, or `null` when not found. */
export function getProductDetailBySlug(slug: string): ProductDetail | null {
  const product = testProducts.find((p) => p.slug === slug);
  return product ? buildProductDetail(product) : null;
}

/**
 * Related products: same stone type or shared category
 * (business/catalog relationship). Excludes the product itself.
 */
export function getRelatedProducts(
  product: ProductDetail,
  limit = 4
): (typeof testProducts)[number][] {
  return testProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.status === "published" &&
        (p.stoneType === product.stoneType ||
          p.categories.some((c) => product.categories.includes(c)))
    )
    .slice(0, limit);
}

/**
 * Similar products: visually/technically close alternatives
 * (same color, form or finish) that are not already related.
 */
export function getSimilarProducts(
  product: ProductDetail,
  limit = 4
): (typeof testProducts)[number][] {
  const relatedIds = new Set(getRelatedProducts(product).map((p) => p.id));
  return testProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.status === "published" &&
        !relatedIds.has(p.id) &&
        (p.color === product.color ||
          p.form === product.form ||
          p.finish === product.finish)
    )
    .slice(0, limit);
}