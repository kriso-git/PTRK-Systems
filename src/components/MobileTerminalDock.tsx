"use client";

import { useEffect, useRef, useState } from "react";
import {
  COMMAND_POOL,
  TAG_COLOR,
  COLOR_HEX,
  type LineTag,
} from "@/lib/terminal-pool";
import { enableGyro, gyroSupported, gyroState } from "@/lib/gyro";

function pickLine() {
  return COMMAND_POOL[(Math.random() * COMMAND_POOL.length) | 0];
}

function lineColor(line: string): string {
  const tag = (Object.keys(TAG_COLOR) as LineTag[]).find((t) =>
    line.startsWith(t),
  );
  return tag ? COLOR_HEX[TAG_COLOR[tag]] : COLOR_HEX.lime;
}

/**
 * Mobile counterpart of the right-edge terminal aside (which is hidden
 * below md): a slim TX·LIVE ticker docked to the bottom edge typing
 * lines from the shared command pool; tap to expand a log sheet.
 * Includes the GYRO chip (device-tilt lens) where supported.
 */
export function MobileTerminalDock() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [gyro, setGyro] = useState<"off" | "on" | "unavailable">("off");
  const lineRef = useRef(pickLine());

  useEffect(() => {
    setMounted(true);
    if (!gyroSupported()) setGyro("unavailable");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(lineRef.current);
      return;
    }
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const typeNext = () => {
      const line = lineRef.current;
      if (charIdx <= line.length) {
        setTyped(line.slice(0, charIdx));
        charIdx += 1;
        timer = setTimeout(typeNext, 45);
      } else {
        timer = setTimeout(() => {
          setLog((prev) => [...prev.slice(-13), line]);
          lineRef.current = pickLine();
          charIdx = 0;
          typeNext();
        }, 2200);
      }
    };
    typeNext();
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[93]">
      {/* Expanded log sheet */}
      {open && (
        <div className="border-t border-lime/30 bg-void/97 backdrop-blur-md max-h-[45vh] overflow-y-auto px-4 py-3">
          <div className="font-monospec text-[9px] tracking-[0.3em] uppercase text-secondary mb-2">
            SYS.LOG · stream
          </div>
          {log.length ? (
            log.map((l, i) => (
              <div
                key={`${i}-${l.slice(0, 12)}`}
                className="font-monospec text-[10px] leading-relaxed tracking-[0.06em] truncate"
                style={{ color: lineColor(l) }}
              >
                {l}
              </div>
            ))
          ) : (
            <div className="font-monospec text-[10px] text-secondary/60">
              … stream inicializálás
            </div>
          )}
        </div>
      )}

      {/* Dock bar */}
      <div
        className="flex items-center gap-3 border-t border-lime/25 bg-void/90 backdrop-blur-md px-4 h-9 pb-[env(safe-area-inset-bottom)]"
        style={{ minHeight: "calc(2.25rem + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Terminál log megnyitása"
          className="flex items-center gap-2 min-w-0 flex-1 text-left"
        >
          <span className="w-1.5 h-1.5 bg-lime cursor-blink shrink-0" />
          <span className="font-monospec text-[9px] tracking-[0.3em] text-lime shrink-0">
            TX·LIVE
          </span>
          <span className="font-monospec text-[10px] tracking-[0.06em] text-secondary truncate">
            {typed}
            <span className="inline-block w-1.5 h-3 bg-lime/70 align-middle ml-0.5" />
          </span>
        </button>

        {gyro !== "unavailable" && (
          <button
            type="button"
            onClick={async () => {
              if (gyroState.active) return;
              const ok = await enableGyro();
              setGyro(ok ? "on" : "unavailable");
            }}
            aria-pressed={gyro === "on"}
            className={`shrink-0 font-monospec text-[9px] tracking-[0.25em] uppercase border px-2 py-1 transition-colors ${
              gyro === "on"
                ? "border-cyan/60 text-cyan bg-cyan/10"
                : "border-white/20 text-secondary"
            }`}
          >
            {gyro === "on" ? "◢ GYRO·ON" : "◢ GYRO"}
          </button>
        )}
      </div>
    </div>
  );
}
