/**
 * Indian formats, done once and done right. Pure functions with no React, so they
 * also work on servers and in tests: `import { formatINR } from "@brahmastra/headless/format"`.
 */

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inrPaise = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const grouped = new Intl.NumberFormat("en-IN");

/** ₹1,24,999. Whole rupees by default; pass `{ paise: true }` on bills: ₹1,24,999.50 */
export function formatINR(amount: number, options: { paise?: boolean } = {}): string {
  return (options.paise ? inrPaise : inr).format(amount);
}

/** 1,24,999 — lakh and crore grouping, no currency. */
export function formatIndianNumber(value: number): string {
  return grouped.format(value);
}

/**
 * Short Indian counts for tight spaces: 950 → "950", 1,200 → "1.2K", 1,50,000 → "1.5L", 2,30,00,000 → "2.3Cr".
 * Indian apps say K below a lakh, then L (lakh) and Cr (crore), never M or B.
 */
export function formatCompactIndian(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  const fmt = (n: number, unit: string) => `${sign}${trim(n)}${unit}`;
  if (abs >= 1e7) return fmt(abs / 1e7, "Cr");
  if (abs >= 1e5) return fmt(abs / 1e5, "L");
  if (abs >= 1e3) return fmt(abs / 1e3, "K");
  return `${sign}${abs}`;
}
const trim = (n: number) => (Math.floor(n * 10) / 10).toString();

/** Keeps only digits and drops a leading +91, 91 or 0, so pasted numbers just work. */
export function normalizeIndianMobile(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** "9876543210" → "98765 43210", the way Indians read and say mobile numbers. */
export function formatIndianMobile(input: string): string {
  const d = normalizeIndianMobile(input);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

/** Indian mobile numbers are 10 digits and start with 6, 7, 8 or 9. */
export function isValidIndianMobile(input: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(input));
}

/** Percentage saved, rounded down so we never over-promise: (350, 280) → 20 */
export function savingPercent(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.floor(((mrp - price) / mrp) * 100);
}
