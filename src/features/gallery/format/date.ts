/**
 * Persian/Jalali date formatting for the gallery.
 *
 * Uses the native `Intl` with the `fa-IR` locale — the same approach the
 * rest of the project uses (e.g. `toLocaleDateString("fa-IR")` in the
 * users/tenants features) — so no extra date dependency is introduced.
 */

/** Long-form date for the modal info panel, e.g. «۱۸ مرداد ۱۴۰۵». */
export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Compact date for tiles/pills, e.g. «۱۸ مرداد». */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
  });
}