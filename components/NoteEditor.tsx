"use client";

import { NOTE_COLORS } from "@/lib/format";
import { loadNotes, saveNotes } from "@/lib/storage";
import type { Note, NoteColor } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { BackIcon, PinIcon, TrashIcon } from "./Icons";

export function NoteEditor({ id, onBack }: { id: string; onBack: () => void }) {
  const [note, setNote] = useState<Note | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = loadNotes().find((item) => item.id === id) ?? null;
    setNote(found);
  }, [id]);

  const colors = useMemo(() => Object.keys(NOTE_COLORS) as NoteColor[], []);

  function persist(next: Note) {
    const notes = loadNotes();
    const exists = notes.some((item) => item.id === next.id);
    saveNotes(exists ? notes.map((item) => (item.id === next.id ? next : item)) : [next, ...notes]);
    setNote(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 900);
  }

  function update(partial: Partial<Note>) {
    if (!note) return;
    persist({ ...note, ...partial, updatedAt: Date.now() });
  }

  function remove() {
    saveNotes(loadNotes().filter((item) => item.id !== id));
    onBack();
  }

  if (!note) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="text-5xl">🙈</p>
          <p className="mt-3 font-black">الملاحظة مش موجودة</p>
          <button type="button" className="mt-4 font-bold text-orange-500" onClick={onBack}>
            رجوع للملاحظات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden" style={{ background: NOTE_COLORS[note.color] }}>
      <header className="flex items-center justify-between gap-2 px-3 pb-2 pt-[max(0.55rem,env(safe-area-inset-top))] min-[400px]:px-4 min-[400px]:pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onBack}
          className="pressable grid h-10 w-10 place-items-center rounded-2xl bg-white/70 min-[400px]:h-11 min-[400px]:w-11"
          aria-label="رجوع"
        >
          <BackIcon className="h-5 w-5" />
        </button>
        <p className="text-xs font-bold text-black/50">{saved ? "تم الحفظ ✓" : "محفوظ على الجهاز"}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update({ pinned: !note.pinned })}
            className={`pressable grid h-10 w-10 place-items-center rounded-2xl min-[400px]:h-11 min-[400px]:w-11 ${
              note.pinned ? "bg-[#3d2b1f] text-[#FFE27A]" : "bg-white/70"
            }`}
            aria-label="تثبيت"
          >
            <PinIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="pressable grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-red-500 min-[400px]:h-11 min-[400px]:w-11"
            aria-label="حذف"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-3 pb-3 no-scrollbar min-[400px]:px-5">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => update({ color })}
            className={`h-8 w-8 shrink-0 rounded-full ring-2 ${
              note.color === color ? "ring-[#3d2b1f]" : "ring-white/70"
            }`}
            style={{ background: NOTE_COLORS[color] }}
            aria-label={color}
          />
        ))}
      </div>

      <input
        value={note.title}
        onChange={(event) => update({ title: event.target.value })}
        placeholder="العنوان"
        className="w-full bg-transparent px-3 text-[1.7rem] font-black outline-none placeholder:text-black/30 min-[400px]:px-5 min-[400px]:text-3xl"
      />
      <textarea
        value={note.content}
        onChange={(event) => update({ content: event.target.value })}
        placeholder="اكتب أي شيء يخطر ببالك..."
        className="min-h-[55vh] w-full resize-none bg-transparent px-3 py-3 text-base leading-7 outline-none placeholder:text-black/30 min-[400px]:min-h-[60vh] min-[400px]:px-5 min-[400px]:py-4 min-[400px]:text-lg min-[400px]:leading-8"
      />

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-4 text-center min-[400px]:rounded-[28px] min-[400px]:p-5">
            <p className="text-4xl">🗑️</p>
            <h2 className="mt-2 text-lg font-black min-[400px]:text-xl">تحذف الملاحظة؟</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" className="rounded-2xl bg-zinc-100 py-3 font-bold" onClick={() => setConfirmDelete(false)}>
                تراجع
              </button>
              <button type="button" className="rounded-2xl bg-red-500 py-3 font-bold text-white" onClick={remove}>
                حذف
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
