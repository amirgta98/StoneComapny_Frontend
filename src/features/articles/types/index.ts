export type Article = {
  /** Unique identifier (used as React key). */
  id: string;
  /** URL-friendly identifier for the article-detail route (future). */
  slug?: string;
  /** Article heading shown on the card. */
  title: string;
  /** Short excerpt/summary shown under the title. */
  description: string;
  /** Cover image URL. */
  image: string;
  /** Accessible description of the cover image. */
  imageAlt?: string;
  /** Publish timestamp (ISO 8601 string). */
  publishedAt: string;
  /**
   * Optional destination of the card link (e.g. the article-detail page);
   * when omitted, the card renders as plain `<article>` without navigation.
   */
  href?: string;
};