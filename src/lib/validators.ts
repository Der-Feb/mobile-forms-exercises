export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => /^\+?[0-9]{9,15}$/.test(v.replace(/[\s-]/g, ''));
export const isBlank = (v: string) => v.trim().length === 0;
export const isNumeric = (v: string) => /^\d+(\.\d+)?$/.test(v.trim());

// Parses 'YYYY-MM-DD'. Returns null for bad formats and impossible dates like 2026-02-31.
export function parseISODate(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  const roundTrips =
    date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
  return roundTrips ? date : null;
}
export const isDigits = (v: string) => /^\d+$/.test(v);