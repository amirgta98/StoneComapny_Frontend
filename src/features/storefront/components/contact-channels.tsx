"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Section } from "./section";

const CONTACT_CHANNELS = [
  {
    title: "تلفن تماس",
    description: "پاسخگویی در ساعات اداری",
    value: "۰۹۱۳۰۰۰۰۶۲۲",
    href: "tel:09130000622",
    hrefLabel: "تماس با کارشناسان",
    Icon: Phone,
  },
  {
    title: "ایمیل",
    description: "ارسال مدارک و درخواست‌های همکاری",
    value: "info@sangsepanta.ir",
    href: "mailto:info@sangsepanta.ir",
    hrefLabel: "ارسال ایمیل",
    Icon: Mail,
  },
  {
    title: "نشانی",
    description: "نمایشگاه و کارخانه فرآوری",
    value: "اصفهان، شهرک صنعتی، بلوار اصلی، مجتمع سنگ سپنتا",
    href: undefined,
    hrefLabel: undefined,
    Icon: MapPin,
  },
  {
    title: "ساعات کاری",
    description: "شنبه تا پنجشنبه",
    value: "۸ صبح تا ۱۷ عصر",
    href: undefined,
    hrefLabel: undefined,
    Icon: Clock,
  },
];

/**
 * Contact channels — four editorial info cards (phone, email, address,
 * working hours).
 *
 * Reveal-on-scroll (once, gsap + ScrollTrigger), same restrained language as
 * the About sections: the section header rises first, then the cards with a
 * short stagger. Without JS (or with `prefers-reduced-motion`) nothing is
 * hidden — the content renders fully visible and the animation never runs.
 */
export function ContactChannels() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from("[data-slot='section-header']", {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
      }).from(
        "[data-anim='channel']",
        { autoAlpha: 0, y: 24, duration: 0.55, stagger: 0.09 },
        "-=0.2"
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="border-y bg-muted/40">
        <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Section
            eyebrow="راه‌های ارتباطی"
            title="از هر راهی که راحت‌ترید"
            description="تلفن، ایمیل یا حضوری — کارشناسان ما آماده پاسخگویی به پرسش‌های شما هستند."
            aria-label="راه‌های ارتباطی با سنگ سپنتا"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {CONTACT_CHANNELS.map((channel) => (
                <div
                  key={channel.title}
                  data-anim="channel"
                  className="flex h-full flex-col rounded-2xl border bg-card p-6 will-change-transform"
                >
                  <div className="flex size-12 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                    <channel.Icon
                      className="size-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold leading-snug">
                    {channel.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {channel.description}
                  </p>
                  <p
                    dir={channel.Icon === Mail ? "ltr" : undefined}
                    className={`mt-3 text-sm leading-relaxed text-foreground ${
                      channel.Icon === Mail ? "text-left" : ""
                    }`}
                  >
                    {channel.value}
                  </p>

                  {channel.href && channel.hrefLabel && (
                    <a
                      href={channel.href}
                      className="mt-auto pt-4 text-sm font-medium text-primary hover:underline"
                    >
                      {channel.hrefLabel}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
