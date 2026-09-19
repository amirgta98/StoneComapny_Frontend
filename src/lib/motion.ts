/**
 * Editorial motion easing — fast start, long silky settle (no bounce).
 *
 * Shared across storefront entrance animations (heroes, editorial page
 * headers). Lives in `lib` so any feature can consume it without
 * creating feature-to-feature dependencies (e.g. products ← storefront).
 */
export const CINEMATIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];