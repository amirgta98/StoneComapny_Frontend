import { testArticles } from "@/features/articles";
import { testCategories } from "@/features/categories";
import { testPartners } from "@/features/partners";
import { testProjects } from "@/features/projects";
import { testProducts } from "@/features/products";
import { testStoneFaqs } from "@/features/storefront/data/test-stone-faqs";
import { testTeam } from "@/features/storefront/data/test-team";
import {
  AdvantagesShowcase,
  AmazingOffersShowcase,
  ArticlesShowcase,
  CategoriesShowcase,
  ConsultationShowcase,
  FacadeStonesArticleShowcase,
  FacadeStonesShowcase,
  FaqShowcase,
  Hero,
  ProductsShowcase,
  ProjectsShowcase,
  StorefrontFooter,
  TeamShowcase,
  TrustedByShowcase,
} from "@/features/storefront";

const heroData = {
  companyName: "صنایع سنگ سپنتا",
  slogan: "جایی که سنگ با هنر ترکیب می‌شود",
  headingLines: ["جایی که سنگ", "با هنر ترکیب می‌شود"],
  description:
    "چهار دهه هم‌نفسی با زمین؛ از دل معادن ایران تا نمایی ماندگار در ساختمان‌های شما.",
  ctas: [
    { label: "مشاهده سنگ‌ها", href: "/stones", variant: "default" },
    { label: "درباره ما", href: "/about", variant: "outline" },
  ],
  media: {
    type: "image",
    url: "/test_images/Hero_1_bg.png",
  },
} as const;

