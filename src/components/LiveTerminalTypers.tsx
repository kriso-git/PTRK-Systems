"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  COLOR_HEX,
  poolForRoute,
  type SlotColor,
  type SpawnBias,
} from "@/lib/terminal-pool";

/**
 * Document-anchored scattered live typers — background decoration.
 *
 * Each typer:
 *  - Picks a random position somewhere across the FULL document (not the
 *    viewport) every cycle, so they stay anchored to the page and scroll
 *    away naturally as the user scrolls — they don't trail the viewport.
 *  - Types out a command character by character with a blinking block cursor
 *  - Holds, erases, then teleports somewhere new with a fresh command
 *
 * The component is mounted INSIDE the page-height flex container (next to
 * `<MarathonScatter />`), positioned `absolute inset-0` so it sizes to the
 * full document. Each route gets its own command pool and spawn bias, so
 * the four tabs feel like four different rooms.
 *
 * Z-0 in document flow (same plane as MarathonScatter), below content
 * sections (which get explicit z-10 via `<main>`).
 */

const TYPER_COUNT = 7;

type Phase = "type" | "hold" | "erase" | "gap";

/**
 * Pick a random `{top, left}` for a typer. Top is a percentage of the
 * absolute parent (which fills the full document), so typers spread across
 * the entire page height instead of just the first viewport. Left avoids
 * the rightmost ~18vw which is reserved for the <RightDataStream /> aside.
 *
 * `bias` lets each route concentrate typers in a distinct zone so the
 * scatter pattern visibly differs per tab.
 */
function pickRandomPos(bias: SpawnBias): { top: number; left: number } {
  let left: number;
  switch (bias) {
    case "left-heavy":
      // Most typers cluster in the left gutter, a few in the center.
      left =
        Math.random() < 0.65
          ? 1 + Math.random() * 14
          : 18 + Math.random() * 56;
      break;
    case "scattered":
      // Even spread across the safe zone.
      left =
        Math.random() < 0.4
          ? 1 + Math.random() * 13
          : 8 + Math.random() * 68;
      break;
    case "top-cluster":
    case "bottom-cluster":
      // Same horizontal spread as scattered; vertical bias handled below.
      left =
        Math.random() < 0.45
          ? 2 + Math.random() * 12
          : 8 + Math.random() * 68;
      break;
  }

  let top: number;
  switch (bias) {
    case "top-cluster":
      // Heavy weight on the upper half of the page.
      top = Math.random() < 0.7 ? 2 + Math.random() * 45 : 50 + Math.random() * 45;
      break;
    case "bottom-cluster":
      // Heavy weight on the lower half.
      top = Math.random() < 0.7 ? 50 + Math.random() * 45 : 2 + Math.random() * 45;
      break;
    default:
      top = 2 + Math.random() * 95;
  }
  return { top, left };
}

function pickRandomCmd(pool: string[], prev: string | null): string {
  for (let attempt = 0; attempt < 4; attempt++) {
    const cmd = pool[Math.floor(Math.random() * pool.length)];
    if (cmd !== prev) return cmd;
  }
  return pool[0];
}

const SLOT_COLORS: SlotColor[] = ["lime", "cyan", "magenta", "orange"];

export function LiveTerminalTypers() {
  const pathname = usePathname();
  const { commands, bias } = poolForRoute(pathname);
  // `key={pathname}` forces a fresh remount per route so each tab gets a
  // brand-new set of randomized positions and a fresh command set.
  return (
    <div
      key={pathname}
      aria-hidden
      id="live-typers"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {Array.from({ length: TYPER_COUNT }).map((_, i) => (
        <Typer key={i} seed={i} commands={commands} bias={bias} />
      ))}
    </div>
  );
}

function Typer({
  seed,
  commands,
  bias,
}: {
  seed: number;
  commands: string[];
  bias: SpawnBias;
}) {
  const [text, setText] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number }>(() =>
    pickRandomPos(bias)
  );
  const [color, setColor] = useState<SlotColor>(
    () => SLOT_COLORS[seed % SLOT_COLORS.length]
  );
  const [typing, setTyping] = useState(false);

  // Each typer gets a fixed-per-mount opacity. A touch above the static
  // MarathonScatter dust so the live typing actually reads through the
  // page bg without competing with foreground content.
  const baseOpacityRef = useRef<number>(
    0.32 + ((seed * 13) % 18) / 100
  );

  // Tick-driven state machine via useRef refs. Single setInterval heartbeat
  // keeps the loop self-driving and immune to setTimeout-chain breakage,
  // HMR, and strict-mode double mounts.
  const cmdRef = useRef<string>(commands[(seed * 7) % commands.length]);
  const phaseRef = useRef<Phase>("type");
  const idxRef = useRef<number>(0);
  const nextAtRef = useRef<number>(0);
  // Keep latest pool/bias accessible inside the long-lived tick closure.
  const commandsRef = useRef(commands);
  const biasRef = useRef(bias);
  commandsRef.current = commands;
  biasRef.current = bias;

  useEffect(() => {
    if (typeof window === "undefined") return;

    nextAtRef.current = performance.now() + 80 + seed * 110;

    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      const now = performance.now();
      if (now < nextAtRef.current) return;

      const phase = phaseRef.current;
      const cmd = cmdRef.current;

      if (phase === "type") {
        const next = idxRef.current + 1;
        idxRef.current = next;
        setText(cmd.slice(0, next));
        setTyping(true);
        if (next >= cmd.length) {
          phaseRef.current = "hold";
          setTyping(false);
          nextAtRef.current = now + 1200 + Math.random() * 1200;
        } else {
          nextAtRef.current = now + 45 + Math.random() * 65;
        }
      } else if (phase === "hold") {
        phaseRef.current = "erase";
        nextAtRef.current = now + 80;
      } else if (phase === "erase") {
        const next = idxRef.current - 1;
        idxRef.current = next;
        setText(cmd.slice(0, Math.max(next, 0)));
        if (next <= 0) {
          phaseRef.current = "gap";
          nextAtRef.current = now + 220 + Math.random() * 320;
        } else {
          nextAtRef.current = now + 16 + Math.random() * 14;
        }
      } else {
        // gap → pick a fresh command + colour and start typing again at the
        // SAME position. Typers stay anchored where they spawned for the
        // duration of the route — fresh positions only happen on route
        // change (the parent remounts via key={pathname}). This reads as
        // "background log activity at fixed terminals" rather than
        // teleporting overlay text.
        const newCmd = pickRandomCmd(commandsRef.current, cmd);
        cmdRef.current = newCmd;
        idxRef.current = 0;
        setColor(
          SLOT_COLORS[Math.floor(Math.random() * SLOT_COLORS.length)]
        );
        setText("");
        phaseRef.current = "type";
        nextAtRef.current = now + 60;
      }
    }, 25);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [seed]);

  // No text → render nothing. Avoids leaving a stray cursor or empty box
  // visible during the teleport gap between commands.
  if (text.length === 0) return null;

  const hex = COLOR_HEX[color];
  const opacity = baseOpacityRef.current;

  return (
    <span
      className="absolute font-monospec text-[11px] tracking-[0.04em] whitespace-nowrap"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        color: hex,
        opacity,
      }}
    >
      <span>{text}</span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          width: 5,
          height: 11,
          background: hex,
          marginLeft: 1,
          // Solid block while actively typing; blinks while holding so the
          // viewer reads it as "the program just finished typing".
          animation: typing ? "none" : "blink 0.85s steps(1) infinite",
        }}
      />
    </span>
  );
}
