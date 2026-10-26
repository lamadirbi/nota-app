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
const DB_NAME = "nota-db";
const STORE = "kv";

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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Safari private mode / full storage should not delete in-memory data
  }
  window.dispatchEvent(new Event(EVENT));
  void idbSet(key, value);
}

function idbOpen(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet<T>(key: string, value: T) {
  const db = await idbOpen();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
  db.close();
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await idbOpen();
  if (!db) return null;
  const value = await new Promise<T | null>((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => resolve(null);
  });
  db.close();
  return value;
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

export async function hydrateStorage() {
  const restore = async <T,>(key: string, current: T[], save: (value: T[]) => void) => {
    if (current.length) {
      void idbSet(key, current);
      return;
    }
    const stored = await idbGet<T[]>(key);
    if (stored?.length) save(stored);
  };

  await restore(KEYS.notes, loadNotes(), saveNotes);
  await restore(KEYS.expenses, loadExpenses(), saveExpenses);
  await restore(KEYS.links, loadLinks(), saveLinks);

  const settings = loadSettings();
  void idbSet(KEYS.settings, settings);
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
