import type { Currency, ExpenseCategory, NoteColor } from "./types";

export const NOTE_COLORS: Record<NoteColor, string> = {
  yellow: "#FFE27A",
  peach: "#FFC9A3",
  mint: "#C8F3D2",
  pink: "#FFD0E0",
  sky: "#CDE9FF",
  lavender: "#E3D6FF",
};

export const LINK_COLORS = [
  "#FFD54F",
  "#FF8A3D",
  "#FF6B8A",
  "#4ECDC4",
  "#7C9CFF",
  "#B388FF",
  "#FFB347",
  "#80D8C3",
];

export const EMOJIS = ["🌟", "📌", "🛒", "💬", "📚", "🎵", "🏠", "💼", "🎮", "☕", "🌈", "🚀"];

export const CATEGORIES: Record<
  ExpenseCategory,
  { label: string; emoji: string; color: string }
> = {
  food: { label: "طعام", emoji: "🍔", color: "#FF8A3D" },
  transport: { label: "مواصلات", emoji: "🚗", color: "#7C9CFF" },
  shopping: { label: "تسوق", emoji: "🛍️", color: "#FF6B8A" },
  bills: { label: "فواتير", emoji: "💡", color: "#FFB347" },
  fun: { label: "ترفيه", emoji: "🎉", color: "#B388FF" },
  health: { label: "صحة", emoji: "💊", color: "#4ECDC4" },
  other: { label: "أخرى", emoji: "✨", color: "#80D8C3" },
};

export const CURRENCIES: Currency[] = [
  { code: "JOD", label: "دينار أردني", symbol: "د.أ" },
  { code: "SAR", label: "ريال سعودي", symbol: "ر.س" },
  { code: "AED", label: "درهم إماراتي", symbol: "د.إ" },
  { code: "EGP", label: "جنيه مصري", symbol: "ج.م" },
  { code: "USD", label: "دولار", symbol: "$" },
  { code: "EUR", label: "يورو", symbol: "€" },
];

export function uid() {
  return crypto.randomUUID();
}

export function todayISO() {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function formatMoney(amount: number, currency: Currency) {
  const value = new Intl.NumberFormat("ar-JO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${value} ${currency.symbol}`;
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatTime(ts: number) {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function notePreview(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 90);
}

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
