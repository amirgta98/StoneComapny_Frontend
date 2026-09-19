/**
 * Value object representing stone dimensions and geometry.
 */
export interface StoneDimensions {
  lengthCm: number;
  widthCm: number;
  thicknessCm: number;
}

export function calculateAreaSqm(lengthCm: number, widthCm: number): number {
  if (lengthCm <= 0 || widthCm <= 0) return 0;
  return Number(((lengthCm * widthCm) / 10000).toFixed(3));
}

export function formatStoneDimensions(
  dims?: Partial<StoneDimensions>,
  fallback = "طولی آزاد"
): string {
  if (!dims || !dims.lengthCm || !dims.widthCm) return fallback;
  const th = dims.thicknessCm ? ` × ${dims.thicknessCm}cm` : "";
  return `${dims.lengthCm} × ${dims.widthCm} سانتی‌متر${th}`;
}
