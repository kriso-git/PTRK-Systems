"use client";

import { useEffect, useRef, useState } from "react";

type Section = { id: string; label: string };

/**
 * Sticky right-edge scroll progress bar + active-section indicator.
 * Reads sections from `data-section` and `data-label` attributes
 * found anywhere in the document.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<Section | null>(null);
  const sectionsRef = useRef<{ el: HTMLElement; section: Section }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const collect = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]")
      );
      sectionsRef.current = nodes.map((el) => ({
        el,
        section: {
          id: el.dataset.section ?? "",
          label: el.dataset.label ?? "",
        },
      }));
    };

    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.min(1, Math.max(0, p)));

      // Active section: last whose top <= 30vh
      const trigger = window.scrollY + window.innerHeight * 0.3;
      let current: Section | null = null;
      for (const { el, section } of sectionsRef.current) {
        if (el.offsetTop <= trigger) current = section;
      }
      setActive(current);
    };

    collect();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const obs = new MutationObserver(() => {
      collect();
      update();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Right-edge vertical progress bar */}
      <div
        aria-hidden
        className="fixed top-0 right-0 bottom-0 w-[2px] z-30 pointer-events-none hidden md:block"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute top-0 right-0 w-full bg-lime"
          style={{
            height: "100%",
            transformOrigin: "top",
            transform: `scaleY(${progress})`,
            transition: "transform 0.1s linear"
          }}
        />
        <div
          className="absolute right-0 w-2 h-2 -mr-[3px] bg-lime border-2 border-void"
          style={{ top: `calc(${progress * 100}% - 4px)` }}
        />
      </div>

      {/* Active section chip — bottom-left (clear of the right terminal aside) */}
      <div
        aria-hidden
        className="fixed bottom-6 left-6 z-30 pointer-events-none hidden md:flex flex-col items-start gap-2"
      >
        {active && (
          <div className="flex items-center gap-3 bg-void/85 backdrop-blur-sm border border-lime/30 px-4 py-2 font-monospec text-[10px] tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            <span className="text-lime">{active.id}</span>
            <span className="text-secondary">{active.label}</span>
          </div>
        )}
        <div className="font-monospec text-[9px] tracking-[0.3em] uppercase text-secondary/60">
          {(progress * 100).toFixed(0)}%
        </div>
      </div>
    </>
  );
}
