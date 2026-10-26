"use client";

import { CATEGORIES, formatDate, formatMoney, todayISO, uid } from "@/lib/format";
import { loadExpenses, loadSettings, saveExpenses, subscribe } from "@/lib/storage";
import type { Expense, ExpenseCategory, Settings } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import { CloseIcon, PlusIcon, TrashIcon } from "./Icons";

const CATEGORY_KEYS = Object.keys(CATEGORIES) as ExpenseCategory[];

export function ExpensesView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    const refresh = () => {
      setExpenses(loadExpenses());
      setSettings(loadSettings());
    };
    refresh();
    return subscribe(refresh);
  }, []);

  const currency = settings?.currency ?? { code: "JOD", label: "دينار أردني", symbol: "د.أ" };
  const monthKey = todayISO().slice(0, 7);

  const monthExpenses = useMemo(
    () => expenses.filter((item) => item.date.startsWith(monthKey)),
    [expenses, monthKey],
  );
  const todayTotal = expenses
    .filter((item) => item.date === todayISO())
    .reduce((sum, item) => sum + item.amount, 0);
  const monthTotal = monthExpenses.reduce((sum, item) => sum + item.amount, 0);

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
      .forEach((item) => {
        const list = map.get(item.date) ?? [];
        list.push(item);
        map.set(item.date, list);
      });
    return [...map.entries()];
  }, [expenses]);

  function resetForm() {
    setTitle("");
    setAmount("");
    setCategory("food");
    setDate(todayISO());
  }

  function addExpense() {
    const value = Number(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return;
    const next: Expense = {
      id: uid(),
      title: title.trim(),
      amount: value,
      category,
      date,
      createdAt: Date.now(),
    };
    saveExpenses([next, ...loadExpenses()]);
    resetForm();
    setOpen(false);
  }

  function remove(id: string) {
    saveExpenses(loadExpenses().filter((item) => item.id !== id));
  }

  return (
    <AppShell
      title="المصاريف"
      subtitle="اعرف وين راح المصروف بسهولة"
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pressable grid h-10 w-10 place-items-center rounded-2xl bg-[#FF8A3D] text-white shadow-[var(--shadow)] min-[400px]:h-11 min-[400px]:w-11"
          aria-label="مصروف جديد"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      }
    >
      <div className="mb-3 rounded-[22px] bg-[#3d2b1f] p-4 text-white shadow-[var(--shadow)] min-[400px]:mb-4 min-[400px]:rounded-[28px] min-[400px]:p-5">
        <p className="text-xs text-white/70 min-[400px]:text-sm">مجموع هذا الشهر</p>
        <p className="mt-1 break-words text-2xl font-black min-[400px]:text-4xl">{formatMoney(monthTotal, currency)}</p>
        <p className="mt-2 text-sm text-[#FFE27A]">اليوم: {formatMoney(todayTotal, currency)}</p>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar min-[400px]:mb-4">
        {CATEGORY_KEYS.map((key) => {
          const meta = CATEGORIES[key];
          const total = monthExpenses
            .filter((item) => item.category === key)
            .reduce((sum, item) => sum + item.amount, 0);
          return (
            <div key={key} className="min-w-[92px] rounded-2xl bg-white/80 p-2.5 shadow-[var(--shadow)] min-[400px]:min-w-[108px] min-[400px]:p-3">
              <p className="text-lg">{meta.emoji}</p>
              <p className="text-sm font-bold">{meta.label}</p>
              <p className="text-xs text-[var(--muted)]">{formatMoney(total, currency)}</p>
            </div>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-[24px] bg-white/80 p-6 text-center shadow-[var(--shadow)] min-[400px]:rounded-[28px] min-[400px]:p-8">
          <div className="mb-3 text-5xl">💰</div>
          <h2 className="text-xl font-black">ما في مصاريف بعد</h2>
          <p className="mt-2 text-[var(--muted)]">أضف أول مصروف بثواني من الزر البرتقالي.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([day, items]) => (
            <section key={day}>
              <h3 className="mb-2 px-1 text-sm font-bold text-[var(--muted)]">{formatDate(day)}</h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const meta = CATEGORIES[item.category];
                  return (
                    <div key={item.id} className="flex items-center gap-2 rounded-2xl bg-white/85 p-2.5 shadow-[var(--shadow)] min-[400px]:gap-3 min-[400px]:rounded-3xl min-[400px]:p-3">
                      <div
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg min-[400px]:h-12 min-[400px]:w-12 min-[400px]:text-xl"
                        style={{ background: `${meta.color}33` }}
                      >
                        {meta.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black min-[400px]:text-base">{item.title}</p>
                        <p className="text-xs text-[var(--muted)] min-[400px]:text-sm">{meta.label}</p>
                      </div>
                      <p className="shrink-0 text-sm font-black min-[400px]:text-base">{formatMoney(item.amount, currency)}</p>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="pressable text-red-400"
                        aria-label="حذف المصروف"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-3 min-[400px]:p-4" onClick={() => setOpen(false)}>
          <form
            className="sheet w-full max-w-lg rounded-[24px] bg-[var(--card)] p-4 min-[400px]:rounded-[28px] min-[400px]:p-5"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              addExpense();
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">مصروف جديد</h2>
              <button type="button" onClick={() => setOpen(false)} className="pressable rounded-full bg-yellow-100 p-2" aria-label="إغلاق">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="المبلغ"
              className="mb-3 w-full rounded-2xl bg-yellow-50 px-4 py-3 text-2xl font-black outline-none"
            />
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="على شو؟ مثل غدا أو بنزين"
              className="mb-3 w-full rounded-2xl bg-yellow-50 px-4 py-3 outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mb-3 w-full rounded-2xl bg-yellow-50 px-4 py-3 outline-none"
            />
            <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
              {CATEGORY_KEYS.map((key) => {
                const meta = CATEGORIES[key];
                const active = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`pressable shrink-0 rounded-2xl px-3 py-2 text-sm font-bold ${
                      active ? "bg-[#3d2b1f] text-white" : "bg-yellow-50"
                    }`}
                  >
                    {meta.emoji} {meta.label}
                  </button>
                );
              })}
            </div>
            <button type="submit" className="pressable w-full rounded-2xl bg-[#FF8A3D] py-3 font-black text-white">
              حفظ المصروف
            </button>
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
