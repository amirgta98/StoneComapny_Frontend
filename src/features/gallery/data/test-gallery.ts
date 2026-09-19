import type { GalleryItem } from "../types";

/**
 * Temporary gallery data for development/preview purposes.
 * Will be replaced by real media from the media/API layer.
 *
 * Images reuse the shared test catalog. Video `src` values use a small,
 * publicly available sample clip so playback works offline/online; the
 * poster (`thumbnail`) is a local image so the grid never loads the video
 * stream. `width`/`height` reserve aspect-ratio space to prevent layout
 * shift.
 */
export const testGallery: GalleryItem[] = [
  {
    id: "g1",
    type: "image",
    title: "اسلب مرمر سفید لوکس",
    description:
      "صفحه‌ای از مرمر سفید پولیش‌خورده با رگه‌های خاکستری ظریف؛ مناسب برای لابی و دیوار ویژه.",
    uploadedAt: "2026-08-10T10:00:00+03:30",
    src: "/test_images/stones/test_1.jpg",
    width: 800,
    height: 1000,
  },
  {
    id: "g2",
    type: "image",
    title: "تراورتن کرم آتشکوه",
    description:
      "تراورتن کرم هون‌شده با بافت یکدست و گرم؛ منتخب نمای خارجی و کف‌سازی.",
    uploadedAt: "2026-08-02T09:30:00+03:30",
    src: "/test_images/stones/test_2.jpg",
    width: 1000,
    height: 750,
  },
  {
    id: "g3",
    type: "image",
    title: "گرانیت مشکی نطنز",
    description:
      "گرانیت مشکی پولیش با سطوح درخشان؛ گزینه‌ای بادوام برای کف و پله.",
    uploadedAt: "2026-07-28T14:00:00+03:30",
    src: "/test_images/stones/test_3.jpg",
    width: 900,
    height: 1200,
  },
  {
    id: "g4",
    type: "video",
    title: "روند تولید اسلب گرانیت",
    description:
      "ویدیوی کوتاه از فرآیند برش و پرداخت اسلب گرانیت در کارخانه سنگ سپنتا.",
    uploadedAt: "2026-07-20T11:00:00+03:30",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "/test_images/stones/test_3.jpg",
    width: 854,
    height: 480,
  },
  {
    id: "g5",
    type: "image",
    title: "آنیکس سبز نورپردازی‌شده",
    description:
      "آنیکس سبز نیمه‌شفاف با نور مخفی؛ جلوه‌ای لوکس برای دیوار تلویزیون.",
    uploadedAt: "2026-07-15T16:00:00+03:30",
    src: "/test_images/stones/test_4.jpg",
    width: 800,
    height: 1100,
  },
  {
    id: "g6",
    type: "video",
    title: "گزارش پروژه ویلای دماوند",
    description:
      "گزارش تصویری مراحل سنگ‌کاری استخر و محوطه ویلای شخصی در استان تهران.",
    uploadedAt: "2026-07-05T12:30:00+03:30",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "/test_images/stones/test_6.jpg",
    width: 854,
    height: 480,
  },
  {
    id: "g7",
    type: "image",
    title: "سنگ آهک سفید گچی",
    description:
      "سنگ آهک سفید با سطح مات و طبیعی؛ انتخاب‌ای مینیمال برای فضای داخلی.",
    uploadedAt: "2026-06-22T12:00:00+03:30",
    src: "/test_images/stones/test_7.jpg",
    width: 1000,
    height: 700,
  },
  {
    id: "g8",
    type: "image",
    title: "سنگ لوح مشکی ساتن",
    description:
      "سنگ لوح مشکی با پرداخت ساتن؛ بافتی کلامی و ضدلغزش برای کف‌سازی.",
    uploadedAt: "2026-06-10T09:00:00+03:30",
    src: "/test_images/stones/test_8.jpg",
    width: 800,
    height: 1000,
  },
  {
    id: "g9",
    type: "video",
    title: "بازار سنگ ایران؛ مصاحبه",
    description:
      "گفت‌وگو درباره ترندهای بازار سنگ طبیعی و نکات خرید از کارشناس سپنتا.",
    uploadedAt: "2026-05-30T15:00:00+03:30",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "/test_images/stones/test_2.jpg",
    width: 854,
    height: 480,
  },
  {
    id: "g10",
    type: "image",
    title: "اسلب مرمر بژ امپراتور",
    description:
      "اسلب مرمر بژ با رگه‌های پرنقش؛ منتخب برای پذیرایی و ستون‌های نمای داخلی.",
    uploadedAt: "2026-05-18T10:30:00+03:30",
    src: "/test_images/stones/test_10.jpg",
    width: 1200,
    height: 900,
  },
];