"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { OperatorTerminal } from "@/components/OperatorTerminal";
import { acquireNode } from "@/lib/nodes";
import { setSfxEnabled, tick, blip } from "@/lib/sfx";
import { applyMotionAttr, motionOff, setMotionOff } from "@/lib/motion";

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
  const [sound, setSound] = useState(false);
  const [motOff, setMotOff] = useState(false);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    setMounted(true);
    applyMotionAttr();
    setMotOff(motionOff());
    try {
      if (localStorage.getItem("ptrk-snd") === "1") {
        // Stored preference — context resumes on first gesture anyway
        setSound(true);
        setSfxEnabled(true);
      }
    } catch {
      /* storage blocked */
    }
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

  // Sound side effects: hover ticks (delegated) + route blips
  useEffect(() => {
    setSfxEnabled(sound);
    try {
      localStorage.setItem("ptrk-snd", sound ? "1" : "0");
    } catch {
      /* storage blocked */
    }
    if (!sound) return;
    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("a,button")) tick();
    };
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => window.removeEventListener("pointerover", onOver);
  }, [sound]);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    blip();
  }, [pathname]);

  if (!mounted) return null;

  const chip =
    "inline-flex items-center gap-2 border px-3 py-2 font-monospec text-[10px] tracking-[0.25em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime";

  return (
    <>
      {/* System tray — desktop only */}
      <div className="fixed bottom-4 left-4 z-[94] hidden md:flex gap-2">
        <button
          type="button"
          aria-pressed={terminal}
          onClick={() => setTerminal((t) => !t)}
          className={`${chip} ${
            terminal
              ? "border-lime bg-lime/15 text-lime"
              : "border-white/20 bg-void/80 text-secondary hover:border-lime/50 hover:text-lime"
          }`}
        >
          TRM <span className="opacity-50">[~]</span>
        </button>
        <button
          type="button"
          aria-pressed={blueprint}
          onClick={() => setBlueprint((b) => !b)}
          className={`${chip} ${
            blueprint
              ? "border-cyan bg-cyan/15 text-cyan"
              : "border-white/20 bg-void/80 text-secondary hover:border-cyan/50 hover:text-cyan"
          }`}
        >
          BLU <span className="opacity-50">[B]</span>
        </button>
        {!motOff && (
          <button
            type="button"
            aria-pressed={sound}
            onClick={() => setSound((s) => !s)}
            className={`${chip} ${
              sound
                ? "border-orange bg-orange/15 text-orange"
                : "border-white/20 bg-void/80 text-secondary hover:border-orange/50 hover:text-orange"
            }`}
          >
            SND·{sound ? "ON" : "OFF"}
          </button>
        )}
        <button
          type="button"
          aria-pressed={!motOff}
          title="Motion-réteg (decode, reveal, boot, effektek) ki/be"
          onClick={() => {
            const next = !motOff;
            setMotionOff(next);
            setMotOff(next);
            // Clean re-init: every mounted effect re-reads the gate
            window.location.reload();
          }}
          className={`${chip} ${
            !motOff
              ? "border-magenta bg-magenta/15 text-magenta"
              : "border-white/20 bg-void/80 text-secondary hover:border-magenta/50 hover:text-magenta"
          }`}
        >
          MOT·{motOff ? "OFF" : "ON"}
        </button>
      </div>

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
