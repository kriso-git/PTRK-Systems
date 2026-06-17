"use client";

import { useEffect, useRef } from "react";
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
