"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type SliderArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  /** Accessible label for the previous button. */
  prevLabel?: string;
  /** Accessible label for the next button. */
  nextLabel?: string;
};

/**
 * Reusable prev/next arrow controls for carousels/sliders.
 *
 * RTL-aware: the "previous" arrow points right (start side in RTL)
 * and the "next" arrow points left (end side in RTL).
 *
 * Designed to be placed inside the `Section` component's `action` slot.
 */
export function SliderArrows({
  onPrev,
  onNext,
  prevLabel = "قبلی",
  nextLabel = "بعدی",
}: SliderArrowsProps) {
  const buttonClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        className={buttonClass}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        className={buttonClass}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}