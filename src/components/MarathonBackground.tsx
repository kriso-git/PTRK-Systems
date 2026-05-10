"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  COMMAND_POOL,
  COLOR_HEX,
  TAG_COLOR,
  detectTag,
  type LineTag,
  type SlotColor,
} from "@/lib/terminal-pool";

/**
 * Viewport-fixed Marathon background.
 *
 * Streams are restricted to the LEFT and RIGHT edges so the central content
 * column (where headings and prose live) stays clean. Plus a dedicated
 * right-edge "waterfall" column with continuously emitted terminal lines —
 * fresh content scrolls down forever.
 */

// Edge-only stream columns (left 0–10%, right 90–100%).
const STREAMS = Array.from({ length: 12 }, (_, i) => {
  const isLeft = i < 6;
  const left = isLeft
    ? (0.5 + i * 1.7).toFixed(2) // 0.5, 2.2, 3.9, 5.6, 7.3, 9.0
    : (90.5 + (i - 6) * 1.7).toFixed(2); // 90.5, 92.2, ..., 99.0
  return {
    left: `${left}%`,
    delay: `${(i * 0.39) % 5}s`,
    duration: `${4.5 + ((i * 0.91) % 3.5)}s`,
    payload:
      i % 3 === 0
        ? `01010011\n11001010\n00110101\n10101100\n01011001\n11100010\n0xEC1153\n0xC2FE0C\nNOD·0A20`
        : i % 3 === 1
        ? `0xEC1153\n0xC2FE0C\nNOD·0A20\nLNK·EC11\n7F-A2-9D\n${(i * 1153)
            .toString(16)
            .toUpperCase()}\nF3X·9D\n0xC2FE0C\nLIVE`
        : `► JEL.STREAM\n${(i * 7919).toString(16).toUpperCase()}\nNOD·${i
            .toString()
            .padStart(2, "0")}A20\n████████\n░░░░ LIVE\n║║║║║║\n11001010\n0xEC1153`,
  };
});

