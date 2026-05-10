"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom Marathon-style cursor.
 *
 * Renders a tiny precision dot with a soft lime aura, plus a motion-trace
 * trail of fading dots behind the cursor as it moves — gives the pointer
 * a sense of velocity without competing with content.
 *
 * The native cursor is hidden by injecting a <style> tag at runtime — this
 * beats any class-based approach because the injected rule lives in <head>
 * with `!important` and cannot be lost to Tailwind utility specificity or
 * SSR/hydration timing issues.
 *
 * Trail rendered to a single canvas (additive blending, low opacity) so
 * the cost is fixed regardless of how many points are in flight.
 */
const TRAIL_LENGTH = 14; // segments retained
const TRAIL_FADE = 0.92; // per-frame alpha decay

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Activate cursor hiding IMMEDIATELY — no early return for reduced
    // motion, because the cursor itself is interaction not animation.
    document.documentElement.classList.add("ptrk-cursor-on");

    // Belt-and-suspenders: also inject a <style> tag at runtime. The CSS
    // layer rule in globals.css already handles this, but a freshly-injected
    // tag wins over any browser extension or HMR weirdness.
    let styleEl = document.getElementById(
      "ptrk-cursor-style"
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "ptrk-cursor-style";
      styleEl.textContent = `
        html.ptrk-cursor-on, html.ptrk-cursor-on * { cursor: none !important; }
        html.ptrk-cursor-on input[type="text"],
        html.ptrk-cursor-on input[type="email"],
        html.ptrk-cursor-on input[type="search"],
        html.ptrk-cursor-on input[type="url"],
        html.ptrk-cursor-on input[type="tel"],
        html.ptrk-cursor-on input[type="number"],
        html.ptrk-cursor-on input[type="password"],
        html.ptrk-cursor-on textarea { cursor: text !important; }
      `;
      document.head.appendChild(styleEl);
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let rx = tx;
    let ry = ty;
    // Trail: ring buffer of recent positions.
    const trail: { x: number; y: number; age: number }[] = [];
    let lastSampleAt = 0;

    // Canvas setup for trail rendering.
    const canvas = trailCanvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    let dpr = 1;
    let cw = 0;
    let ch = 0;

    const resize = () => {
      if (!canvas || !ctx) return;
      dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        setTouch(true);
        return;
      }
      setTouch(false);
      tx = e.clientX;
      ty = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor='hover']"
      );
      setHovering(Boolean(interactive));
    };
    const onMouseMove = (e: MouseEvent) => {
      // Fallback for environments where pointer events misreport.
      tx = e.clientX;
      ty = e.clientY;
      setVisible(true);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setClicking(true);
    };
    const onPointerUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = (now: number) => {
      if (reducedMotion) {
        cx = tx;
        cy = ty;
        rx = tx;
        ry = ty;
      } else {
        cx += (tx - cx) * 0.32;
        cy += (ty - cy) * 0.32;
        rx += (tx - rx) * 0.14;
        ry += (ty - ry) * 0.14;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      // Sample a trail point ~every 16ms (per frame at 60fps) so the trail
      // sticks tight to the cursor velocity instead of pooling on stops.
      if (now - lastSampleAt >= 14) {
        lastSampleAt = now;
        trail.unshift({ x: cx, y: cy, age: 0 });
        if (trail.length > TRAIL_LENGTH) trail.length = TRAIL_LENGTH;
      }
      // Age all points so they fade in time, not just by index.
      for (const p of trail) p.age += 1;

      // Render trail.
      if (ctx && cw > 0 && ch > 0) {
        // Soft fade of previous frame instead of full clear, gives the
        // motion trace a subtle ghost halo even when the pointer is still.
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${1 - TRAIL_FADE})`;
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < trail.length; i++) {
          const p = trail[i];
          const t = 1 - i / TRAIL_LENGTH;
          const radius = 1.5 + t * 4.5;
          const alpha = t * 0.55;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(194,254,12,${alpha})`;
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("ptrk-cursor-on");
      // Keep the injected style cached — it's idempotent and a re-mount
      // (route change, HMR) shouldn't flash the native cursor.
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  const show = visible && !touch;

  return (
    <>
      {/* Trail canvas — full viewport, additive blending, fades each frame */}
      <canvas
        ref={trailCanvasRef}
        aria-hidden
        className={`fixed inset-0 z-[9996] pointer-events-none transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Soft outer ring — only visible on interactive elements */}
      <div
        ref={ringRef}
        aria-hidden
        className={`fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-300 ${
          show && hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`border border-lime/60 transition-transform duration-200 ease-out ${
            clicking ? "scale-75" : "scale-100"
          }`}
          style={{ width: 22, height: 22 }}
        />
      </div>

      {/* Soft aura — always under the dot, gives the cursor weight */}
      <div
        ref={auraRef}
        aria-hidden
        className={`fixed top-0 left-0 z-[9997] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="rounded-full"
          style={{
            width: 18,
            height: 18,
            background:
              "radial-gradient(circle, rgba(194,254,12,0.45) 0%, rgba(194,254,12,0.15) 40%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Tiny precision dot */}
      <div
        ref={dotRef}
        aria-hidden
        className={`fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-lime rounded-full transition-transform duration-150 ${
            clicking ? "scale-150" : "scale-100"
          }`}
          style={{
            width: hovering ? 1.5 : 2,
            height: hovering ? 1.5 : 2,
            boxShadow: "0 0 3px rgba(194,254,12,0.85)",
          }}
        />
      </div>
    </>
  );
}
