"use client";

import { NOTE_COLORS, formatTime, notePreview, uid } from "@/lib/format";
import { loadNotes, saveNotes, subscribe } from "@/lib/storage";
import type { Note } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import { PlusIcon, SearchIcon } from "./Icons";

export function NotesHome() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const refresh = () => setNotes(loadNotes());
    refresh();
    return subscribe(refresh);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim();
    const filtered = q
      ? notes.filter((note) => `${note.title} ${note.content}`.includes(q))
      : notes;
    return [...filtered].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, query]);

  function createNote() {
    const now = Date.now();
    const note: Note = {
      id: uid(),
      title: "",
      content: "",
      color: "yellow",
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    saveNotes([note, ...loadNotes()]);
    router.push(`/notes/${note.id}`);
  }

  return (
    <AppShell
      title="ملاحظاتي"
      subtitle="اكتب بسرعة مثل دفتر الهاتف"
      action={
        <button
          type="button"
          onClick={createNote}
          className="pressable grid h-11 w-11 place-items-center rounded-2xl bg-[#FF8A3D] text-white shadow-[var(--shadow)]"
          aria-label="ملاحظة جديدة"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      }
    >
      <label className="mb-4 flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-[var(--shadow)]">
        <SearchIcon className="h-5 w-5 text-[var(--muted)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث في الملاحظات"
          className="w-full bg-transparent outline-none"
        />
      </label>

      {visible.length === 0 ? (
        <div className="rounded-[28px] bg-white/80 p-8 text-center shadow-[var(--shadow)]">
          <div className="mb-3 text-5xl">📝</div>
          <h2 className="text-xl font-black">دفترك فاضي ولطيف</h2>
          <p className="mt-2 text-[var(--muted)]">اضغط الزائد الأصفر عشان تبدأ أول ملاحظة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visible.map((note, index) => (
            <button
              key={note.id}
              type="button"
              onClick={() => router.push(`/notes/${note.id}`)}
              className="note-card min-h-[160px] rounded-[24px] p-4 text-right shadow-[var(--shadow)]"
              style={{
                background: NOTE_COLORS[note.color],
                transform: `rotate(${index % 2 === 0 ? -1.4 : 1.4}deg)`,
              }}
            >
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-black/50">
                <span>{formatTime(note.updatedAt)}</span>
                {note.pinned ? <span>📌</span> : null}
              </div>
              <h3 className="line-clamp-2 text-lg font-black">
                {note.title.trim() || "بدون عنوان"}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-black/65">
                {notePreview(note.content) || "اضغط للكتابة"}
              </p>
            </button>
          ))}
        </div>
      )}
    </AppShell>
  );
}
