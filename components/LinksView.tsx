"use client";

import { EMOJIS, LINK_COLORS, normalizeUrl, uid } from "@/lib/format";
import { loadLinks, saveLinks, subscribe } from "@/lib/storage";
import type { QuickLink } from "@/lib/types";
import { useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { CloseIcon, PlusIcon, TrashIcon } from "./Icons";

export function LinksView() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [emoji, setEmoji] = useState("🌟");
  const [color, setColor] = useState(LINK_COLORS[0]);

  useEffect(() => {
    const refresh = () => setLinks(loadLinks());
    refresh();
    return subscribe(refresh);
  }, []);

  function reset() {
    setTitle("");
    setUrl("");
    setEmoji("🌟");
    setColor(LINK_COLORS[0]);
  }

  function addLink() {
    const href = normalizeUrl(url);
    if (!title.trim() || !href) return;
    const next: QuickLink = {
      id: uid(),
      title: title.trim(),
      url: href,
      emoji,
      color,
      createdAt: Date.now(),
    };
    saveLinks([next, ...loadLinks()]);
    reset();
    setOpen(false);
  }

  function remove(id: string) {
    saveLinks(loadLinks().filter((item) => item.id !== id));
  }

  return (
    <AppShell
      title="أزرار سريعة"
      subtitle="حط الرابط وصير زر يوديك للموقع"
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pressable grid h-11 w-11 place-items-center rounded-2xl bg-[#FF8A3D] text-white shadow-[var(--shadow)]"
          aria-label="زر جديد"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      }
    >
      {links.length === 0 ? (
        <div className="rounded-[28px] bg-white/80 p-8 text-center shadow-[var(--shadow)]">
          <div className="mb-3 text-5xl">🔗</div>
          <h2 className="text-xl font-black">ما في أزرار بعد</h2>
          <p className="mt-2 text-[var(--muted)]">أضف اسم ورابط، وبعدها ضغطة واحدة تفتح الموقع.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <div key={link.id} className="relative">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable flex min-h-[132px] flex-col items-center justify-center rounded-[28px] p-4 text-center font-black text-[#3d2b1f] shadow-[var(--shadow)]"
                style={{ background: link.color }}
              >
                <span className="text-3xl">{link.emoji}</span>
                <span className="mt-2 line-clamp-2 text-lg">{link.title}</span>
              </a>
              <button
                type="button"
                onClick={() => remove(link.id)}
                className="pressable absolute left-2 top-2 rounded-full bg-white/80 p-1 text-red-400"
                aria-label={`حذف ${link.title}`}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-4" onClick={() => setOpen(false)}>
          <form
            className="w-full max-w-lg rounded-[28px] bg-[var(--card)] p-5"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              addLink();
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">زر جديد</h2>
              <button type="button" onClick={() => setOpen(false)} className="pressable rounded-full bg-yellow-100 p-2" aria-label="إغلاق">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="اسم الزر مثل إنستغرام"
              className="mb-3 w-full rounded-2xl bg-yellow-50 px-4 py-3 outline-none"
            />
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="الرابط مثل google.com"
              className="mb-4 w-full rounded-2xl bg-yellow-50 px-4 py-3 outline-none"
              dir="ltr"
            />
            <p className="mb-2 text-sm font-bold text-[var(--muted)]">الأيقونة</p>
            <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
              {EMOJIS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`pressable grid h-11 w-11 place-items-center rounded-2xl text-xl ${
                    emoji === item ? "bg-[#3d2b1f]" : "bg-yellow-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mb-2 text-sm font-bold text-[var(--muted)]">اللون</p>
            <div className="mb-4 flex gap-2">
              {LINK_COLORS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`h-8 w-8 rounded-full ring-2 ${color === item ? "ring-[#3d2b1f]" : "ring-white"}`}
                  style={{ background: item }}
                  aria-label={item}
                />
              ))}
            </div>
            <button type="submit" className="pressable w-full rounded-2xl bg-[#FF8A3D] py-3 font-black text-white">
              إنشاء الزر
            </button>
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
