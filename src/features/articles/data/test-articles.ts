import type { Article } from "../types";

/**
 * Temporary test data for development/preview purposes.
 * Will be replaced by real data from queries/actions.
 *
 * `publishedAt` values are ISO 8601 timestamps (+03:30 Tehran offset)
 * rendered as long-form Jalali dates via `toLocaleDateString("fa-IR")`.
 * The list is ordered newest-first.
 */
export const testArticles: Article[] = [
  {
    id: "a1",
    slug: "parking-outdoor-stone-guide",
    title: "راهنمای انتخاب سنگ برای پارکینگ و فضاهای باز",
    description:
      "گرانیت و بازالت با جذب آب پایین، گزینه‌های اول برای پارکینگ‌ها هستند؛ نکات کلیدی درباره مقاومت فشاری و ضدلغزندگی را بشناسید.",
    image: "/test_images/stones/test_3.jpg",
    publishedAt: "2026-08-02T09:30:00+03:30",
  },
  {
    id: "a2",
    slug: "marble-vs-travertine-modern-projects",
    title: "مرمر یا تراورتن؟ راهنمای انتخاب برای پروژه‌های مدرن",
    description:
      "مقایسه‌ای کاربردی میان جلوه لوکس مرمر و گرمای تراورتن؛ از هزینه اجرا تا ماندگاری رنگ در نور آفتاب.",
    image: "/test_images/stones/test_1.jpg",
    publishedAt: "2026-07-18T14:00:00+03:30",
  },
  {
    id: "a3",
    slug: "natural-stone-care-and-washing",
    title: "نگهداری و شست‌وشوی سنگ‌های طبیعی",
    description:
      "با شوینده‌های مناسب و روش بنده‌گیری درست، عمر سنگ‌های ساختمان خود را چند برابر کنید.",
    image: "/test_images/stones/test_7.jpg",
    publishedAt: "2026-06-30T08:15:00+03:30",
  },
  {
    id: "a4",
    slug: "stone-finish-polish-to-sandblast",
    title: "پرداخت سنگ؛ از پولیش تا سندبلاست",
    description:
      "هر پرداخت، شخصیت متفاوتی به سنگ می‌دهد؛ تفاوت پولیش، هونی، لیکا و سندبلاست را بررسی می‌کنیم.",
    image: "/test_images/stones/test_8.jpg",
    publishedAt: "2026-06-05T11:45:00+03:30",
  },
  {
    id: "a5",
    slug: "onyx-backlight-magic",
    title: "جادوی آنیکس؛ سنگی که با نور زندگی می‌کند",
    description:
      "چرا آنیکس محبوب طراحان نورپردازی است؟ ایده‌هایی برای دیوار تلویزیون و بارها با نور مخفی از پشت.",
    image: "/test_images/stones/test_4.jpg",
    imageAlt: "سنگ آنیکس سبز نیمه‌شفاف روی دیوار داخلی",
    publishedAt: "2026-05-14T16:20:00+03:30",
  },
  {
    id: "a6",
    slug: "building-facade-stone-trends",
    title: "ترندهای سنگ نمای ساختمان در سال پیش رو",
    description:
      "از ترکیب سنگ با چوب تا اسلب‌های بزرگ تراورتن کرم؛ روندهایی که معماران ایرانی امسال بیشتر استفاده می‌کنند.",
    image: "/test_images/stones/test_2.jpg",
    publishedAt: "2026-04-27T10:05:00+03:30",
  },
];