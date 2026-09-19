import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  BadgeCheck,
  Store,
} from "lucide-react";

import { storefrontNav } from "@/config";
import { STONE_TYPE_LABELS } from "@/features/products";

/** Footer quick-link groups (kept out of the layout for readability). */
const FOOTER_LINKS = {
  navigation: storefrontNav,
  stones: [
    { href: "/stones?type=marble", label: STONE_TYPE_LABELS.marble },
    { href: "/stones?type=travertine", label: STONE_TYPE_LABELS.travertine },
    { href: "/stones?type=granite", label: STONE_TYPE_LABELS.granite },
    { href: "/stones?type=onyx", label: STONE_TYPE_LABELS.onyx },
    { href: "/stones?type=slate", label: STONE_TYPE_LABELS.slate },
    { href: "/stones?type=sandstone", label: STONE_TYPE_LABELS.sandstone },
  ],
} as const;

/**
 * Trust/certificate badges footer (اینماد، ترب، ...).
 * `title` is the accessibility label; `icon` is the lucide glyph shown as
 * a placeholder until real certificate logos are available.
 */
const CERTIFICATES: { title: string; icon: typeof ShieldCheck }[] = [
  { title: "نماد اعتماد الکترونیکی (اینماد)", icon: ShieldCheck },
  { title: "اعتبار ترب", icon: Award },
  { title: "گواهی کیفیت", icon: BadgeCheck },
  { title: "مقام تخصصی سنگ", icon: Store },
];

/**
 * Storefront footer — Server Component (no client JS).
 *
 * Renders a full-width, responsive footer with brand/contact info,
 * navigation links, a stone-types shortcut column, and a trust/certificate
 * (اینماد، ترب، ...) area. Uses only theme tokens and the shared nav data.
 */
export function StorefrontFooter({
  companyName = "صنایع سنگ سپنتا",
  slogan = "سنگ طبیعی، زیبایی ماندگار",
  phone = "09130000622",
  email = "info@sepna-stone.ir",
  address = "تهران، خیابان آزادی، بازار سنگ",
}: {
  companyName?: string;
  slogan?: string;
  phone?: string;
  email?: string;
  address?: string;
}) {
  const year = new Date().getFullYear().toLocaleString("fa-IR");

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + contact */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-lg font-bold tracking-tight">
                {companyName}
              </span>
              <p className="text-sm text-muted-foreground">{slogan}</p>
            </div>

            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`tel:${phone}`} className="transition-colors hover:text-foreground" dir="ltr">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${email}`} className="transition-colors hover:text-foreground" dir="ltr">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <FooterLinkColumn title="دسترسی سریع">
            {FOOTER_LINKS.navigation.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.title}
              </FooterLink>
            ))}
          </FooterLinkColumn>

          {/* Stone types */}
          <FooterLinkColumn title="انواع سنگ">
            {FOOTER_LINKS.stones.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterLinkColumn>

          {/* Certificates / trust badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">اعتماد و افتخارات</h3>
            <div className="grid grid-cols-2 gap-3">
              {CERTIFICATES.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={cert.title}
                    role="img"
                    aria-label={cert.title}
                    title={cert.title}
                    className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-accent/30 text-center"
                  >
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                      {cert.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              پاسخگویی شنبه تا پنجشنبه، ۹ تا ۱۷
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {companyName} — کلیه حقوق محفوظ است.</p>
          <p>ساخته‌شده با عشق برای صنعت سنگ ایران</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}