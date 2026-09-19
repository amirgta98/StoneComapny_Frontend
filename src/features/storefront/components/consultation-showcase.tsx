import Link from "next/link";

import { Phone } from "lucide-react";

import { Button } from "@/components/ui";

type ConsultationShowcaseProps = {
  /** Section heading inside the box. */
  title?: string;
  /** Supporting description under the heading. */
  description?: string;
  /** Sales/consultation phone number (used for the call CTA). */
  phone?: string;
  /** Label for the "call us" button. */
  callLabel?: string;
  /** Label for the "request consultation" button. */
  requestLabel?: string;
  /** Destination of the "request consultation" CTA. */
  requestHref?: string;
};

/**
 * Drop-in "free consultation" call-to-action banner for storefront pages.
 *
 * A secondary-tinted box (theme `secondary`), centered RTL layout, with a
 * heading, a short reassuring description, a `tel:` call button and a
 * "submit a consultation request" button. Purely presentational — no
 * client JS required.
 *
 * ```tsx
 * <ConsultationShowcase />
 * ```
 */
export function ConsultationShowcase({
  title = "مشاوره رایگان با صنایع سنگ سپنتا جهت انتخاب بهترین سنگ برای پروژه ی شما",
  description =
    "به احتمال زیاد ما سنگ مورد نظر شما را داریم. اگر نتوانستید آن را در سایت پیدا کنید، با کارشناسان ما با شماره 09130000622 تماس بگیرید و سنگ مورد نظر خود را استعلام بگیرید.",
  phone = "09130000622",
  callLabel = "تماس با کارشناسان ما",
  requestLabel = "ارسال درخواست مشاوره",
  requestHref = "/contact",
}: ConsultationShowcaseProps) {
  return (
    <div className="rounded-2xl bg-secondary p-6 text-center sm:p-8 lg:p-10">
      <h2 className="mx-auto max-w-3xl text-lg font-bold leading-snug text-secondary-foreground sm:text-xl lg:text-2xl">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 sm:text-base sm:leading-relaxed">
        {description}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="min-w-56">
          <a href={`tel:${phone}`}>
            <Phone className="size-4" aria-hidden="true" />
            {callLabel}
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="min-w-56"
        >
          <Link href={requestHref}>{requestLabel}</Link>
        </Button>
      </div>
    </div>
  );
}