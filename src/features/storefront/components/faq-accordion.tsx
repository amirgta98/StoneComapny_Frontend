"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FaqItem } from "../data/test-faqs";

type FaqAccordionProps = {
  /** FAQ list (question + answer pairs), rendered in the given order. */
  items: FaqItem[];
};

/**
 * Single-open FAQ accordion — Client Component.
 *
 * A deliberately tiny interactive island: only this component hydrates on
 * the client while its parent showcase stays server-rendered. The state is
 * a single `activeIndex`, so two items can never be open at once; the first
 * item starts open and clicking an open item collapses it.
 *
 * Expand/collapse is purely CSS-driven via the `grid-template-rows` trick
 * (no runtime measuring), which animates smoothly regardless of content
 * height; the chevron rotation shares the same duration/easing so both move
 * together. Native `<button>` triggers keep keyboard and touch interaction
 * free of extra wiring.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  // One slot for the open item — `null` means "all collapsed".
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        const triggerId = `faq-${item.id}-trigger`;
        const panelId = `faq-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border bg-card transition-colors duration-300",
              isOpen
                ? "border-primary/40 shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-accent/30"
            )}
          >
            {/* Question — semantic heading wrapping a real button */}
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-start text-sm font-bold leading-snug focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5 sm:text-base"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 text-primary transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </h3>

            {/* Answer — height animated through grid-template-rows */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "p-4 pt-0 text-sm leading-relaxed text-muted-foreground transition-opacity duration-200 ease-in-out motion-reduce:transition-none sm:p-5 sm:pt-0",
                    isOpen ? "opacity-100 delay-100" : "opacity-0"
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}