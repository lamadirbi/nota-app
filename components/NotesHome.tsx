"use client";

import { NOTE_COLORS, formatTime, notePreview, uid } from "@/lib/format";
import { loadNotes, saveNotes, subscribe } from "@/lib/storage";
import type { Note } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import { PlusIcon, SearchIcon } from "./Icons";

export function NotesHome({ onOpen }: { onOpen: (id: string) => void }) {
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
    onOpen(note.id);
  }

  return (
    <AppShell
      title="ملاحظاتي"
      subtitle="تتحفظ على الجهاز حتى بدون نت"
      action={
        <button
          type="button"
          onClick={createNote}
          className="pressable grid h-10 w-10 place-items-center rounded-2xl bg-[#FF8A3D] text-white shadow-[var(--shadow)] min-[400px]:h-11 min-[400px]:w-11"
          aria-label="ملاحظة جديدة"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      }
    >
      <label className="mb-3 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2.5 shadow-[var(--shadow)] min-[400px]:mb-4 min-[400px]:px-4 min-[400px]:py-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-[var(--muted)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث في الملاحظات"
          className="min-w-0 w-full bg-transparent outline-none"
        />
      </label>

      {visible.length === 0 ? (
        <div className="rounded-[24px] bg-white/80 p-6 text-center shadow-[var(--shadow)] min-[400px]:rounded-[28px] min-[400px]:p-8">
          <div className="mb-3 text-5xl">📝</div>
          <h2 className="text-lg font-black min-[400px]:text-xl">دفترك فاضي ولطيف</h2>
          <p className="mt-2 text-sm text-[var(--muted)] min-[400px]:text-base">اضغط الزائد عشان تبدأ أول ملاحظة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 min-[400px]:gap-3">
          {visible.map((note, index) => (
            <button
              key={note.id}
              type="button"
              onClick={() => onOpen(note.id)}
              className="note-card min-h-[128px] rounded-[20px] p-3 text-right shadow-[var(--shadow)] min-[400px]:min-h-[160px] min-[400px]:rounded-[24px] min-[400px]:p-4"
              style={{
                background: NOTE_COLORS[note.color],
                transform: `rotate(${index % 2 === 0 ? -0.8 : 0.8}deg)`,
              }}
            >
              <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-black/50 min-[400px]:mb-2 min-[400px]:text-xs">
                <span className="truncate">{formatTime(note.updatedAt)}</span>
                {note.pinned ? <span>📌</span> : null}
              </div>
              <h3 className="line-clamp-2 text-[15px] font-black leading-snug min-[400px]:text-lg">
                {note.title.trim() || "بدون عنوان"}
              </h3>
              <p className="mt-1 line-clamp-3 text-xs text-black/65 min-[400px]:mt-2 min-[400px]:text-sm">
                {notePreview(note.content) || "اضغط للكتابة"}
              </p>
            </button>
          ))}
        </div>
      )}
    </AppShell>
  );
}
