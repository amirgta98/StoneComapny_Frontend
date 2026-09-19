/**
 * Gallery feature.
 *
 * Presents a masonry gallery of stone images and videos in an editorial
 * layout, with a detail modal per item. Data is intentionally decoupled
 * from the UI so the mock `testGallery` list can later be replaced by an
 * API/query source without touching presentation.
 */
export { GalleryPage } from "./components/gallery-page";
export type { GalleryItem, GalleryPageProps } from "./types";