/** A single media element shown in the gallery. */
export type GalleryItem = {
  /** Unique identifier (used as React key). */
  id: string;
  /** Media kind — drives rendering (image vs. video player/poster). */
  type: "image" | "video";
  /** Item heading shown on the card and in the modal. */
  title: string;
  /** Optional supporting text shown in the modal. */
  description?: string;
  /** Publish timestamp (ISO 8601 string). */
  uploadedAt: string;
  /** Image URL, or video source URL for `type: "video"`. */
  src: string;
  /**
   * Poster/thumbnail shown in the grid (and behind the video player) so
   * video streams are not loaded for every grid item.
   */
  thumbnail?: string;
  /** Intrinsic media width (used to reserve layout space / aspect). */
  width?: number;
  /** Intrinsic media height (used to reserve layout space / aspect). */
  height?: number;
};

export type GalleryPageProps = {
  items: GalleryItem[];
};