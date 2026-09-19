import type { Discount, DiscountStats } from "../types";

/**
 * Format a number to Persian/Farsi digits with locale separators.
 */
export function formatPersianNumber(value: number | string): string {
  if (value === null || value === undefined) return "";
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString("fa-IR");
}

/**
 * Format currency in Tomans with Persian digits.
 */
export function formatToman(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("fa-IR")} تومان`;
}

/**
 * Format an ISO date string into standard Persian (Shamsi) date format.
 */
export function formatPersianDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Checks if a discount has passed its expiration date.
 */
export function isDiscountExpired(discount: Pick<Discount, "endAt">): boolean {
  if (!discount.endAt) return false;
  const now = new Date();
  const end = new Date(discount.endAt);
  return end.getTime() < now.getTime();
}

/**
 * Get display value for discount (e.g. "۱۵٪" or "۵,۰۰۰,۰۰۰ تومان").
 */
export function getDiscountValueDisplay(discount: Pick<Discount, "type" | "value">): string {
  if (discount.type === "PERCENTAGE") {
    return `${discount.value.toLocaleString("fa-IR")}٪`;
  }
  return formatToman(discount.value);
}

/**
 * Compute aggregate statistics across discounts.
 */
export function calculateDiscountStats(discounts: Discount[]): DiscountStats {
  const total = discounts.length;
  let active = 0;
  let expired = 0;
  let percentageSum = 0;
  let percentageCount = 0;

  for (const d of discounts) {
    const isExpired = isDiscountExpired(d);
    if (isExpired || d.status === "EXPIRED") {
      expired++;
    } else if (d.status === "ACTIVE") {
      active++;
    }

    if (d.type === "PERCENTAGE") {
      percentageSum += d.value;
      percentageCount++;
    }
  }

  const averageRate = percentageCount > 0 ? Math.round(percentageSum / percentageCount) : 0;

  return {
    total,
    active,
    expired,
    averageRate,
  };
}
