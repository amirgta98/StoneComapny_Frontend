/**
 * Splits a company name into the words before the last word and the last word.
 *
 * Example:
 *   "Mirzaei Stone"  → { remaining: ["Mirzaei"], last: "Stone" }
 *   "Sang"           → { remaining: [], last: "Sang" }
 *   ""               → { remaining: [], last: "" }
 */
export function splitCompanyName(name: string): {
  remaining: string[];
  last: string;
} {
  const words = name.trim().split(/\s+/);
  if (words.length === 0 || (words.length === 1 && words[0] === "")) {
    return { remaining: [], last: "" };
  }
  const last = words[words.length - 1];
  const remaining = words.slice(0, -1);
  return { remaining, last };
}

/**
 * Returns the second-to-last word of a slogan, or `null` if there are
 * fewer than two words.
 *
 * Examples:
 *   "We create timeless spaces" → "timeless"
 *   "Modern Architecture"       → "Modern"
 *   "Innovation"                → null
 *   ""                          → null
 */
export function getSecondLastWord(slogan: string): string | null {
  const words = slogan.trim().split(/\s+/);
  if (words.length < 2) return null;
  return words[words.length - 2] ?? null;
}

/**
 * Produces a renderable plan for the slogan so that the second-to-last word
 * can be rendered with an accent color without hardcoding.
 *
 * Returns an array of `{ word, accent }` tokens.
 */
export function splitSloganWithAccent(slogan: string): {
  word: string;
  accent: boolean;
}[] {
  const words = slogan.trim().split(/\s+/);
  if (words.length === 0 || (words.length === 1 && words[0] === "")) {
    return [];
  }
  const accentIndex = words.length - 2;
  return words.map((word, index) => ({
    word,
    accent: index === accentIndex,
  }));
}