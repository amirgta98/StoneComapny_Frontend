export type Project = {
  /** Unique identifier (used as React key). */
  id: string;
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
};