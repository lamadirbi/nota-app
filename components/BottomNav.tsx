"use client";

import { go, readView } from "@/lib/nav";
import { useEffect, useState } from "react";
import { LinksIcon, NotesIcon, WalletIcon } from "./Icons";

const ITEMS = [
  { href: "/", label: "ملاحظات", icon: NotesIcon, match: "notes" },
  { href: "/expenses", label: "مصاريف", icon: WalletIcon, match: "expenses" },
  { href: "/links", label: "أزرار", icon: LinksIcon, match: "links" },
] as const;

export function BottomNav() {
  const [active, setActive] = useState("notes");

  useEffect(() => {
    const sync = () => {
      const view = readView();
      setActive(view.name === "editor" ? "notes" : view.name);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] min-[400px]:px-4 min-[400px]:pb-[max(0.7rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 rounded-[22px] bg-[#3d2b1f] p-1.5 text-white shadow-[0_12px_30px_rgba(61,43,31,0.28)] min-[400px]:rounded-[28px] min-[400px]:p-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.match;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className={`pressable flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold min-[400px]:min-h-12 min-[400px]:py-2 min-[400px]:text-xs ${
                isActive ? "bg-[#FFD54F] text-[#3d2b1f]" : "text-white/75"
              }`}
            >
              <Icon className="h-5 w-5 min-[400px]:h-6 min-[400px]:w-6" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
