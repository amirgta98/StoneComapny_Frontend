/**
 * Security formatting utilities
 */

/**
 * Masks an Iranian phone number for safe display.
 * Example: "09123456789" -> "09******6789"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 6) return phone;
  const prefix = cleaned.slice(0, 2);
  const suffix = cleaned.slice(-4);
  const stars = "*".repeat(Math.max(4, cleaned.length - 6));
  return `${prefix}${stars}${suffix}`;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Converts English digits in a string or number to Persian digits.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/**
 * Formats a duration in seconds into MM:SS format with Persian or standard numerals.
 * Example: 45 -> "00:45"
 */
export function formatSecondsToTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedMins = mins.toString().padStart(2, "0");
  const formattedSecs = secs.toString().padStart(2, "0");
  return `${formattedMins}:${formattedSecs}`;
}
