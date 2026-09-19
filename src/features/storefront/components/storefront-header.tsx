"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Globe } from "lucide-react";
import { useTheme } from "@/providers";
import { storefrontNav } from "@/config";
import { CartTrigger } from "@/features/cart";
import { MobileNav } from "./mobile-nav";
import { AuthAreaLink } from "./auth-area-link";

type StorefrontHeaderProps = {
  slogan?: string;
  backgroundImage?: string;
  logo?: string;
  companyName?: string;
};

/**
 * Extra scroll distance (in px) after the WHOLE header (slogan + nav) has
 * completely left the viewport before the fixed navbar slides down from the
 * top. Increase/decrease this single value to tune how long the navbar stays
 * hidden after the header scrolls away.
 */
const NAV_REVEAL_DELAY_PX = 400;

export function StorefrontHeader({
  slogan,
  backgroundImage,
  logo,
  companyName,
}: StorefrontHeaderProps) {
  const { tokens } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- Scroll behavior -----------------------------------------------------------------
  // State model:
  //   1. Normal header      : isFixed = false                       (everything in flow)
  //   2. Waiting/delay      : isFixed = true,  isVisible = false    (parked above viewport)
  //   3. Fixed-and-visible  : isFixed = true,  isVisible = true     (slid down, pinned)
  // Restoring to normal happens when the user scrolls back up to (or above) the
  // scroll position at which the navbar detached, or reaches the very top.
  const navRef = useRef<HTMLElement | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Live nav height so the spacer exactly reserves its space while fixed
  // (handles responsive breakpoints and the expandable mobile search bar).
  const [navHeight, setNavHeight] = useState(0);

  // Mirrors of state for use inside the passive scroll handler (no stale closures)
  const isFixedRef = useRef(false);
  // Scroll position at the moment the navbar detached. Used as the restore
  // threshold so the navbar only returns to normal flow once the original
  // header is scrolled back into (or above) the viewport.
  const detachScrollYRef = useRef(Number.POSITIVE_INFINITY);

  // Track the nav's height continuously (works whether the nav is in flow or
  // fixed, so the spacer updates if e.g. the mobile search expands).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const updateHeight = () => setNavHeight(nav.offsetHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // Play the slide-down animation after the navbar becomes fixed: first paint
  // it at translateY(-100%) (no transition yet), then flip to translateY(0)
  // on the following frame so the CSS transition actually runs.
  // Note: isVisible is guaranteed to be false at this point (it is only ever
  // set true below), so no synchronous reset is needed here.
  useEffect(() => {
    if (!isFixed) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isFixed]);

  // Single rAF-throttled scroll handler driving the whole state machine.
  useEffect(() => {
    let ticking = false;

    const evaluate = () => {
      ticking = false;
      const y = window.scrollY;

      if (!isFixedRef.current) {
        // Navbar is still in normal document flow: measure the header's bottom
        // edge live. Because the header is in flow, this measurement is always
        // accurate (late-loading images, font swaps, breakpoint changes, etc.
        // can never invalidate the threshold). No recalculation happens while
        // the navbar is detached.
        const nav = navRef.current;
        if (!nav) return;
        const headerBottom =
          nav.getBoundingClientRect().bottom + y;
        if (y > headerBottom + NAV_REVEAL_DELAY_PX) {
          detachScrollYRef.current = y;
          isFixedRef.current = true;
          setIsFixed(true); // mounts hidden (-translate-y-full), then animates in
        }
      } else if (y === 0 || y <= detachScrollYRef.current) {
        // User scrolled back up to the detach point (or the very top):
        // restore the original normal-flow header and drop the spacer.
        isFixedRef.current = false;
        detachScrollYRef.current = Number.POSITIVE_INFINITY;
        setIsVisible(false);
        setIsFixed(false);
      }
    };

    const requestEvaluate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluate);
      }
    };

    evaluate();
    window.addEventListener("scroll", requestEvaluate, { passive: true });
    window.addEventListener("resize", requestEvaluate);
    return () => {
      window.removeEventListener("scroll", requestEvaluate);
      window.removeEventListener("resize", requestEvaluate);
    };
  }, []);

  return (
    <header className="relative">
      {/* Slogan banner with background image */}
      <div
        className="relative flex items-center justify-center px-4 py-4 "
        style={{
          background: backgroundImage
            ? `url(${backgroundImage}) center/cover no-repeat`
            : tokens.secondary,
          color: backgroundImage ? "#fff" : tokens.secondaryForeground,
        }}
      >
        {/* Overlay for readability when image is present */}
        {backgroundImage && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/40"
          />
        )}
        <div className="relative z-10 text-center">
          <h1
            className="text-sm font-bold tracking-tight md:text-lg "
            style={{ fontFamily: tokens.fontHeading }}
          >
            {slogan || companyName || "سنگ طبیعی"}
          </h1>
        </div>
      </div>

      {/* Spacer that reserves exactly the nav's current height while it is
          fixed, preventing any layout shift. It only exists while detached. */}
      {isFixed && <div aria-hidden="true" style={{ height: navHeight }} />}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`border-b ${
          isFixed
            ? "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out"
            : "relative z-30"
        } ${isFixed && !isVisible ? "-translate-y-full" : "translate-y-0"}`}
        style={{
          background: tokens.background,
          borderColor: tokens.border,
          color: tokens.foreground,
        }}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Right side: hamburger + logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="باز کردن منو"
              className="p-2 rounded-md hover:bg-muted transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={companyName || "لوگو"}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span
                  className="text-lg font-bold tracking-tight"
                  style={{ color: tokens.primary, fontFamily: tokens.fontHeading }}
                >
                  {companyName || "سنگ"}
                </span>
              )}
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {storefrontNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Left side: auth + cart + language */}
          <div className="flex items-center gap-2">
            {/* Auth area — swaps between the login link and a dashboard link
                depending on the session (access-control skill §7 + §8). Uses
                the new `redirect` param the middleware sets (skill §8.1). */}
            <AuthAreaLink />

            {/* Cart */}
            <CartTrigger />

            {/* Language switch */}
            <button
              type="button"
              aria-label="تغییر زبان"
              className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">فا</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={storefrontNav}
        slogan={slogan}
      />
    </header>
  );
}