import { CheckCircle2 } from "lucide-react";

import { Section } from "./section";

import { ContactForm } from "./contact-form";

const FORM_SIDE_POINTS = [
  "پاسخ‌گویی حداکثر یک روز کاری پس از ثبت درخواست",
  "مشاوره تخصصی انتخاب سنگ متناسب با کاربری پروژه",
  "استعلام قیمت به‌روز بر اساس ابعاد و فرآوری موردنیاز",
];

/**
 * Contact form section — editorial RTL split like `FaqShowcase`:
 * - Start (right): section header + trust copy (why/what happens after).
 * - End (left): the `ContactForm` client island.
 * On mobile the intro stacks above the form, matching the DOM order.
 *
 * Server Component by design; interactivity lives entirely inside
 * `ContactForm` to keep client JS minimal.
 */
export function ContactFormSection() {
  return (
    <div id="contact-form" className="scroll-mt-24">
      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Section
          eyebrow="ارسال درخواست"
          title="درخواست خود را ثبت کنید"
          description="فرم زیر را پر کنید تا کارشناسان ما با شما تماس بگیرند؛ برای پاسخ سریع‌تر از تلفن استفاده کنید."
          aria-label="فرم تماس با سنگ سپنتا"
        >
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* Intro/trust — first in DOM → right side under RTL */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold leading-snug sm:text-xl">
                درخواست شما، مسیر انتخاب سنگ را کوتاه می‌کند
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                کافی است موضوع و توضیح کوتاهی از پروژه‌تان بنویسید؛ کارشناسان
                سپنتا با پیشنهاد دقیق — از جنس و فرآوری تا ابعاد و قیمت — با
                شما تماس می‌گیرند.
              </p>

              <ul className="space-y-3 pt-1">
                {FORM_SIDE_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm leading-relaxed sm:text-base"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form — second in DOM → left side under RTL */}
            <ContactForm />
          </div>
        </Section>
      </div>
    </div>
  );
}
