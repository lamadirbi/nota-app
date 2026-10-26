"use client";

import { go, readView, type AppView } from "@/lib/nav";
import { hydrateStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { ExpensesView } from "./ExpensesView";
import { LinksView } from "./LinksView";
import { NoteEditor } from "./NoteEditor";
import { NotesHome } from "./NotesHome";

export function NotaApp({ start }: { start?: AppView } = {}) {
  const [view, setView] = useState<AppView>(start ?? { name: "notes" });

  useEffect(() => {
    setView(readView());
    void hydrateStorage();
    const onChange = () => setView(readView());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  if (view.name === "editor") {
    return <NoteEditor id={view.id} onBack={() => go("/")} />;
  }
  if (view.name === "expenses") return <ExpensesView />;
  if (view.name === "links") return <LinksView />;
  return <NotesHome onOpen={(id) => go(`/note/${id}`)} />;
}