export function MarathonBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    // Smoothed (lerped) position drives the soft glow so it feels weighty.
    let targetX = 0.5;
    let targetY = 0.5;
    let curX = 0.5;
    let curY = 0.5;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
      // Crisp position drives the inner spotlight + grid lens — no lag,
      // so the lens stays glued under the cursor.
      if (ref.current) {
        ref.current.style.setProperty(
          "--cx",
          `${(targetX * 100).toFixed(2)}%`
        );
        ref.current.style.setProperty(
          "--cy",
          `${(targetY * 100).toFixed(2)}%`
        );
      }
    };

    const tick = () => {
      // Snappier lerp than before so the soft glow visibly tracks.
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      if (ref.current) {
        ref.current.style.setProperty("--mx", `${(curX * 100).toFixed(2)}%`);
        ref.current.style.setProperty("--my", `${(curY * 100).toFixed(2)}%`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{
        ["--mx" as string]: "50%",
        ["--my" as string]: "50%",
        ["--cx" as string]: "50%",
        ["--cy" as string]: "50%",
      }}
    >
      {/* Wide, lerped lime glow — feels weighty, drags slightly behind. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 700px at var(--mx) var(--my), rgba(194,254,12,0.18) 0%, rgba(194,254,12,0.06) 30%, transparent 70%)",
        }}
      />
      {/* Mid-size cyan glow — also lerped, so it trails by a few frames. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 320px at var(--mx) var(--my), rgba(1,255,255,0.18) 0%, rgba(1,255,255,0.06) 50%, transparent 75%)",
        }}
      />
      {/* Crisp inner spotlight — anchored to the *raw* cursor position so
          it feels glued under the pointer with zero lag. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 130px at var(--cx) var(--cy), rgba(255,255,255,0.12) 0%, rgba(194,254,12,0.18) 30%, transparent 75%)",
        }}
      />

      {/* Edge-only vertical streams */}
      <div className="absolute inset-0">
        {STREAMS.map((s, i) => (
          <pre
            key={i}
            className="absolute top-0 font-monospec text-[10px] leading-tight whitespace-pre"
            style={{
              left: s.left,
              color: i % 4 === 0 ? "#01ffff" : "#c2fe0c",
              opacity: 0.18,
              animation: `dataStream ${s.duration} linear ${s.delay} infinite`,
            }}
          >
            {s.payload}
          </pre>
        ))}
      </div>

      {/* Right-edge designed datastream with marquee + live typers */}
      <RightDataStream />

      {/* HUD scanlines */}
      <div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(194,254,12,0.85) 50%, transparent)",
          animation: "scanline 7s linear infinite",
        }}
      />
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(1,255,255,0.7) 50%, transparent)",
          animation: "scanline 13s linear infinite reverse",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(234,2,126,0.6) 50%, transparent)",
          animation: "scanline 19s linear infinite",
          animationDelay: "5s",
        }}
      />

      {/* Single mesh layer rendered to a <canvas>. Every grid line is
          drawn as a series of short segments whose endpoints are pushed
          radially outward from the cursor when within a lens radius — so
          the mesh visibly bends/curves under the pointer as it moves
          across the viewport. Cell size scales with viewport for
          responsiveness. */}
      <WarpMesh />

      {/* Radial dot noise */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          opacity: 0.08,
          backgroundImage:
            "radial-gradient(#01ffff 0.5px, transparent 0.5px), radial-gradient(#c2fe0c 0.5px, transparent 0.5px)",
          backgroundSize: "140px 140px, 220px 220px",
          backgroundPosition: "0 0, 70px 70px",
        }}
      />

      {/* Top + bottom edge HUD bars */}
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(194,254,12,0.9) 20%, rgba(1,255,255,0.9) 50%, rgba(234,2,126,0.9) 80%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(234,2,126,0.9) 20%, rgba(1,255,255,0.9) 50%, rgba(194,254,12,0.9) 80%, transparent 100%)",
        }}
      />
    </div>
  );
}

/**
 * Canvas-rendered mesh that curves around the cursor.
 *
 * Each grid line is drawn as a polyline of short segments. For every
 * segment endpoint within a fixed radius of the cursor, we push the point
 * radially outward from the cursor by a falloff function — so straight
 * grid lines bow away from the pointer like a magnifying lens lifts a
 * piece of paper. Outside the radius the mesh stays perfectly straight,
 * keeping CPU cost low and the effect localised.
 *
 * Cell size scales with viewport (clamped 56–96 px) for responsiveness.
 */
function WarpMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let mx = w / 2;
    let my = h / 2;
    // Smoothed cursor — gives the lens a tiny inertia so it eases out of
    // the cell instead of snapping.
    let smx = mx;
    let smy = my;
    let raf = 0;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const draw = () => {
      // Lerp smoothed cursor toward raw cursor.
      smx += (mx - smx) * 0.22;
      smy += (my - smy) * 0.22;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(194, 254, 12, 0.10)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      // Responsive cell size: 6 vw clamped 56–96 px (matches the static
      // CSS grid spec we replaced).
      const cell = Math.min(96, Math.max(56, w * 0.06));
      // Lens parameters.
      const radius = Math.min(280, Math.max(180, w * 0.16));
      const radiusSq = radius * radius;
      const strength = 32; // peak displacement in px
      // Sample every ~10 px along each line so the curve is smooth even
      // when a line passes through the steep part of the falloff.
      const step = 10;

      // Vertical lines.
      for (let x = 0; x <= w + cell; x += cell) {
        ctx.beginPath();
        let started = false;
        for (let y = 0; y <= h; y += step) {
          const dx = x - smx;
          const dy = y - smy;
          const distSq = dx * dx + dy * dy;
          let px = x;
          let py = y;
          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / radius;
            // Quadratic falloff for a smooth bulge.
            const pull = t * t * strength;
            const ux = dx / dist;
            const uy = dy / dist;
            px = x + ux * pull;
            py = y + uy * pull;
          }
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines.
      for (let y = 0; y <= h + cell; y += cell) {
        ctx.beginPath();
        let started = false;
        for (let x = 0; x <= w; x += step) {
          const dx = x - smx;
          const dy = y - smy;
          const distSq = dx * dx + dy * dy;
          let px = x;
          let py = y;
          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / radius;
            const pull = t * t * strength;
            const ux = dx / dist;
            const uy = dy / dist;
            px = x + ux * pull;
            py = y + uy * pull;
          }
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

/**
 * Right-edge live data stream — a flowing terminal log feed.
 *
 *  - Header chip (top): TX·LIVE indicator + cycling latency + blinking dot.
 *  - Log body: bottom-anchored flow where new lines spawn at the BOTTOM,
 *    type out character by character, then settle and get pushed up by the
 *    next new line. Older lines fade behind a top gradient. Reads as a
 *    `tail -f`-style live programming feed.
 *  - Footer chip (bottom): line counter + tag-color status pulse dot.
 */

type FlowLineState = "typing" | "settled";

type FlowLine = {
  id: number;
  ts: string;
  tag: LineTag;
  color: SlotColor;
  cmd: string;
  typed: number;
  state: FlowLineState;
};

/**
 * Default cap before the body container has been measured. The real cap
 * is computed dynamically on mount + on resize so lines fill the entire
 * available terminal height instead of just the bottom band.
 */
const MAX_LINES_DEFAULT = 14;

/** Per-line height in px (text-[10px] · leading-[1.5] = 15px + py-[1px] = 17px). */
const LINE_HEIGHT_PX = 17;
/** Vertical padding inside the log body (pt-1 + pb-1 = 8px). */
const BODY_VPAD_PX = 8;

function fmtTs(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function makeLine(id: number, prevCmd: string | null): FlowLine {
  let cmd = COMMAND_POOL[Math.floor(Math.random() * COMMAND_POOL.length)];
  for (let attempt = 0; attempt < 4 && cmd === prevCmd; attempt++) {
    cmd = COMMAND_POOL[Math.floor(Math.random() * COMMAND_POOL.length)];
  }
  const tag = detectTag(cmd) ?? "$";
  const color = TAG_COLOR[tag];
  return {
    id,
    ts: fmtTs(new Date()),
    tag,
    color,
    cmd,
    typed: 0,
    state: "typing",
  };
}

function RightDataStream() {
  const [latency, setLatency] = useState(12);
  const [lines, setLines] = useState<FlowLine[]>([]);
  const idCounterRef = useRef<number>(0);
  const linesRef = useRef<FlowLine[]>([]);
  // Single source of truth — drives both the displayed typed-count AND the
  // tick scheduler. React state is only used to trigger re-renders.
  const phaseRef = useRef<"typing" | "gap">("typing");
  const gapUntilRef = useRef<number>(0);
  const nextCharAtRef = useRef<number>(0);
  // Dynamic line cap, computed from the actual log-body height so lines
  // fill the entire visible terminal column instead of just the bottom band.
  const maxLinesRef = useRef<number>(MAX_LINES_DEFAULT);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Compute how many lines actually fit. The CSS class line-height +
  // padding gives us a fallback, but real rendered height depends on the
  // resolved monospec font metrics — which we only know AFTER lines have
  // rendered. We measure both the body and the first rendered line's
  // offsetHeight, then top-up settled rows or trim surplus so the column
  // is always packed right up against the header chip.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reconcile = () => {
      const el = bodyRef.current;
      if (!el) return;
      const h = el.clientHeight;
      if (h <= 0) return;

      // Measure actual line height from a rendered row; fall back to the
      // CSS-derived constant on the very first pass before any lines are
      // committed.
      const firstLine = el.querySelector<HTMLElement>("[data-flow-line]");
      const lineH =
        firstLine && firstLine.offsetHeight > 0
          ? firstLine.offsetHeight
          : LINE_HEIGHT_PX;

      const usable = Math.max(0, h - BODY_VPAD_PX);
      // +4 buffer so the column always sits noticeably over-filled —
      // overflow-hidden trims the surplus, and the top edge is always
      // packed right up under the header chip with no empty black band.
      const newCap = Math.max(8, Math.ceil(usable / lineH) + 4);
      maxLinesRef.current = newCap;

      // Trim oldest so the top of the array always matches the top of the
      // visible region — this keeps the per-line opacity fade aligned with
      // the rows actually at the top edge. We never top up: lines must be
      // earned by live spawning so the box visibly fills over time.
      const arr = linesRef.current;
      if (arr.length > newCap) {
        const trimmed = arr.slice(arr.length - newCap);
        linesRef.current = trimmed;
        setLines(trimmed.slice());
      }
    };

    reconcile();
    // After the seed's first commit, re-measure with the now-known real
    // line-height and reconcile (trim/topup) accordingly.
    const raf = requestAnimationFrame(() => reconcile());

    const obs = new ResizeObserver(() => reconcile());
    if (bodyRef.current) obs.observe(bodyRef.current);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  // Cycle latency for header chip.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setInterval(() => {
      setLatency(8 + Math.floor(Math.random() * 22));
    }, 1400);
    return () => clearInterval(t);
  }, []);

  // Single 30 ms heartbeat drives the flow. State is held in refs so the
  // tick loop can never get out of sync with React render. We commit a
  // fresh snapshot of `linesRef.current` to React state each tick that
  // produced a visible change. Decorative typing — runs regardless of
  // prefers-reduced-motion; users that find it bothersome can hide via CSS.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Start the terminal effectively empty — a single typing line at the
    // bottom — so the user actually watches the log build up over time
    // when they open the page, rather than landing on an already-full box.
    // First line is deferred to client mount → no SSR/CSR Math.random
    // mismatch on initial paint.
    const first = makeLine(0, null);
    first.state = "typing";
    first.typed = 0;
    idCounterRef.current = 1;
    linesRef.current = [first];
    phaseRef.current = "typing";
    nextCharAtRef.current = performance.now() + 80;
    setLines([first]);

    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      const now = performance.now();
      let dirty = false;

      if (phaseRef.current === "typing") {
        if (now < nextCharAtRef.current) return;
        const arr = linesRef.current;
        const lastIdx = arr.length - 1;
        if (lastIdx < 0) {
          phaseRef.current = "gap";
          gapUntilRef.current = now;
          return;
        }
        const last = arr[lastIdx];
        const nextTyped = Math.min(last.typed + 1, last.cmd.length);
        const settled = nextTyped >= last.cmd.length;
        const updated: FlowLine = {
          ...last,
          typed: nextTyped,
          state: settled ? "settled" : "typing",
        };
        const newArr = arr.slice(0, lastIdx);
        newArr.push(updated);
        linesRef.current = newArr;
        dirty = true;
        if (settled) {
          phaseRef.current = "gap";
          gapUntilRef.current = now + 420 + Math.random() * 760;
        } else {
          nextCharAtRef.current = now + 45 + Math.random() * 55;
        }
      } else {
        // gap → spawn next typing line when timer elapses
        if (now < gapUntilRef.current) return;
        const id = idCounterRef.current++;
        const arr = linesRef.current;
        const prev = arr.length > 0 ? arr[arr.length - 1].cmd : null;
        const line = makeLine(id, prev);
        const newArr = [...arr, line];
        // Drop oldest lines only once the box is genuinely full — measured
        // dynamically so the column fills its full visible height before
        // anything starts disappearing off the top.
        while (newArr.length > maxLinesRef.current) newArr.shift();
        linesRef.current = newArr;
        phaseRef.current = "typing";
        nextCharAtRef.current = now + 60;
        dirty = true;
      }

      if (dirty) {
        setLines(linesRef.current.slice());
      }
    }, 30);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const lastColor =
    lines.length > 0 ? COLOR_HEX[lines[lines.length - 1].color] : COLOR_HEX.lime;

  return (
    <aside
      aria-hidden
      className="fixed right-0 top-[88px] bottom-4 w-[230px] z-[40] pointer-events-none hidden md:flex flex-col font-monospec"
    >
      {/* Header chip */}
      <div className="mx-2 px-3 py-2 border border-b-0 border-lime/30 bg-void/85 backdrop-blur-sm flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase">
        <span className="w-1.5 h-1.5 bg-lime cursor-blink shrink-0" />
        <span className="text-lime">TX·LIVE</span>
        <span className="text-secondary/40">/</span>
        <span className="text-secondary/70">LANE·A</span>
        <span className="ml-auto text-secondary/50 text-[9px]">{`${latency
          .toString()
          .padStart(2, "0")}ms`}</span>
      </div>

      {/* Log body — newest at the bottom. Lines fill the column to the
          very top edge; only the topmost 4 rows fade progressively via
          per-line opacity, giving the "pushed up and dissolved" effect
          without leaving an empty black band under the header chip. */}
      <div
        ref={bodyRef}
        className="relative flex-1 mx-2 overflow-hidden border border-lime/30 bg-void/60 backdrop-blur-sm"
      >
        <div className="absolute inset-0 flex flex-col justify-end px-2 pb-1 pt-1">
          {lines.map((ln, i) => {
            const isLast = i === lines.length - 1;
            const isTyping = ln.state === "typing";
            const visible = ln.cmd.slice(0, ln.typed);
            // Distance from the top of the rendered stack — i=0 is the
            // oldest visible row, closest to being pushed off. A 7-step
            // gradient gives an elegant fade-out as rows drift up toward
            // the TX·LIVE chip; rows 7+ stay at full readability.
            const distFromTop = i;
            const settledOpacity =
              distFromTop === 0
                ? 0.08
                : distFromTop === 1
                ? 0.2
                : distFromTop === 2
                ? 0.36
                : distFromTop === 3
                ? 0.55
                : distFromTop === 4
                ? 0.72
                : distFromTop === 5
                ? 0.85
                : distFromTop === 6
                ? 0.92
                : 0.95;
            const opacity = isLast ? 1 : settledOpacity;
            const hex = COLOR_HEX[ln.color];
            return (
              <div
                key={ln.id}
                data-flow-line
                className="text-[10px] leading-[1.5] tracking-[0.04em] text-left py-[1px] flex items-center gap-1.5 overflow-hidden"
                style={{
                  opacity,
                  color: hex,
                  textShadow: `0 0 5px ${hex}55`,
                }}
              >
                <span className="text-secondary/40 shrink-0">{ln.ts}</span>
                <span className="truncate min-w-0 flex-1">{visible}</span>
                {isLast && (
                  <span
                    aria-hidden
                    className="shrink-0"
                    style={{
                      display: "inline-block",
                      width: 5,
                      height: 10,
                      background: hex,
                      boxShadow: `0 0 4px ${hex}`,
                      animation: isTyping
                        ? "none"
                        : "blink 0.85s steps(1) infinite",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer chip */}
      <div
        className="mx-2 px-3 py-2 border border-t-0 bg-void/85 backdrop-blur-sm flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase transition-colors"
        style={{ borderColor: `${lastColor}55` }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            background: lastColor,
            boxShadow: `0 0 4px ${lastColor}`,
            animation: "blink 1.1s steps(1) infinite",
          }}
        />
        <span style={{ color: lastColor }}>SYNC</span>
        <span className="ml-auto text-secondary/50 text-[9px]">{`LINES·${idCounterRef.current
          .toString()
          .padStart(3, "0")}`}</span>
      </div>
    </aside>
  );
}
