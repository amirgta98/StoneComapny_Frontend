import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layouts";
import { Section } from "@/features/storefront";
import {
  ProductApplications,
  ProductDescription,
  ProductDetailHeader,
  ProductFeatures,
  ProductGallery,
  ProductInfo,
  ProductOrderingInfo,
  ProductPurchasePanel,
  ProductReviews,
  ProductSellerCard,
  ProductSpecifications,
  ProductsSection,
  MobileActionBar,
  getAllProductSlugs,
  getProductDetailBySlug,
  getRelatedProducts,
  getSimilarProducts,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "@/features/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render every known product detail page at build time (test data). */
export function generateStaticParams() {
  return getAllProductSlugs();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: product.name,
    description:
      product.shortDescription ??
      product.descriptionParagraphs?.[0] ??
      `مشخصات، قیمت و تصاویر ${product.name}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Page-local composition helpers — section framing for the detail   */
/*  page uses the same background rhythm as the rest of the site      */
/*  (alternating `bg-background` sections and `bg-muted/40` bands).   */
/* ------------------------------------------------------------------ */

/** Standard storefront section container (background sections). */
function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      {children}
    </div>
  );
}

/** Muted band — same treatment as AboutStats / contact FAQ sections. */
function SectionBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-y bg-muted/40">
      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {children}
      </div>
    </div>
  );
}

/**
 * /stones/[slug] — stone product detail page.
 *
 * Thin route-level composer (feature-first): the server component
 * resolves the product detail and composes reusable feature components
 * into the shared Detail Layout pattern (breadcrumb → editorial header →
 * hero grid → section bands). Section framing reuses the storefront
 * `Section` primitive and the site's alternating background rhythm so
 * the page reads as a sibling of the rest of the storefront.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const similar = getSimilarProducts(product);
  const typeLabel = stoneLabel(STONE_TYPE_LABELS, product.stoneType);

  /* Features carry Lucide icon components, which cannot cross the
     server→client boundary; strip them for the client islands. */
  const { features, ...serializableProduct } = product;

  return (
    <div className="container mx-auto px-4 pb-28 pt-8 sm:px-6 md:pt-10 lg:px-8 lg:pb-16">
      <Breadcrumbs
        items={[
          { label: "خانه", href: "/" },
          { label: "سنگ‌ها", href: "/stones" },
          ...(typeLabel ? [{ label: typeLabel, href: "/stones" }] : []),
          { label: product.name },
        ]}
      />

      {/* Editorial page header — badges, display H1, description, rating */}
      <ProductDetailHeader product={serializableProduct} className="mt-8 md:mt-10" />

      {/* Hero: gallery (visual priority) + information/purchase column */}
      <div className="mt-10 grid items-start gap-8 md:mt-12 lg:grid-cols-2 xl:grid-cols-[1.05fr_1fr] xl:gap-12">
        <div className="relative">
          {/* Offset accent — same editorial frame as the About/Contact heroes */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -start-4 hidden h-full w-full rounded-[2rem] bg-primary/10 lg:block"
          />
          <ProductGallery
            images={product.images}
            name={product.name}
            stageClassName="rounded-2xl"
          />
        </div>

        <div className="space-y-4">
          <ProductInfo variant="summary" product={product} />
          <ProductPurchasePanel product={serializableProduct} />
        </div>
      </div>

      {/* Detail sections — alternating background rhythm, same `Section` language */}
      <div className="mt-14 md:mt-20">
        <SectionContainer>
          {/* Seller-defined dynamic features (data-driven, any count) */}
          <Section eyebrow="چرا این سنگ؟" title="ویژگی‌های محصول">
            <ProductFeatures features={features} />
          </Section>
        </SectionContainer>

        {/* Structured technical data — muted band, like the site's data bands */}
        <SectionBand>
          <Section
            eyebrow="دقت در انتخاب"
            title="مشخصات فنی"
            description="اطلاعات فنی این سنگ بر اساس آزمون‌های استاندارد و مشخصات تیره فعلی."
          >
            <ProductSpecifications product={product} />
          </Section>
        </SectionBand>

        <SectionContainer>
          <Section eyebrow="آشنایی بیشتر" title="معرفی محصول">
            <ProductDescription product={product} />
          </Section>

          <div className="mt-12 md:mt-16">
            <Section eyebrow="جای مناسب برای هر پروژه" title="کاربردها">
              <ProductApplications product={product} />
            </Section>
          </div>
        </SectionContainer>

        {/* Commercial trust + ordering facts — muted band */}
        <SectionBand>
          <Section eyebrow="خرید مطمئن" title="فروشنده و کارخانه">
            <ProductSellerCard seller={product.seller} />
          </Section>

          <div className="mt-12 md:mt-16">
            <Section eyebrow="شرایط خرید" title="اطلاعات سفارش">
              <ProductOrderingInfo product={product} />
            </Section>
          </div>
        </SectionBand>

        <SectionContainer>
          <Section
            eyebrow="نظر خریداران"
            title="دیدگاه‌ها"
            description="امتیازها و تجربه‌های ثبت‌شده توسط خریداران این محصول."
          >
            <div id="reviews">
              <ProductReviews product={product} />
            </div>
          </Section>
        </SectionContainer>

        {/* Related = catalog/category relationship — muted band */}
        <SectionBand>
          <Section
            eyebrow="ادامه این مجموعه"
            title="محصولات مرتبط"
            description="سنگ‌های هم‌خانواده از نظر نوع و دسته‌بندی."
          >
            <ProductsSection
              products={related}
              emptyTitle="محصول مرتبطی یافت نشد"
            />
          </Section>
        </SectionBand>

        {/* Similar = visually/technically close alternatives */}
        <SectionContainer>
          <Section
            eyebrow="گزینه‌های جایگزین"
            title="محصولات مشابه"
            description="انتخاب‌هایی با ظاهر و مشخصات نزدیک به این سنگ."
          >
            <ProductsSection
              products={similar}
              emptyTitle="محصول مشابهی یافت نشد"
            />
          </Section>
        </SectionContainer>
      </div>

      {/* Mobile sticky action bar (below lg) */}
      <MobileActionBar product={serializableProduct} />
    </div>
  );
}