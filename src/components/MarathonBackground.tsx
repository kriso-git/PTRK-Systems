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
import { gyroState } from "@/lib/gyro";

/**
 * Viewport-fixed Marathon background.
 *
 * Desktop (fine pointer): cursor drives the radial glow centers and the
 * mesh-warp lens. Mobile / touch (coarse pointer): the same CSS vars are
 * auto-panned along a slow Lissajous path so the bg still breathes without
 * any pointer to follow. Both cases share one source of truth — the CSS
 * variables `--mx/--my` (smoothed) and `--cx/--cy` (raw). All decorative
 * canvases (mesh-warp, code-rain) read the same vars off the wrapper, so
 * the whole background reacts coherently.
 */

export function MarathonBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let raf = 0;
    // Smoothed (lerped) position drives the soft glow so it feels weighty.
    let targetX = 0.5;
    let targetY = 0.5;
    let curX = 0.5;
    let curY = 0.5;
    const startedAt = performance.now();

    const setCrisp = (x: number, y: number) => {
      if (!ref.current) return;
      ref.current.style.setProperty("--cx", `${(x * 100).toFixed(2)}%`);
      ref.current.style.setProperty("--cy", `${(y * 100).toFixed(2)}%`);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
      // Crisp position drives the inner spotlight + grid lens — no lag,
      // so the lens stays glued under the cursor.
      setCrisp(targetX, targetY);
    };

    const tick = () => {
      // On coarse-pointer devices (touch), auto-pan along a slow Lissajous
      // curve so the bg keeps breathing without a cursor. The curve crosses
      // the viewport every ~30s on x, ~40s on y, so the motion is calm.
      if (coarsePointer) {
        if (gyroState.active) {
          // Device tilt drives the lens (GyroChip enabled it)
          targetX = gyroState.x;
          targetY = gyroState.y;
        } else {
          const t = (performance.now() - startedAt) / 1000;
          targetX = 0.5 + 0.32 * Math.sin(t * 0.21);
          targetY = 0.5 + 0.28 * Math.sin(t * 0.17 + 1.4);
        }
        setCrisp(targetX, targetY);
      }
      // Snappier lerp than before so the soft glow visibly tracks.
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      if (ref.current) {
        ref.current.style.setProperty("--mx", `${(curX * 100).toFixed(2)}%`);
        ref.current.style.setProperty("--my", `${(curY * 100).toFixed(2)}%`);
      }
      raf = requestAnimationFrame(tick);
    };

    if (!coarsePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
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
      {/* Nebula moved to the R3F StageBackground (mounted in layout.tsx, backmost).
          This wrapper now layers only the code-rain / scanlines / grain over it. */}

      {/* Cursor-following radial glows removed — the nebula's own "torch"
          (it brightens + reveals toward the pointer) is now the cursor light. */}

      {/* Code rain — JS-driven canvas, immune to the global CSS reduced-motion
          override. Falling hex/binary across the entire viewport at low
          opacity. Subtle on top of content but visibly alive on desktop and
          mobile alike. */}
      <CodeRain />

      {/* HUD scanlines — kept very faint and strictly behind content via
          the parent z-0. They breathe at the edge of perception, never
          competing with text. */}
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(194,254,12,0.18) 50%, transparent)",
          animation: "scanline 7s linear infinite",
        }}
      />
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(1,255,255,0.14) 50%, transparent)",
          animation: "scanline 13s linear infinite reverse",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(234,2,126,0.10) 50%, transparent)",
          animation: "scanline 19s linear infinite",
          animationDelay: "5s",
        }}
      />


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

    {/* Right-edge datastream — SIBLING of the z-0 wrapper, not a child:
        inside it the aside's own z-index is trapped in the z-0 stacking
        context and any z-10 content (e.g. the manifesto band bleeding
        into the gutter) paints over it. At root z-[15] it sits above
        content (10), below the nav (40); the §02 slab (z-20) with the
        ACCESS ghost intentionally stays above it. */}
    <RightDataStream />
  </>
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

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

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
    const startedAt = performance.now();

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

    /**
     * Smooth a polyline of sample points using mid-point quadratic curves.
     * Each segment is drawn as `quadraticCurveTo(prev, midpoint(prev, cur))`
     * — produces a continuously differentiable curve that visibly bends
     * around the lens without piecewise-linear "fragmentation" between
     * sample points, even when consecutive points fall on opposite sides
     * of the steep displacement falloff.
     */
    const strokeSmooth = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const cx0 = pts[i].x;
        const cy0 = pts[i].y;
        const ex = (pts[i].x + pts[i + 1].x) / 2;
        const ey = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(cx0, cy0, ex, ey);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    };

    const draw = () => {
      // On coarse-pointer devices: drive the lens center along a slow
      // Lissajous path so the mesh still warps without a cursor.
      if (coarsePointer) {
        if (gyroState.active) {
          mx = w * gyroState.x;
          my = h * gyroState.y;
        } else {
          const t = (performance.now() - startedAt) / 1000;
          mx = w * (0.5 + 0.32 * Math.sin(t * 0.21));
          my = h * (0.5 + 0.28 * Math.sin(t * 0.17 + 1.4));
        }
      }
      // Lerp smoothed cursor toward raw cursor.
      smx += (mx - smx) * 0.22;
      smy += (my - smy) * 0.22;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(194, 254, 12, 0.10)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Responsive cell size: 6 vw clamped 56–96 px (matches the static
      // CSS grid spec we replaced).
      const cell = Math.min(96, Math.max(56, w * 0.06));
      // Lens parameters.
      const radius = Math.min(280, Math.max(180, w * 0.16));
      const radiusSq = radius * radius;
      const strength = 32; // peak displacement in px
      // Sample every 6 px along each line — combined with quadratic
      // smoothing this produces a clean visible curve under the lens.
      const step = 6;

      const displace = (x: number, y: number): { x: number; y: number } => {
        const dx = x - smx;
        const dy = y - smy;
        const distSq = dx * dx + dy * dy;
        if (distSq >= radiusSq || distSq === 0) return { x, y };
        const dist = Math.sqrt(distSq);
        const t = 1 - dist / radius;
        const pull = t * t * strength;
        const ux = dx / dist;
        const uy = dy / dist;
        return { x: x + ux * pull, y: y + uy * pull };
      };

      const pts: { x: number; y: number }[] = [];

      // Vertical lines.
      for (let x = 0; x <= w + cell; x += cell) {
        pts.length = 0;
        for (let y = 0; y <= h; y += step) {
          pts.push(displace(x, y));
        }
        strokeSmooth(pts);
      }

      // Horizontal lines.
      for (let y = 0; y <= h + cell; y += cell) {
        pts.length = 0;
        for (let x = 0; x <= w; x += step) {
          pts.push(displace(x, y));
        }
        strokeSmooth(pts);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!coarsePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }
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
 * Code-rain canvas — Matrix-style falling characters across the full
 * viewport at a low, non-distracting opacity.
 *
 * Each column has its own y-position, speed, and char-cycle phase. JS-driven
 * via requestAnimationFrame, so the global `prefers-reduced-motion` CSS
 * override does NOT silence it (which is the bug that hid the previous
 * CSS-animated edge streams on desktop). DPR-aware, responsive cell width,
 * lime/cyan tint with a subtle "head" highlight on the leading character.
 */
function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CHARS = "0123456789ABCDEF·▓░║▶○◉".split("");

    let dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let cellW = 14;
    let fontPx = 11;
    let cols: {
      y: number;
      speed: number;
      char: string;
      tint: "lime" | "cyan";
      changeAt: number;
    }[] = [];
    let raf = 0;
    let last = performance.now();

    const setupCols = () => {
      cellW = w < 640 ? 16 : 18;
      fontPx = w < 640 ? 10 : 12;
      const count = Math.ceil(w / cellW);
      cols = Array.from({ length: count }, () => ({
        y: Math.random() * h,
        speed: 50 + Math.random() * 110, // px per second
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        tint: Math.random() < 0.18 ? "cyan" : "lime",
        changeAt: 0,
      }));
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupCols();
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Soft fade-out of the previous frame leaves a faint motion trail —
      // characters dissolve as they fall.
      ctx.fillStyle = "rgba(5, 5, 8, 0.28)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        c.y += c.speed * dt;
        if (c.y > h + fontPx) {
          c.y = -fontPx * 2 - Math.random() * h * 0.5;
          c.speed = 50 + Math.random() * 110;
          c.tint = Math.random() < 0.18 ? "cyan" : "lime";
        }
        // Cycle char roughly every 80-180 ms.
        if (now > c.changeAt) {
          c.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          c.changeAt = now + 80 + Math.random() * 100;
        }

        const x = i * cellW;
        // Leading character — slightly brighter "head".
        ctx.fillStyle =
          c.tint === "cyan"
            ? "rgba(1, 255, 255, 0.32)"
            : "rgba(194, 254, 12, 0.32)";
        ctx.fillText(c.char, x, c.y);

        // Two faint trailing characters above the head, additional fade.
        ctx.fillStyle =
          c.tint === "cyan"
            ? "rgba(1, 255, 255, 0.10)"
            : "rgba(194, 254, 12, 0.10)";
        ctx.fillText(
          CHARS[(i * 7 + Math.floor(now / 600)) % CHARS.length],
          x,
          c.y - fontPx
        );
        ctx.fillStyle =
          c.tint === "cyan"
            ? "rgba(1, 255, 255, 0.04)"
            : "rgba(194, 254, 12, 0.04)";
        ctx.fillText(
          CHARS[(i * 13 + Math.floor(now / 900)) % CHARS.length],
          x,
          c.y - fontPx * 2
        );
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Very low overall opacity — the rain should be a barely-there
      // ambient texture, not a competing visual element.
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.16 }}
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
  body: string; // cmd minus its tag prefix — the tag renders as a badge, the body types out
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
  const detected = detectTag(cmd);
  const tag = detected ?? "$";
  const color = TAG_COLOR[tag];
  const body = detected ? cmd.slice(detected.length).trimStart() : cmd;
  return {
    id,
    ts: fmtTs(new Date()),
    tag,
    color,
    cmd,
    body,
    typed: 0,
    state: "typing",
  };
}

