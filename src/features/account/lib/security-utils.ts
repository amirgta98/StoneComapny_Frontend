/**
 * Mask an Iranian mobile phone number for secure display:
 * 09123456789 -> 09******6789
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "—";
  const cleaned = phone.trim();
  if (cleaned.length === 11 && cleaned.startsWith("09")) {
    return `${cleaned.slice(0, 2)}******${cleaned.slice(-4)}`;
  }
  if (cleaned.length >= 7) {
    return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
  }
  return phone;
}
