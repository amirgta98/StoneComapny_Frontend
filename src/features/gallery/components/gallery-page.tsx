import { GalleryGrid } from "./gallery-grid";
import { testGallery } from "../data/test-gallery";
import type { GalleryItem } from "../types";
import { ConsultationShowcase } from "@/features/storefront";

/**
 * Gallery landing page (Server Component).
 *
 * Thin route-level composer — data + layout only. Presentation lives in
 * `GalleryGrid` (the `react-masonry-css` client island), per the feature-first
 * rule of keeping `app/` thin. Swap `testGallery` for a real query source
 * without touching presentation.
 */
export function GalleryPage() {
  const items: GalleryItem[] = testGallery;

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            گالری سناریوهای سنگ سپنتا
          </h1>
          <p className="mt-3 text-muted-foreground">
            مجموعه تصویر و ویدیو از پروژه‌های انجام‌شده، فرآیند تولید و
            نمونه‌کارهای سنگ‌های طبیعی مرمر، تراورتن، گرانیت و آنیکس.
          </p>
        </header>

        <GalleryGrid items={items} />
                  <section className="bg-background">
                    <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
                      <ConsultationShowcase />
                    </div>
                  </section>
        
      </div>
    </section>
  );
}
