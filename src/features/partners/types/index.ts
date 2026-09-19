export type Partner = {
  /** Unique identifier (used as React key). */
  id: string;
  /** Partner/company name shown on the card. */
  title: string;
  /** Logo or representative image URL. */
  image: string;
  /** Accessible description of the image. */
  imageAlt?: string;
  /**
   * Optional destination (e.g. the partner's site or a project page);
   * when omitted, the card renders without navigation.
   */
  href?: string;
};