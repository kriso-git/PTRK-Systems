"use client";

import { useEffect, useState } from "react";
import { acquireNode, NODE_COUNT } from "@/lib/nodes";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

type Toast = { label: string; count: number };

/** Magenta HUD toast on node acquisition + the global Konami listener. */
export function NodeToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const onNode = (e: Event) => {
      const { label, count } = (e as CustomEvent).detail;
      setToast({ label, count });
    };
    window.addEventListener("ptrk:node", onNode);

    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const expect = KONAMI[progress];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expect) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          acquireNode("konami");
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("ptrk:node", onNode);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed top-28 right-4 md:right-[270px] z-[95] border border-magenta/60 bg-void/95 backdrop-blur-md px-5 py-4 tab-enter"
    >
      <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-magenta mb-1.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-magenta cursor-blink" />
        ▓ Node acquired
      </div>
      <div className="font-monospec text-[11px] tracking-[0.15em] text-primary">
        {toast.label}
      </div>
      <div className="mt-1.5 font-monospec text-[10px] tracking-[0.3em] text-secondary">
        NODES {toast.count}/{NODE_COUNT}
      </div>
    </div>
  );
}
