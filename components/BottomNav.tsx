"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinksIcon, NotesIcon, WalletIcon } from "./Icons";

const ITEMS = [
  { href: "/", label: "ملاحظات", icon: NotesIcon },
  { href: "/expenses", label: "مصاريف", icon: WalletIcon },
  { href: "/links", label: "أزرار", icon: LinksIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg px-4 pb-[max(0.7rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 rounded-[28px] bg-[#3d2b1f] p-2 text-white shadow-[0_12px_30px_rgba(61,43,31,0.28)]">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/notes")
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pressable flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-bold ${
                active ? "bg-[#FFD54F] text-[#3d2b1f]" : "text-white/75"
              }`}
            >
              <Icon className="h-6 w-6" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