/** Live throughput sparkline for the terminal chrome — bars scroll left as new
 *  samples push in. Newest bar is bright; pure canvas, client-only. */
function Sparkline() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
    size();
    const N = 34;
    const vals: number[] = Array.from({ length: N }, (_, i) => 0.2 + 0.25 * Math.abs(Math.sin(i * 0.7)));
    let raf = 0, last = performance.now(), acc = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      acc += now - last; last = now;
      if (acc > 130) { acc = 0; vals.push(0.12 + Math.random() * 0.85); if (vals.length > N) vals.shift(); }
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const bw = w / N;
      for (let i = 0; i < vals.length; i++) {
        const bh = Math.max(1 * dpr, vals[i] * h * 0.92);
        ctx.fillStyle = i === vals.length - 1 ? "#c2fe0c" : "#c2fe0c5c";
        ctx.fillRect(i * bw + 0.5 * dpr, h - bh, bw - 1 * dpr, bh);
      }
    };
    raf = requestAnimationFrame(draw);
    const onR = () => size();
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={ref} className="h-3.5 min-w-0 flex-1" />;
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
        const nextTyped = Math.min(last.typed + 1, last.body.length);
        const settled = nextTyped >= last.body.length;
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
      className="fixed right-0 top-[88px] bottom-4 w-[230px] z-[12] pointer-events-none hidden md:flex flex-col font-monospec"
    >
      {/* Terminal window chrome */}
      <div className="mx-2 border border-b-0 border-lime/30 bg-void/85 backdrop-blur-sm">
        {/* title bar: HUD control dots + node prompt + live dot */}
        <div className="flex items-center gap-1.5 border-b border-lime/15 px-3 py-1.5">
          <span className="h-2 w-2 bg-lime/80" />
          <span className="h-2 w-2 bg-cyan/70" />
          <span className="h-2 w-2 bg-magenta/70" />
          <span className="ml-2 truncate text-[9px] tracking-[0.12em] text-secondary/70">ptrk@node·0a20</span>
          <span className="ml-auto h-1.5 w-1.5 shrink-0 bg-lime cursor-blink" />
        </div>
        {/* status strip: TX·LIVE + live throughput sparkline + latency */}
        <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em]">
          <span className="shrink-0 text-lime">TX·LIVE</span>
          <Sparkline />
          <span className="shrink-0 text-[9px] text-secondary/50">{`${latency.toString().padStart(2, "0")}ms`}</span>
        </div>
      </div>

      {/* Log body — newest at the bottom. Lines fill the column to the
          very top edge; only the topmost 4 rows fade progressively via
          per-line opacity, giving the "pushed up and dissolved" effect
          without leaving an empty black band under the header chip. */}
      <div
        ref={bodyRef}
        className="relative flex-1 mx-2 overflow-hidden border border-lime/30 bg-void/60 backdrop-blur-sm"
      >
        {/* CRT scanlines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#c2fe0c 0 1px,transparent 1px 3px)" }} />
        {/* top dissolve gradient — older rows fade up into the chrome */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-void/95 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-2 pb-1 pt-1">
          {lines.map((ln, i) => {
            const isLast = i === lines.length - 1;
            const isTyping = ln.state === "typing";
            const visible = ln.body.slice(0, ln.typed);
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
                className={`relative flex items-center gap-1.5 overflow-hidden py-[1px] pl-2 text-left text-[10px] leading-[1.5] tracking-[0.04em] ${isLast ? "bg-white/[0.03]" : ""}`}
                style={{ opacity }}
              >
                {/* severity rail */}
                <span aria-hidden className="absolute left-0 top-0 h-full w-[2px]" style={{ background: hex, opacity: isLast ? 1 : 0.55 }} />
                {/* tag badge */}
                <span
                  className="shrink-0 border px-1 text-[8px] leading-[1.5] tracking-normal"
                  style={{ color: hex, borderColor: `${hex}66`, background: `${hex}14` }}
                >
                  {ln.tag}
                </span>
                <span className="min-w-0 flex-1 truncate" style={{ color: hex, textShadow: `0 0 5px ${hex}55` }}>
                  {visible}
                </span>
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
