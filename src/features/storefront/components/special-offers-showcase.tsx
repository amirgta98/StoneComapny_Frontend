"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";

import { Badge, Button } from "@/components/ui";
import { ProductCard, type Product } from "@/features/products";

import { Section } from "./section";

import "swiper/css";

/** One countdown unit (value + Persian label). */
type CountdownUnit = {
  value: number;
  label: string;
};

/**
 * Live countdown to the campaign end time.
 *
 * Starts empty and fills after mount to avoid SSR/CSR hydration
 * mismatches (server render time ≠ client render time).
 */
function useCountdown(endsAtIso: string) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(endsAtIso).getTime();

    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAtIso]);

  if (remaining === null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const units: CountdownUnit[] = [
    { value: Math.floor(totalSeconds / 86400), label: "روز" },
    { value: Math.floor((totalSeconds % 86400) / 3600), label: "ساعت" },
    { value: Math.floor((totalSeconds % 3600) / 60), label: "دقیقه" },
    { value: totalSeconds % 60, label: "ثانیه" },
  ];

  return units;
}

/** Compact single-unit box of the countdown. */
function CountdownBox({ unit }: { unit: CountdownUnit }) {
  return (
    <div className="flex min-w-9 flex-col items-center rounded-md border border-border bg-card px-1.5 py-1">
      <span
        aria-hidden="true"
        className="text-sm font-bold leading-none tabular-nums"
      >
        {String(unit.value).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}
      </span>
      <span className="mt-0.5 text-[10px] leading-none text-muted-foreground">
        {unit.label}
      </span>
    </div>
  );
}

type SpecialOffersShowcaseProps = {
  /** Products participating in the campaign (should have compareAtPrice). */
  products: Product[];
  /** Campaign end time (ISO string) driving the live countdown. */
  endsAtIso: string;
  /** Small label shown above the title. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Destination of the "view all" link. */
  viewAllHref?: string;
};

/**
 * Drop-in "Special Offers" section for storefront pages.
 *
 * Layout: `Section` header with a live countdown + "view all" link in
 * the action slot, above a responsive RTL-aware Swiper of compact offer
 * cards (`ProductCard variant="offer"`).
 *
 * ```tsx
 * <SpecialOffersShowcase
 *   products={offerProducts}
 *   endsAtIso={campaignEndIso}
 *   eyebrow="فرصت محدود"
 *   title="فروش ویژه"
 *   viewAllHref="/offers"
 * />
 * ```
 */
export function SpecialOffersShowcase({
  products,
  endsAtIso,
  eyebrow = "فرصت محدود",
  title = "فروش ویژه",
  viewAllHref = "/offers",
}: SpecialOffersShowcaseProps) {
  const countdown = useCountdown(endsAtIso);

  return (
    // Campaign box: a full-width panel tinted with the `primary` theme
    // color so the limited-time offer visually stands out from the
    // surrounding neutral sections.
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6 lg:p-8">
      <Section
        eyebrow={
          <span className="font-medium text-primary">{eyebrow}</span>
        }
        title={
          <span className="flex items-center gap-2">
            {title}
            <Badge className="bg-destructive text-[11px] font-bold text-destructive-foreground">
              داغ
            </Badge>
          </span>
        }
      aria-label="فروش ویژه"
      action={
        <div className="flex items-center gap-3">
          {/* Live campaign countdown */}
          {countdown && (
            <div
              className="flex items-start gap-1"
              role="timer"
              aria-label="زمان باقیمانده فروش ویژه"
            >
              {countdown.map((unit) => (
                <CountdownBox key={unit.label} unit={unit} />
              ))}
            </div>
          )}

          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link href={viewAllHref}>مشاهده همه</Link>
          </Button>
        </div>
      }
    >
      {products.length === 0 ? (
        /* Empty state */
        <div className="rounded-lg border border-dashed border-border py-12 text-center">
          <p className="text-sm font-medium">در حال حاضر فروش ویژه ای فعال نیست</p>
          <p className="mt-1 text-xs text-muted-foreground">
            به زودی با تخفیف های جدید بازمی گردیم.
          </p>
        </div>
      ) : (
        /* Responsive offer slider */
        <Swiper
          modules={[A11y, Keyboard]}
          grabCursor
          keyboard={{ enabled: true }}
          slidesPerView={1.6}
          spaceBetween={10}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 12 },
            768: { slidesPerView: 4, spaceBetween: 14 },
            1024: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="!py-1"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <ProductCard product={product} variant="offer" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      </Section>
    </div>
  );
}
