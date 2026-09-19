import { GalleryPage } from "@/features/storefront";

/**
 * /collections — stone scenario gallery (images + videos) in an editorial
 * masonry layout. Wrapped by the (storefront) layout so the header/footer
 * chrome is preserved. GalleryPage handles its own data fetching (test mock);
 * swap `testGallery` for a real source without touching this route.
 */
export default function CollectionsPage() {
  return <GalleryPage />;
}
