"use client";

import { useEffect, useState } from "react";
import { OperatorTerminal } from "@/components/OperatorTerminal";
import { acquireNode } from "@/lib/nodes";
import { applyMotionAttr } from "@/lib/motion";

const TOKENS = [
  { hex: "#c2fe0c", name: "lime" },
  { hex: "#01ffff", name: "cyan" },
  { hex: "#ea027e", name: "magenta" },
  { hex: "#ff8c42", name: "orange" },
];

function isTypingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

/**
 * The HUD "system tray": Operator Terminal (~), Blueprint Mode (B) and
 * synthesized sound (opt-in). One client island owns all three so the
 * keyboard shortcuts, sound hooks and overlays stay coordinated.
 */
export function HudSystem() {
  const [mounted, setMounted] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [blueprint, setBlueprint] = useState(false);

  useEffect(() => {
    setMounted(true);
    applyMotionAttr();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTerminal(false);
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setTerminal((t) => !t);
      } else if (e.key === "b" || e.key === "B") {
        setBlueprint((b) => !b);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Blueprint side effects
  useEffect(() => {
    document.documentElement.toggleAttribute("data-blueprint", blueprint);
    if (blueprint) acquireNode("blueprint");
    return () => document.documentElement.removeAttribute("data-blueprint");
  }, [blueprint]);

  if (!mounted) return null;

  // NOTE: the visible bottom-left toggle tray (TRM / BLU / MOT chips) was removed
  // at the owner's request for the redesign. The features stay reachable by
  // keyboard easter-egg: ` / ~ opens the Operator Terminal, B toggles Blueprint.

  return (
    <>
      {/* Blueprint overlays */}
      {blueprint && (
        <>
          {/* 12-column grid guide */}
          <div
            aria-hidden
            className="fixed inset-0 z-[3] pointer-events-none px-6 md:px-10"
          >
            <div className="max-w-[1500px] h-full grid grid-cols-12 gap-x-10">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="border-x border-cyan/10 bg-cyan/[0.015]" />
              ))}
            </div>
          </div>
          {/* Token legend */}
          <div
            aria-hidden
            className="fixed bottom-4 right-4 z-[94] hidden md:block border border-cyan/40 bg-void/95 backdrop-blur-md p-4 font-monospec text-[10px] tracking-[0.15em] text-secondary w-[230px]"
          >
            <div className="text-cyan uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan cursor-blink" />
              BLUEPRINT·MODE
            </div>
            {TOKENS.map((t) => (
              <div key={t.name} className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 shrink-0" style={{ background: t.hex }} />
                <span className="text-primary/80">{t.hex}</span>
                <span className="text-secondary/60">· {t.name}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 leading-relaxed">
              Chakra Petch 600 · Roboto Flex 900
              <br />
              Geist Mono · Onest
              <br />
              radius: 0px · grid: 12 col
            </div>
          </div>
        </>
      )}

      {terminal && <OperatorTerminal onClose={() => setTerminal(false)} />}
    </>
  );
}
