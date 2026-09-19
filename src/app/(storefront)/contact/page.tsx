import type { Metadata } from "next";

import { FaqShowcase } from "@/features/storefront";
import {
  ContactChannels,
  ContactFormSection,
  ContactHero,
} from "@/features/storefront";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباطی با صنایع سنگ سپنتا: تلفن، ایمیل و نشانی؛ درخواست مشاوره، استعلام قیمت و همکاری خود را ثبت کنید تا کارشناسان ما با شما تماس بگیرند.",
};

/**
 * /contact — premium contact page, same editorial language as /about.
 *
 * Thin route-level composition (feature-first): the editorial split hero is
 * a client island (motion/react load entrance); the channels section owns a
 * restrained gsap scroll reveal, and the form section composes the shared
 * `Section` primitive with the `ContactForm` client island. The FAQ
 * showcase is reused from the storefront feature with its CTA anchored to
 * the form.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      {/* Page content — flows directly under the light editorial hero */}
      <div className="relative z-10">
        <ContactChannels />
        <ContactFormSection />

        {/* Reused Q&A section — CTA points back to the form anchor */}
        <div className="border-t bg-muted/40">
          <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <FaqShowcase ctaHref="#contact-form" />
          </div>
        </div>
      </div>
    </>
  );
}
