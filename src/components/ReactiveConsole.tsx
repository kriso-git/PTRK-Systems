"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { COLOR_HEX, TAG_COLOR, detectTag, type LineTag, type SlotColor } from "@/lib/terminal-pool";
import { subscribeConsole } from "@/lib/console-bus";

/**
 * ReactiveConsole — the right-edge console reimagined as a SELF-AWARE terminal.
 * Instead of random noise it narrates the real session: GPU + viewport on boot,
 * every section as you scroll into it, route changes, clicks, project hovers
 * (pushed via console-bus). When the visitor is idle it falls back to a coherent
 * deploy-story loop, so it is alive but never fake. Crisp DOM = always legible.
 */

type Line = { id: number; tag: LineTag; color: SlotColor; body: string; typed: number; done: boolean };

// idle filler: a coherent ship narrative, not random commands.
const DEPLOY_STORY = [
  "$ git push origin main",
  "▶ CI · queued · #284",
  "[OK] install · 4.2s",
  "[OK] type-check · 0 errors",
  "[OK] test · 24/24 pass",
  "▶ build · turbopack",
  "[OK] build · 1.04s",
  "▶ deploy · vercel · edge",
  "[OK] LIVE · ptrksystems.com",
  "// idle · awaiting input",
];

function build(id: number, text: string): Line {
  const detected = detectTag(text);
  const tag = detected ?? "$";
  const color = TAG_COLOR[tag];
  const body = detected ? text.slice(detected.length).trimStart() : text;
  return { id, tag, color, body, typed: 0, done: false };
}

const LINE_PX = 20;

