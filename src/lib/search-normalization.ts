/**
 * Normalization utilities for Persian/Arabic B2B search operations.
 * Strictly adheres to Platform Guidelines:
 * 1. Standardizes Arabic Yeh (ي, ى) -> Persian ی, Arabic Kaf (ك) -> Persian ک.
 * 2. Normalizes ZWNJ (\u200c) to space or uniform boundaries.
 * 3. Converts Persian (۰-۹) and Arabic digits (٠-٩) to ASCII (0-9).
 * 4. Normalizes both the haystack and the needle.
 */

export function normalizeSearchTerm(text?: string | null): string {
  if (!text) return "";

  return (
    text
      // Arabic Yeh variants to Persian Yeh
      .replace(/[\u064A\u0649\u06D2\u06CD]/g, "ی")
      // Arabic Kaf to Persian Kaf
      .replace(/[\u0643\u06A9]/g, "ک")
      // Alef variants (آ, أ, إ, ٱ, ٲ, ٳ, ٵ) to plain Alef (ا)
      .replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, "ا")
      // Teh Marbuta & Heh variants to standard Heh
      .replace(/[\u0629\u06C0\u06C1\u06D5]/g, "ه")
      // Arabic / Persian diacritics (harakat / tashkeel / tanween)
      .replace(/[\u064B-\u065F\u0670]/g, "")
      // ZWNJ (\u200c) to space
      .replace(/\u200c/g, " ")
      // Persian digits (۰-۹: \u06F0-\u06F9) to ASCII 0-9
      .replace(/[\u06F0-\u06F9]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 1776 + 48)
      )
      // Arabic digits (٠-٩: \u0660-\u0669) to ASCII 0-9
      .replace(/[\u0660-\u0669]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 1632 + 48)
      )
      // Convert to lowercase
      .toLowerCase()
      // Collapse multiple whitespace characters into a single space
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Checks if a searchable haystack contains a query needle after
 * applying complete Persian/Arabic normalization to both.
 * Supports tokenized matching as well as space/ZWNJ-agnostic compound words
 * (e.g. 'بوکمچ' matches 'بوک‌مچ', 'سنگکاری' matches 'سنگ‌کاری').
 */
export function matchesSearchQuery(
  haystack?: string | null,
  needle?: string | null
): boolean {
  if (!needle || !needle.trim()) return true;
  if (!haystack) return false;

  const normalizedHaystack = normalizeSearchTerm(haystack);
  const normalizedNeedle = normalizeSearchTerm(needle);

  if (!normalizedNeedle) return true;

  const strippedHaystack = normalizedHaystack.replace(/\s+/g, "");
  const strippedNeedle = normalizedNeedle.replace(/\s+/g, "");

  // Fast path: direct inclusion or collapsed compound word inclusion
  if (
    normalizedHaystack.includes(normalizedNeedle) ||
    strippedHaystack.includes(strippedNeedle)
  ) {
    return true;
  }

  // Multi-token search (each query token must match either separated or collapsed)
  const tokens = normalizedNeedle.split(" ").filter(Boolean);
  return tokens.every((token) => {
    const strippedToken = token.replace(/\s+/g, "");
    return (
      normalizedHaystack.includes(token) ||
      (strippedToken.length > 0 && strippedHaystack.includes(strippedToken))
    );
  });
}
