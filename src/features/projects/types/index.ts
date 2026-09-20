export type ProjectCategoryKey =
  | "all"
  | "facade"
  | "lobby"
  | "floor"
  | "wall"
  | "pool"
  | "stairs";

export type ProjectStoneCategory =
  | "all"
  | "travertine"
  | "marble"
  | "granite"
  | "onyx"
  | "limestone"
  | "sandstone";

export type StoneDetailItem = {
  name: string;
  type: string;
  finish: string;
  thickness: string;
  quarry?: string;
};

export type ProjectGalleryImage = {
  url: string;
  caption?: string;
};

export type Project = {
  /** Unique identifier (used as React key). */
  id: string;
  /** URL slug for the detail page. */
  slug: string;
  /** Project heading shown on the card. */
  title: string;
  /** Cover photo URL. */
  image: string;
  /** Accessible description of the cover photo. */
  imageAlt?: string;
  /** Publish timestamp (ISO 8601 string). */
  publishedAt: string;
  /**
   * Optional destination of the card's "view more" link (e.g. the
   * project-detail page); when omitted, no CTA is rendered on the card.
   */
  href?: string;
  /** Categorization key for filtering (e.g. 'facade', 'lobby', 'floor', etc.) */
  category: "facade" | "lobby" | "floor" | "wall" | "pool" | "stairs";
  /** Persian label for category */
  categoryTitle: string;
  /** Primary stone type name (e.g. 'تراورتن عباس‌آباد') */
  stoneType: string;
  /** Stone family category */
  stoneCategory: "travertine" | "marble" | "granite" | "onyx" | "limestone" | "sandstone";
  /** Granular stone specifications used in the project */
  stoneDetails?: StoneDetailItem[];
  /** Geographic location of the project (e.g. 'تهران، الهیه') */
  location: string;
  /** City name for location filtering */
  city: string;
  /** Execution year in Persian (e.g. '۱۴۰۴') */
  year: string;
  /** Total stone surface area (e.g. '۳٬۵۰۰ متر مربع') */
  area: string;
  /** Employer or project owner name */
  client: string;
  /** Architect or design studio name */
  architect?: string;
  /** Detailed architectural & stone execution narrative */
  description: string;
  /** Key technical & aesthetic highlights */
  highlights: string[];
  /** High-resolution project gallery images */
  gallery?: ProjectGalleryImage[];
  /** Architect / Employer testimonial */
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  /** Whether to highlight on showcase/hero */
  featured?: boolean;
};

export type ProjectFilterState = {
  query: string;
  category: ProjectCategoryKey;
  stoneCategory: ProjectStoneCategory;
  city: string;
};