export default function Home() {
  // Exterior-facade suitable stones (travertine, granite, sandstone,
  // limestone, slate, basalt) picked from the shared test catalog.
  const facadeProducts = testProducts.filter((p) =>
    ["travertine", "granite", "sandstone", "limestone", "slate", "basalt"].includes(
      p.stoneType ?? ""
    )
  );

  // Interior-wall suitable stones (marble, onyx, travertine, slate)
  // picked from the shared test catalog.
  const interiorProducts = testProducts.filter((p) =>
    ["marble", "onyx", "travertine", "slate"].includes(p.stoneType ?? "")
  );

  return (
    <main className="w-full">
      <Hero data={heroData}>
        <section className=" bg-background">
          <div className="bg-background">
            <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
              <CategoriesShowcase categories={testCategories} />
            </div>
          </div>

          <section className="relative bg-background">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 z-10 h-[5vh] -translate-y-full bg-background top-0.5"
              style={{
                clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
              }}
            />

            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <AmazingOffersShowcase
                products={testProducts}
                image="/test_images/amazing-offers-percent.svg"
                endsAt="2026-08-28T21:00:00+03:30"
                viewAllHref="/offers"
              />
            </div>
          </section>
          <section className="bg-background">
            <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
              <AdvantagesShowcase
                eyebrow="چرا سپنتا؟"
                title="مزیت های همکاری با ما"
              />
            </div>
          </section>
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6  lg:px-8">
              <ProductsShowcase
                products={testProducts}
                eyebrow="محصولات منتخب"
                title="لیست محصولات فروشگاه"
                description="مجموعه‌ای منتخب از سنگ‌های طبیعی ممتاز؛ مرمر، تراورتن، گرانیت و دیگر مصالح معماری با بهترین کیفیت و قیمت."
                maxVisible={12}
                viewAllHref="/stones"
              />
            </div>
          </section>

          {/* Editorial article about exterior facade stones */}
          <section className="bg-background">
            <div className="container mx-auto px-4 sm:px-6  lg:px-8">
              <FacadeStonesArticleShowcase />
            </div>
          </section>

          {/* Best exterior facade stones — Swiper showcase, theme secondary box */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <div className="rounded-2xl bg-secondary p-4 sm:p-6 lg:p-8">
                <FacadeStonesShowcase
                  products={facadeProducts}
                  eyebrow="انتخاب معمار"
                  title="بهترین سنگ های نمای خارجی"
                />
              </div>
            </div>
          </section>

          {/* All best exterior facade stones — full grid list (ProductsShowcase layout, no search) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <ProductsShowcase
                products={facadeProducts}
                eyebrow="انتخاب معمار"
                title="همه سنگ های نمای خارجی"
                description="فهرست کامل سنگ‌های مناسب برای نماهای ساختمان؛ تراورتن، گرانیت، ماسه‌سنگ، سنگ لایه‌ای و بازالت با کیفیت ممتاز و مقاوم در برابر شرایط جوی."
                maxVisible={12}
                showSearch={false}
                viewAllHref="/stones"
              />
            </div>
          </section>

          {/* Editorial article about interior facade stones */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <FacadeStonesArticleShowcase
                eyebrow="راهنمای انتخاب سنگ"
                title="بهترین سنگ های نمای داخلی؛ جلوه‌ای لوکس در دل خانه"
                subheading="چرا سنگ طبیعی، انتخاب اول طراحان برای دیوارهای داخلی است؟"
                image="/test_images/stones/test_10.jpg"
                imageAlt="اسلب مرمر مناسب برای نمای داخلی"
                paragraphs={[
                  "در فضاهای داخلی، سنگ طبیعی بیش از یک پوشش دیواری نقش ایفا می‌کند؛ تکه‌ای از طبیعت است که به هر فضا عمق، بافت و حس آرامش می‌دهد. دیوارهای سنگی در برابر رطوبت و ضربه مقاوم‌اند، هرگز نیازی به رنگ‌آمیزی مجدد ندارند و ارزش ملک را نیز افزایش می‌دهند؛ به همین دلیل در لابی ساختمان‌ها، دیوار پشت تلویزیون، قاب شومینه و سردر ورودی واحدها جایگاهی ویژه یافته‌اند.",
                  "برای نمای داخلی، مرمر و آنیکس حرف اول را می‌زنند؛ مرمر با رگه‌های متمایزش انتخاب کلاسیک پذیرایی و راهرو است و آنیکس نیمه‌شفاف با نورپردازی از پشت، دیوار تلویزیون یا بار را به یک عنصر نمایشی بدل می‌کند. اگر به جلوه‌ای گرم و روستیک علاقه دارید، تراورتن و سنگ لوح گزینه‌هایی بادوام و اقتصادی برای دیوارهای داخلی هستند و پرداخت مات (هون) نسبت به پولیش بازتاب نور کمتری دارد.",
                ]}
                highlights={[
                  "مقاوم در برابر رطوبت، ضربه و فشار روزمره؛ بدون نیاز به تعمیر سالانه",
                  "امکان نورپردازی از پشت با سنگ آنیکس نیمه‌شفاف",
                  "تنوع پرداخت از پولیش براق تا هون مات، متناسب با نور فضا",
                ]}
              />
            </div>
          </section>

          {/* All best interior facade stones — full grid list (ProductsShowcase layout, no search) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ProductsShowcase
                products={interiorProducts}
                eyebrow="انتخاب طراحان"
                title="همه سنگ های نمای داخلی"
                description="فهرست کامل سنگ‌های پیشنهادی برای نماهای داخلی ساختمان؛ مرمر، آنیکس، تراورتن و سنگ لوح با پرداخت ممتاز برای پذیرایی، لابی و دیوار تلویزیون."
                maxVisible={12}
                showSearch={false}
                viewAllHref="/stones"
              />
            </div>
          </section>

          {/* Latest articles — knowledge/editorial cards */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <ArticlesShowcase
                articles={testArticles}
                eyebrow="دانستنی های سنگ"
                title="آخرین مقالات"
                description="راهنمای انتخاب، نگهداری و روندهای روز سنگ طبیعی را از زبان کارشناسان ما بخوانید."
                viewAllHref="/articles"
              />
            </div>
          </section>

          {/* Q&A / FAQ — why Sepna (intro + single-open accordion) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <FaqShowcase />
            </div>
          </section>

          {/* Completed projects — Swiper showcase (kept as the last section for now) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <ProjectsShowcase
                projects={testProjects}
                viewAllHref="/projects"
              />
            </div>
          </section>

          {/* Free consultation banner — theme secondary box */}
          <section className="bg-background">
            <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
              <ConsultationShowcase />
            </div>
          </section>

          {/* Companies that trusted us — Swiper logo strip (last section) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
              <TrustedByShowcase partners={testPartners} />
            </div>
          </section>

          {/* Stone Q&A — full-width section (accordion only) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
              <FaqShowcase
                faqs={testStoneFaqs}
                showIntro={false}
              />
            </div>
          </section>

          {/* Sales & consultants team — Swiper showcase (last section) */}
          <section className="bg-background">
            <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
              <TeamShowcase
                members={testTeam}
                title="تیم فروش و مشاورین صنایع سنگ سپنتا"
              />
            </div>
          </section>

          {/* Footer — rendered inside the page content layer so it sits at
              the very bottom, below the hero sliding content. The layout's
              ConditionalFooter skips this route to avoid a hidden duplicate. */}
          <StorefrontFooter />
        </section>
      </Hero>
    </main>
  );
}