export function ReactiveConsole() {
  const pathname = usePathname();
  const [lines, setLines] = useState<Line[]>([]);
  const [count, setCount] = useState(0);

  const queue = useRef<string[]>([]);
  const linesRef = useRef<Line[]>([]);
  const idRef = useRef(0);
  const storyRef = useRef(0);
  const maxRef = useRef(14);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstPath = useRef(true);

  // shared enqueue (internal observers call this directly; external emitters go
  // through the bus -> subscription -> enqueue).
  const enqueue = (text: string) => {
    const q = queue.current;
    if (q.length && q[q.length - 1] === text) return; // dedup consecutive
    q.push(text);
    if (q.length > 10) q.shift();
  };

  // ---- dynamic line cap ----
  useLayoutEffect(() => {
    const measure = () => {
      const el = bodyRef.current;
      if (!el) return;
      maxRef.current = Math.max(6, Math.floor(el.clientHeight / LINE_PX));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (bodyRef.current) ro.observe(bodyRef.current);
    return () => ro.disconnect();
  }, []);

  // ---- boot lines + external bus + click capture (once) ----
  useEffect(() => {
    const gl2 = (() => {
      try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
    })();
    enqueue("[OK] session · linked · NOD·0A20");
    enqueue(`[OK] gpu · ${gl2 ? "webgl2" : "software"} · online`);
    enqueue(`[OK] viewport · ${window.innerWidth}x${window.innerHeight}`);

    const unsub = subscribeConsole((l) => enqueue(l.text));

    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest("a,button");
      if (!t) return;
      const label = (t.getAttribute("aria-label") || t.textContent || "").trim().replace(/\s+/g, " ").slice(0, 22);
      if (label) enqueue(`$ exec · ${label.toLowerCase()}`);
    };
    window.addEventListener("click", onClick, { capture: true, passive: true });

    return () => {
      unsub();
      window.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  // ---- route changes ----
  useEffect(() => {
    if (firstPath.current) { firstPath.current = false; return; }
    enqueue(`▶ route → ${pathname} · 200`);
  }, [pathname]);

  // ---- sections entering view (re-bound per route) ----
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (!els.length) return;
    let lastSec = "";
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const sec = en.target.getAttribute("data-section") || "";
          const label = en.target.getAttribute("data-label") || "";
          if (sec && sec !== lastSec) {
            lastSec = sec;
            enqueue(`▸ ${sec} · ${label} · in-view`);
          }
        }
      },
      { threshold: 0.55 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // ---- typing heartbeat ----
  useEffect(() => {
    // seed a few settled story lines so the screen reads alive immediately,
    // then keep typing fresh (real / story) lines in at the bottom.
    const seedN = Math.min(Math.max(maxRef.current - 2, 4), 9);
    const seeded: Line[] = [];
    for (let s = 0; s < seedN; s++) {
      const txt = DEPLOY_STORY[storyRef.current % DEPLOY_STORY.length];
      storyRef.current += 1;
      const l = build(idRef.current++, txt);
      l.typed = l.body.length;
      l.done = true;
      seeded.push(l);
    }
    linesRef.current = seeded;
    setLines(seeded.slice());
    setCount(seedN);

    let phase: "type" | "gap" = "gap";
    let gapUntil = performance.now();
    let nextAt = 0;

    const hb = setInterval(() => {
      const now = performance.now();
      let dirty = false;

      if (phase === "type") {
        if (now >= nextAt) {
          const arr = linesRef.current;
          const last = arr[arr.length - 1];
          if (!last) { phase = "gap"; gapUntil = now; return; }
          last.typed = Math.min(last.typed + 1, last.body.length);
          dirty = true;
          if (last.typed >= last.body.length) {
            last.done = true;
            phase = "gap";
            gapUntil = now + 280 + Math.random() * 520;
          } else {
            nextAt = now + 36 + Math.random() * 42;
          }
        }
      } else if (now >= gapUntil) {
        // pick the next line: real queued events first, else the deploy story
        let text = queue.current.shift();
        if (!text) {
          text = DEPLOY_STORY[storyRef.current % DEPLOY_STORY.length];
          storyRef.current += 1;
        }
        const line = build(idRef.current++, text);
        const arr = [...linesRef.current, line];
        while (arr.length > maxRef.current) arr.shift();
        linesRef.current = arr;
        phase = "type";
        nextAt = now + 50;
        dirty = true;
        setCount((c) => c + 1);
      }

      if (dirty) setLines(linesRef.current.slice());
    }, 30);

    return () => clearInterval(hb);
  }, []);

  return (
    <aside
      aria-hidden
      className="fixed right-0 top-[88px] bottom-4 z-[12] hidden w-[230px] pointer-events-none flex-col font-monospec md:flex"
    >
      {/* header chrome */}
      <div className="mx-2 flex items-center gap-2 border border-b-0 border-lime/30 bg-void/85 px-3 py-2 text-[10px] uppercase tracking-[0.25em] backdrop-blur-sm">
        <span className="h-1.5 w-1.5 shrink-0 bg-lime cursor-blink" />
        <span className="text-lime">TX·LIVE</span>
        <span className="text-secondary/40">/</span>
        <span className="text-secondary/70">REACTIVE</span>
        <span className="ml-auto text-[9px] text-secondary/50">SES·0A20</span>
      </div>

      {/* log body */}
      <div ref={bodyRef} className="relative mx-2 flex-1 overflow-hidden border border-lime/30 bg-void/60 backdrop-blur-sm">
        {/* faint scanlines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#c2fe0c 0 1px,transparent 1px 3px)" }} />
        {/* top dissolve */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-void/95 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-2 pb-1 pt-1">
          {lines.map((ln, i) => {
            const isLast = i === lines.length - 1;
            const dist = lines.length - 1 - i;
            const opacity = isLast ? 1 : Math.max(0.12, 1 - dist * 0.06);
            const hex = COLOR_HEX[ln.color];
            const visible = ln.body.slice(0, ln.typed);
            return (
              <div
                key={ln.id}
                className={`relative flex items-center gap-1.5 overflow-hidden py-[1px] pl-2 text-left text-[10px] leading-[1.5] tracking-[0.04em] ${isLast ? "bg-white/[0.03]" : ""}`}
                style={{ opacity }}
              >
                <span aria-hidden className="absolute left-0 top-0 h-full w-[2px]" style={{ background: hex, opacity: isLast ? 1 : 0.5 }} />
                <span className="shrink-0 border px-1 text-[8px] leading-[1.5] tracking-normal" style={{ color: hex, borderColor: `${hex}66`, background: `${hex}14` }}>
                  {ln.tag}
                </span>
                <span className="min-w-0 flex-1 truncate" style={{ color: hex, textShadow: `0 0 5px ${hex}55` }}>
                  {visible}
                </span>
                {isLast && (
                  <span
                    aria-hidden
                    className="shrink-0"
                    style={{ display: "inline-block", width: 5, height: 10, background: hex, boxShadow: `0 0 4px ${hex}`, animation: ln.done ? "blink 0.85s steps(1) infinite" : "none" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* footer chrome */}
      <div className="mx-2 flex items-center gap-2 border border-t-0 border-lime/30 bg-void/85 px-3 py-2 text-[10px] uppercase tracking-[0.25em] backdrop-blur-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" style={{ animation: "blink 1.1s steps(1) infinite" }} />
        <span className="text-lime">SYNC</span>
        <span className="ml-auto text-[9px] text-secondary/50">{`LINES·${count.toString().padStart(3, "0")}`}</span>
      </div>
    </aside>
  );
}
