"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { reducedMotion } from "@/lib/motion";
import { markBootReady } from "@/lib/boot-ready";
import { PixelIcon } from "./PixelIcon";

// Removes the pre-paint black cover (added by the inline script in layout) that
// prevents the page from flashing before this React overlay mounts.
const dropPreCover = () => {
  try {
    document.documentElement.classList.remove("booting");
  } catch {}
};

/**
 * SystemBoot — the new loading screen. A borealis-style sci-fi boot: pixel-icon
 * status lines stream in, a big % counter climbs to 100, then the overlay clears
 * to reveal the site. Pure DOM/CSS (NO WebGL) so it is fast and NEVER depends on
 * the GPU. Session-gated + reduced-motion aware (skips instantly).
 */

type Step = { icon: string; label: string; status: string };

const STEPS: Step[] = [
  { icon: "computers-devices-electronics-chipset", label: "BOOT RENDER CORE", status: "OK" },
  { icon: "computers-devices-electronics-harddisk", label: "MOUNT /HUD/OVERLAY", status: "OK" },
  { icon: "internet-network-wifi-monitor", label: "LINK NOD·0A20070A", status: "OK" },
  { icon: "coding-apps-websites-database", label: "LOAD SHADERS / ATLAS", status: "OK" },
  { icon: "coding-apps-websites-shield-lock", label: "RLS POLICY / AUTH", status: "OK" },
  { icon: "computers-devices-electronics-monitor", label: "GPU / RENDER", status: "ONLINE" },
];

const STEP_MS = 300;
const HOLD_MS = 520;
const CLEAR_MS = 620;

export function SystemBoot() {
  const [phase, setPhase] = useState<"hidden" | "boot" | "clear">("hidden");
  const [done, setDone] = useState(0); // completed steps
  const [pct, setPct] = useState(0);
  const rafRef = useRef(0);

  // session gate
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ptrk-booted") || reducedMotion()) {
        sessionStorage.setItem("ptrk-booted", "1");
        // returning / reduced-motion visitor: no boot -> reveal the page now and
        // let the one-shot load animations (hero count-ups) run immediately.
        dropPreCover();
        markBootReady();
        return;
      }
      sessionStorage.setItem("ptrk-booted", "1");
    } catch {
      dropPreCover();
      markBootReady();
      return;
    }
    setPhase("boot");
  }, []);

  // step reveal + counter + skip
  useEffect(() => {
    if (phase !== "boot") return;
    // The React boot overlay (z-200) is now committed and covering, so the
    // pre-paint cover can go — when the halves split open they reveal the PAGE,
    // not the cover.
    dropPreCover();
    const t0 = performance.now();
    const total = STEPS.length * STEP_MS;
    let stepTimer = 0 as unknown as ReturnType<typeof setInterval>;
    let n = 0;
    stepTimer = setInterval(() => {
      n += 1;
      setDone(n);
      if (n >= STEPS.length) clearInterval(stepTimer);
    }, STEP_MS);

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / total);
      setPct(Math.round(p * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("clear"), HOLD_MS);
    };
    rafRef.current = requestAnimationFrame(tick);

    const skip = () => { setDone(STEPS.length); setPct(100); setPhase("clear"); };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      clearInterval(stepTimer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "clear") return;
    // the halves are now opening -> the hero is being revealed, so let its
    // count-ups start exactly as the user sees them.
    markBootReady();
    const t = setTimeout(() => setPhase("hidden"), CLEAR_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;

  const online = pct >= 100;
  const clearing = phase === "clear";

  return (
    <div aria-hidden className="fixed inset-0 z-[200]">
      {/* dark cover split into two halves that OPEN from the centre on reveal,
          a bright lime edge sweeping outward as the page is exposed */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#050508]"
        style={
          clearing
            ? {
                transform: "translateY(-100%)",
                transition: `transform ${CLEAR_MS}ms cubic-bezier(0.76,0,0.24,1)`,
                borderBottom: "2px solid rgba(194,254,12,0.9)",
                boxShadow: "0 10px 45px rgba(194,254,12,0.5)",
              }
            : undefined
        }
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050508]"
        style={
          clearing
            ? {
                transform: "translateY(100%)",
                transition: `transform ${CLEAR_MS}ms cubic-bezier(0.76,0,0.24,1)`,
                borderTop: "2px solid rgba(194,254,12,0.9)",
                boxShadow: "0 -10px 45px rgba(194,254,12,0.5)",
              }
            : undefined
        }
      />
      {/* content layer (transparent), fades fast on reveal so nothing squishes */}
      <div className="absolute inset-0 overflow-hidden text-lime" style={clearing ? { opacity: 0, transition: "opacity 150ms ease" } : undefined}>
          {/* faint scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #c2fe0c 0 1px, transparent 1px 3px)" }}
          />
          {/* corner HUD frame */}
          <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 border-l-2 border-t-2 border-lime/40" />
          <div className="pointer-events-none absolute right-5 top-5 h-10 w-10 border-r-2 border-t-2 border-lime/40" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-10 w-10 border-b-2 border-l-2 border-lime/40" />
          <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b-2 border-r-2 border-lime/40" />

          <div className="absolute inset-0 flex flex-col justify-center px-[7vw]">
        {/* header */}
        <div className="mb-8 flex items-center gap-3 font-monospec text-[11px] uppercase tracking-[0.4em] text-lime/70">
          <Image src="/logo-mark.png" alt="" width={22} height={22} className="h-5 w-5" />
          <span>PTRK-SYSTEMS</span>
          <span className="text-secondary/40">/</span>
          <span className="text-secondary/70">SYSTEM BOOT</span>
        </div>

        {/* status lines */}
        <div className="max-w-[640px] font-monospec text-[12px] md:text-[13px] leading-[2.1] tracking-[0.12em]">
          {STEPS.map((s, i) => {
            const shown = i < done;
            const active = i === done;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3"
                style={{ opacity: shown ? 1 : active ? 0.5 : 0.12, transition: "opacity 200ms ease" }}
              >
                <PixelIcon name={s.icon} width={16} height={16} className={shown ? "text-lime" : "text-secondary/50"} aria-hidden />
                <span className="text-primary/90">{s.label}</span>
                <span className="flex-1 border-b border-dotted border-lime/20" />
                <span className={shown ? "text-lime" : "text-secondary/40"}>{shown ? s.status : active ? "···" : ""}</span>
              </div>
            );
          })}
        </div>

        {/* big % counter */}
        <div className="mt-12 flex items-end gap-6">
          <div className="font-sequel leading-none tracking-[-0.04em] text-primary text-[clamp(64px,12vw,170px)]">
            {String(pct).padStart(2, "0")}
            <span className="text-lime">%</span>
          </div>
          <div className="mb-3 flex-1">
            <div className="mb-2 font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary/60">
              {online ? "System online" : "Initializing"}
            </div>
            <div className="h-[3px] w-full max-w-[460px] overflow-hidden bg-white/10">
              <div className="h-full bg-lime transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

          <div className="absolute bottom-7 left-0 right-0 text-center font-monospec text-[9px] uppercase tracking-[0.35em] text-secondary/40">
            Press any key to skip
          </div>
      </div>

      {/* reveal flash: a brief lime glow as the HUD opens to the page */}
      <div
        className="pointer-events-none absolute inset-0 bg-lime"
        style={{
          opacity: clearing ? 0 : online ? 0.14 : 0,
          transition: clearing ? `opacity ${CLEAR_MS}ms ease` : "opacity 120ms ease",
        }}
      />
    </div>
  );
}
