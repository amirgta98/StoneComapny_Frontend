"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 1 to 5
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  showScore = false,
  className,
}: StarRatingProps) {
  const safeRating = Number.isFinite(rating)
    ? Math.max(0, Math.min(maxStars, rating))
    : 0;
  const roundedRating = Math.round(safeRating);
  const iconClass = sizeClasses[size];

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      dir="ltr"
      aria-label={`امتیاز ${safeRating} از ${maxStars}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const isFilled = index < roundedRating;
          return (
            <Star
              key={index}
              className={cn(
                iconClass,
                "transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
      {showScore && (
        <span
          className="ms-1 font-mono text-xs font-bold text-foreground"
          dir="rtl"
        >
          {safeRating.toLocaleString("fa-IR")}
        </span>
      )}
    </div>
  );
}
