export type TeamMember = {
  /** Unique identifier (used as React key). */
  id: string;
  /** Member's full name. */
  name: string;
  /** Job title / role shown as the card badge. */
  role: string;
  /** Portrait photo URL. */
  image: string;
  /** Accessible description of the photo. */
  imageAlt?: string;
};

/**
 * Temporary test data for development/preview purposes.
 * Will be replaced by real team data from tenant settings.
 *
 * `role` is the member's job title and is shown as a tag/badge on the
 * card. Portrait images use the local test folder `public/test_images/emploies`.
 */
export const testTeam: TeamMember[] = [
  {
    id: "tm1",
    name: "مهندس محمد رضایی",
    role: "مدیر فروش و بازرگانی",
    image: "/test_images/emploies/1.png",
  },
  {
    id: "tm2",
    name: "سارا احمدی",
    role: "مشاور ارشد سنگ نما",
    image: "/test_images/emploies/2.png",
  },
  {
    id: "tm3",
    name: "امیر کریمی",
    role: "مشاور کفپوش و فضای داخلی",
    image: "/test_images/emploies/3.png",
  },
  {
    id: "tm4",
    name: "نگار موسوی",
    role: "کارشناس استعلام قیمت",
    image: "/test_images/emploies/4.png",
  },
];