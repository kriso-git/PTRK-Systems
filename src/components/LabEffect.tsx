"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";
import { FX } from "@/lib/fx";
import type { Ctx, Effect } from "@/lib/fx/lib";

/**
 * Generic in-card runner for a single probe effect. Lazy: the WebGL context is
 * created only when the card scrolls into view; the loop pauses when offscreen.
 * Transparent renderer so additive effects sit on the card surface. Reduced
 * motion renders a single frame. Full teardown on unmount.
 */
export function LabEffect({ fx }: { fx: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const create = FX[fx];
    if (!canvas || !create) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const pointer = new THREE.Vector2(0, 0);
    const ctx: Ctx = { renderer, pointer, width: 1, height: 1 };
    const reduced = reducedMotion();
    let eff: Effect | null = null;
    let raf = 0;
    let last = performance.now();
    let inView = false;
    let started = false;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width));
      const h = Math.max(1, Math.floor(r.height));
      renderer.setSize(w, h, false);
      ctx.width = w;
      ctx.height = h;
      eff?.resize(w, h);
    };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const start = () => {
      if (started) return;
      started = true;
      eff = create();
      eff.init(ctx);
      size();
      if (reduced) {
        renderer.autoClear = true;
        eff.frame(1.2, 0);
        return;
      }
      last = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!inView) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        renderer.autoClear = true;
        eff!.frame(now / 1000, dt);
      };
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);
    window.addEventListener("resize", size);
    canvas.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      canvas.removeEventListener("mousemove", onMove);
      eff?.dispose();
      renderer.dispose();
    };
  }, [fx]);

  return <canvas ref={ref} className="w-full h-full block" aria-hidden />;
}
