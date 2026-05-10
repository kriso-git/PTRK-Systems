"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom Marathon-style cursor.
 *
 * The native cursor is hidden by injecting a <style> tag at runtime — this
 * beats any class-based approach because the injected rule lives in <head>
 * with `!important` and cannot be lost to Tailwind utility specificity or
 * SSR/hydration timing issues. The component itself paints a lime crosshair
 * + dot that follows the pointer with smooth easing.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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

    const tick = () => {
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
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

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
      {/* Soft trailing ring — only visible on interactive elements */}
      <div
        ref={ringRef}
        aria-hidden
        className={`fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-300 ${
          show && hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`border border-lime/70 transition-transform duration-200 ease-out ${
            clicking ? "scale-75" : "scale-100"
          }`}
          style={{ width: 28, height: 28 }}
        />
      </div>

      {/* Fast inner dot */}
      <div
        ref={dotRef}
        aria-hidden
        className={`fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-200 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-lime transition-transform duration-150 ${
            clicking ? "scale-150" : "scale-100"
          }`}
          style={{
            width: hovering ? 3 : 4,
            height: hovering ? 3 : 4,
            boxShadow: "0 0 6px rgba(194,254,12,0.7)",
          }}
        />
      </div>
    </>
  );
}
