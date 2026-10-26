"use client";

import { CURRENCIES } from "./format";
import type { Expense, Note, QuickLink, Settings } from "./types";

const KEYS = {
  notes: "nota:notes",
  expenses: "nota:expenses",
  links: "nota:links",
  settings: "nota:settings",
} as const;

const EVENT = "nota:data";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function loadNotes(): Note[] {
  return read<Note[]>(KEYS.notes, []);
}

export function saveNotes(notes: Note[]) {
  write(KEYS.notes, notes);
}

export function loadExpenses(): Expense[] {
  return read<Expense[]>(KEYS.expenses, []);
}

export function saveExpenses(expenses: Expense[]) {
  write(KEYS.expenses, expenses);
}

export function loadLinks(): QuickLink[] {
  return read<QuickLink[]>(KEYS.links, []);
}

export function saveLinks(links: QuickLink[]) {
  write(KEYS.links, links);
}

export function loadSettings(): Settings {
  return read<Settings>(KEYS.settings, { currency: CURRENCIES[0] });
}

export function saveSettings(settings: Settings) {
  write(KEYS.settings, settings);
}

export function exportBackup() {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: Date.now(),
      notes: loadNotes(),
      expenses: loadExpenses(),
      links: loadLinks(),
      settings: loadSettings(),
    },
    null,
    2,
  );
}

export function importBackup(json: string) {
  const data = JSON.parse(json) as {
    notes?: Note[];
    expenses?: Expense[];
    links?: QuickLink[];
    settings?: Settings;
  };
  if (data.notes) saveNotes(data.notes);
  if (data.expenses) saveExpenses(data.expenses);
  if (data.links) saveLinks(data.links);
  if (data.settings) saveSettings(data.settings);
}
