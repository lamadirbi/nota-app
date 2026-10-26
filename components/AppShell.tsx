"use client";

import { CURRENCIES } from "@/lib/format";
import { exportBackup, importBackup, loadSettings, saveSettings } from "@/lib/storage";
import type { Settings } from "@/lib/types";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { CloseIcon } from "./Icons";
import { InstallPrompt } from "./InstallPrompt";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AppShell({ title, subtitle, action, children }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [offline, setOffline] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(loadSettings());
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  function updateCurrency(code: string) {
    const currency = CURRENCIES.find((item) => item.code === code);
    if (!currency) return;
    const next = { currency };
    saveSettings(next);
    setSettings(next);
  }

  function downloadBackup() {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nota-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function restoreBackup(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importBackup(String(reader.result));
        setSettings(loadSettings());
        setSettingsOpen(false);
      } catch {
        alert("تعذر قراءة ملف النسخة الاحتياطية");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden">
      <div className="blob -right-16 -top-10 hidden h-44 w-44 bg-[#ffe27a]/80 min-[400px]:block" />
      <div className="blob -left-16 top-28 hidden h-36 w-36 bg-[#ffb347]/50 min-[400px]:block" />

      <header className="relative z-10 flex items-start justify-between gap-2 px-3 pb-2 pt-[max(0.55rem,env(safe-area-inset-top))] min-[400px]:gap-3 min-[400px]:px-5 min-[400px]:pb-3 min-[400px]:pt-[max(1.1rem,env(safe-area-inset-top))]">
        <div className="min-w-0">
          <p className="text-xs font-bold text-orange-500 min-[400px]:text-sm">
            نوتة ☀️ {offline ? "• محفوظ على الجهاز" : ""}
          </p>
          <h1 className="text-[1.45rem] font-black leading-tight tracking-tight min-[400px]:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 hidden text-sm text-[var(--muted)] min-[360px]:block">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 min-[400px]:gap-2">
          {action}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="pressable grid h-10 w-10 place-items-center rounded-2xl bg-white/80 text-lg shadow-[var(--shadow)] min-[400px]:h-11 min-[400px]:w-11 min-[400px]:text-xl"
            aria-label="الإعدادات"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="relative z-10 px-3 safe-bottom min-[400px]:px-5">{children}</main>
      <BottomNav />
      <InstallPrompt />

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-3 min-[400px]:p-4" onClick={() => setSettingsOpen(false)}>
          <section
            className="sheet w-full max-w-lg rounded-[24px] bg-[var(--card)] p-4 shadow-2xl min-[400px]:rounded-[28px] min-[400px]:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black min-[400px]:text-xl">الإعدادات</h2>
              <button
                type="button"
                className="pressable grid h-10 w-10 place-items-center rounded-full bg-yellow-100"
                onClick={() => setSettingsOpen(false)}
                aria-label="إغلاق"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 rounded-2xl bg-yellow-50 px-3 py-2 text-sm text-[var(--muted)]">
              الملاحظات والمصاريف والأزرار تتحفظ على هاتفك فوراً، حتى لو النت مقطوع.
            </p>

            <label className="mb-2 block text-sm font-bold text-[var(--muted)]">العملة</label>
            <select
              value={settings?.currency.code ?? "JOD"}
              onChange={(event) => updateCurrency(event.target.value)}
              className="mb-5 w-full rounded-2xl border-0 bg-yellow-50 px-4 py-3 outline-none"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={downloadBackup} className="pressable rounded-2xl bg-[#FFE27A] py-3 font-bold">
                حفظ نسخة
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="pressable rounded-2xl bg-white py-3 font-bold ring-2 ring-yellow-200"
              >
                استعادة
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) restoreBackup(file);
              }}
            />
          </section>
        </div>
      ) : null}
    </div>
  );
}
