"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

const CHARS = "01<>/_\\|#▓░·";

/**
 * Cursor-reactive ASCII character field (Codrops "Efecto" lineage) –
 * canvas 2D, zero dependencies. Cells brighten + rescramble near the
 * cursor; idle cells drift on a slow sine wave. 24fps cap, DPR locked
 * to 1, sparse checkerboard grid, pauses when offscreen/hidden.
 * Reduced-motion renders a single static frame.
 */
export function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = reducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const CELL = 14;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let grid: { ch: string; phase: number }[] = [];
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let last = 0;
    let visible = true;

    const rand = () => CHARS[(Math.random() * CHARS.length) | 0];

    // ctx.font does NOT resolve CSS custom properties – an unparseable
    // assignment is silently ignored (default 10px sans-serif). Resolve
    // the next/font family name once at setup.
    const monoFam =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-monospec")
        .trim() || "monospace";
    const FONT = `11px ${monoFam}, monospace`;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.floor(rect.width));
      h = canvas.height = Math.max(1, Math.floor(rect.height));
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      grid = Array.from({ length: cols * rows }, () => ({
        ch: rand(),
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || now - last < 41) return; // 24fps cap
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);
      ctx.font = FONT;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if ((r + c) % 2) continue; // sparse checkerboard
          const i = r * cols + c;
          const cell = grid[i];
          const x = c * CELL;
          const y = r * CELL;

          // Fine pointer: INVISIBLE at rest – the field only materializes
          // around the cursor (the resting speckle layer read as "dirt").
          // Coarse pointer (touch): a very faint breathing wave instead.
          let alpha = coarse
            ? 0.025 + 0.035 * (0.5 + 0.5 * Math.sin(t * 0.7 + cell.phase))
            : 0;

          if (!coarse) {
            const dx = x - mx;
            const dy = y - my;
            const distSq = dx * dx + dy * dy;
            if (distSq < 32400) {
              // within 180px – materialize + rescramble
              const p = 1 - Math.sqrt(distSq) / 180;
              alpha = Math.min(0.34, p * 0.34);
              if (Math.random() < p * 0.35) cell.ch = rand();
            }
          } else if (Math.random() < 0.002) {
            cell.ch = rand();
          }

          if (alpha < 0.05) continue;
          ctx.fillStyle = `rgba(194, 254, 12, ${alpha.toFixed(3)})`;
          ctx.fillText(cell.ch, x, y);
        }
      }
    };

    resize();

    if (reduced) {
      // Reduced motion: render NOTHING – a frozen character frame reads
      // as dirt/noise stuck on the page, worse than absence.
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    const onVis = () => {
      visible = document.visibilityState === "visible" && inView;
    };
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        visible = inView && document.visibilityState === "visible";
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden />;
}
