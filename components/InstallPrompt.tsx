"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    if (standalone) {
      setInstalled(true);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIos(isIos);
    const dismissed = localStorage.getItem("nota:hide-install") === "1";
    setHidden(dismissed);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed || hidden || (!deferred && !ios)) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  }

  function dismiss() {
    localStorage.setItem("nota:hide-install", "1");
    setHidden(true);
  }

  return (
    <div className="fixed inset-x-0 bottom-[4.5rem] z-40 mx-auto max-w-lg px-3 min-[400px]:bottom-[5.6rem] min-[400px]:px-5">
      <div className="flex items-start gap-2 rounded-2xl bg-white/95 p-3 shadow-[var(--shadow)] ring-2 ring-yellow-200 min-[400px]:gap-3 min-[400px]:rounded-3xl min-[400px]:p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FFE27A] text-xl min-[400px]:h-12 min-[400px]:w-12 min-[400px]:text-2xl">📲</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black min-[400px]:text-base">ثبّت نوتة على هاتفك</p>
          <p className="text-xs text-[var(--muted)] min-[400px]:text-sm">
            {ios
              ? "من المشاركة ثم إضافة إلى الشاشة الرئيسية."
              : "اضغط تثبيت ليصير التطبيق مثل تطبيقات الهاتف."}
          </p>
          {!ios ? (
            <button
              type="button"
              onClick={install}
              className="pressable mt-2 rounded-full bg-[#FF8A3D] px-4 py-2 text-sm font-black text-white"
            >
              تثبيت الآن
            </button>
          ) : null}
        </div>
        <button type="button" onClick={dismiss} className="pressable text-[var(--muted)]" aria-label="إخفاء">
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
