import type { ShippingMethod } from "../types";

export const STONE_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "freight_dedicated",
    name: "باربری اختصاصی سنگ (تریلی کفی / خاور پالت‌دار)",
    description:
      "ارسال مستقیم از کارخانه و معدن به پروژه با تریلی کفی استاندارد سنگ. مجهز به مهاربند و زیرپایی لاستیکی جهت جلوگیری از لب‌پریدگی سنگ‌ها.",
    price: 3_500_000,
    estimatedDays: "۳ تا ۵ روز کاری",
    icon: "Truck",
    carrier: "شرکت باربری ترابری سراسری سنگ",
    supportsCrane: true,
    supportsForklift: true,
    badge: "پیشنهاد پروژه‌ای",
  },
  {
    id: "freight_general",
    name: "باربری عمومی بین‌شهری (خرده‌بار پالت‌بندی‌شده)",
    description:
      "تحویل به نزدیک‌ترین انبار باربری مجاز شهر مقصد. مناسب برای متراژهای متوسط و تایل‌های سنگی در پالت چوبی تقویت‌شده.",
    price: 1_800_000,
    estimatedDays: "۴ تا ۷ روز کاری",
    icon: "Package",
    carrier: "پایانه‌های باربری معتبر سنگ",
    supportsCrane: false,
    supportsForklift: true,
  },
  {
    id: "express_pickup",
    name: "وانت بار و نیسان اختصاصی (ارسال سریع شهری)",
    description:
      "ویژه ارسال سریع متراژهای زیر ۵۰ متر مربع و قطعات حکاکی، ابزار و پله به تهران و استان‌های همجوار کارخانه.",
    price: 950_000,
    estimatedDays: "۱ تا ۲ روز کاری",
    icon: "Zap",
    carrier: "ناوگان حمل شهری سنگ",
    supportsCrane: false,
    supportsForklift: false,
    badge: "ارسال سریع",
  },
  {
    id: "factory_pickup",
    name: "تحویل حضوری در انبار مرکزی و شوروم کارخانه",
    description:
      "بارگیری مستقیم روی خودرو یا ناوگان باربری اعزامی از سمت خریدار در محل انبار کارخانه پس از صدور حواله خروج.",
    price: 0,
    estimatedDays: "آماده تحویل پس از هماهنگی (۲۴ ساعت)",
    icon: "Warehouse",
    carrier: "حمل توسط خریدار",
    supportsCrane: true,
    supportsForklift: true,
    badge: "رایگان",
  },
];

export const DEFAULT_SHIPPING_METHOD_ID = "freight_dedicated";
