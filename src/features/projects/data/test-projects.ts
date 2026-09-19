import type { Project } from "../types";

/**
 * Temporary test data for development/preview purposes.
 * Will be replaced by real data from queries/actions.
 *
 * `publishedAt` values are ISO 8601 timestamps (+03:30 Tehran offset)
 * rendered as long-form Jalali dates via `toLocaleDateString("fa-IR")`.
 * The list is ordered newest-first.
 */
export const testProjects: Project[] = [
  {
    id: "pr1",
    title: "سنگ‌کاری نمای بیرونی برج اداری آرمان، تهران",
    image: "/test_images/stones/test_2.jpg",
    publishedAt: "2026-08-12T09:00:00+03:30",
    href: "/projects/commercial-tower-arman",
  },
  {
    id: "pr2",
    title: "لابی مرمر اسلب مجتمع مسکونی مهتاب، اصفهان",
    image: "/test_images/stones/test_10.jpg",
    publishedAt: "2026-07-25T11:30:00+03:30",
    href: "/projects/residential-mahtab-lobby",
  },
  {
    id: "pr3",
    title: "فرش گرانیت سالن غذاخوری هتل بین‌المللی کوروش",
    image: "/test_images/stones/test_3.jpg",
    publishedAt: "2026-07-02T14:15:00+03:30",
    href: "/projects/hotel-cyrus-floor",
  },
  {
    id: "pr4",
    title: "دیوار نورپردازی‌شده آنیکس فروشگاه مرکزی زرین",
    image: "/test_images/stones/test_4.jpg",
    publishedAt: "2026-06-18T08:45:00+03:30",
    href: "/projects/zarrin-onyx-wall",
  },
  {
    id: "pr5",
    title: "سنگ‌کاری استخر و محوطه ویلای شخصی دماوند",
    image: "/test_images/stones/test_6.jpg",
    publishedAt: "2026-05-29T16:20:00+03:30",
    href: "/projects/damavand-villa-pool",
  },
  {
    id: "pr6",
    title: "پله و کف تراورتن ورودی دانشگاه آزاد شیراز",
    image: "/test_images/stones/test_5.jpg",
    publishedAt: "2026-05-06T10:10:00+03:30",
    href: "/projects/shiraz-university-steps",
  },
];