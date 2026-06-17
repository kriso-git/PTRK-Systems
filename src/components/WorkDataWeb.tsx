"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * WorkDataWeb — a per-project "data web" that sits top-right of a case debrief
 * hero, themed to the project's domain. F3XYKEE → a military network topology,
 * MolekulaX → a molecular lattice, Donna → a radial delivery net. Animated data
 * "comets" travel the graph. Pure 2D canvas (works without a GPU), motion-gated.
 */

const HEX: Record<string, string> = { lime: "#c2fe0c", cyan: "#01ffff", magenta: "#ea027e", orange: "#ff8c42" };
const a2 = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, "0");

type Motif = "network" | "molecular" | "radial";
const CONFIG: Record<string, { motif: Motif; label: string }> = {
  "f3xykee-terminal": { motif: "network", label: "NET·TOPOLOGY" },
  molekulax: { motif: "molecular", label: "MOL·LATTICE" },
  "donna-pizza": { motif: "radial", label: "DELIVERY·NET" },
};

type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean; fixed: boolean };
type Comet = { from: number; to: number; t: number; speed: number };

export function WorkDataWeb({ projectId, color, className }: { projectId: string; color: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = reducedMotion();
    const hex = HEX[color] ?? HEX.lime;
    const cfg = CONFIG[projectId] ?? { motif: "network" as Motif, label: "DATA·NET" };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let comets: Comet[] = [];

    const build = () => {
      nodes = [];
      edges = [];
      const min = Math.min(W, H);
      if (cfg.motif === "network") {
        const N = 24;
        for (let i = 0; i < N; i++) {
          const hub = i < 3;
          nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7, r: hub ? 3.4 : 1.7, hub, fixed: false });
        }
      } else if (cfg.motif === "molecular") {
        const clusters = 4;
        for (let c = 0; c < clusters; c++) {
          const cx = (0.22 + 0.56 * Math.random()) * W;
          const cy = (0.22 + 0.56 * Math.random()) * H;
          const ringN = 5 + Math.floor(Math.random() * 2);
          const rad = min * 0.085;
          const base = nodes.length;
          nodes.push({ x: cx, y: cy, vx: 0, vy: 0, r: 2.6, hub: true, fixed: true });
          for (let k = 0; k < ringN; k++) {
            const ang = (k / ringN) * Math.PI * 2;
            nodes.push({ x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad, vx: 0, vy: 0, r: 1.7, hub: false, fixed: true });
            edges.push([base, base + 1 + k]);
            edges.push([base + 1 + k, base + 1 + ((k + 1) % ringN)]);
          }
        }
      } else {
        const cx = W * 0.5, cy = H * 0.46;
        nodes.push({ x: cx, y: cy, vx: 0, vy: 0, r: 4, hub: true, fixed: true });
        [0.26, 0.46].forEach((rr, ri) => {
          const n = 6 + ri * 5;
          for (let k = 0; k < n; k++) {
            const ang = (k / n) * Math.PI * 2 + ri * 0.45;
            const idx = nodes.length;
            nodes.push({ x: cx + Math.cos(ang) * min * rr, y: cy + Math.sin(ang) * min * rr, vx: 0, vy: 0, r: 1.7, hub: false, fixed: true });
            if (ri === 0) edges.push([0, idx]);
            else edges.push([idx, 1 + (k % 6)]);
          }
        });
      }
      // data comets travel between random nodes
      comets = Array.from({ length: 4 }, () => ({ from: (Math.random() * nodes.length) | 0, to: (Math.random() * nodes.length) | 0, t: Math.random(), speed: 0.3 + Math.random() * 0.5 }));
    };

    const resize = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // drift free nodes
      if (!reduced) {
        for (const n of nodes) {
          if (n.fixed) continue;
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 4 || n.x > W - 4) n.vx *= -1;
          if (n.y < 4 || n.y > H - 4) n.vy *= -1;
        }
      }

      // edges
      ctx.lineWidth = 1;
      if (cfg.motif === "network") {
        const maxD = Math.min(W, H) * 0.36;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
            const d = Math.hypot(dx, dy);
            if (d < maxD) {
              ctx.strokeStyle = hex + a2((1 - d / maxD) * 0.42);
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      } else {
        ctx.strokeStyle = hex + "4d";
        for (const [a, b] of edges) {
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }

      // comets (data flow)
      if (!reduced) {
        for (const cm of comets) {
          cm.t += cm.speed * dt;
          if (cm.t >= 1) { cm.from = cm.to; cm.to = (Math.random() * nodes.length) | 0; cm.t = 0; cm.speed = 0.3 + Math.random() * 0.5; }
          const f = nodes[cm.from], to = nodes[cm.to];
          if (!f || !to) continue;
          const cx = f.x + (to.x - f.x) * cm.t;
          const cy = f.y + (to.y - f.y) * cm.t;
          ctx.fillStyle = hex;
          ctx.shadowColor = hex;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // nodes
      for (const n of nodes) {
        const pulse = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * 2 + n.x * 0.04 + n.y * 0.03);
        ctx.fillStyle = hex;
        ctx.globalAlpha = n.hub ? 0.95 : 0.55 + 0.35 * pulse;
        ctx.shadowColor = hex;
        ctx.shadowBlur = n.hub ? 9 : 4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        if (n.hub) {
          ctx.strokeStyle = hex + "66";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 4 + (reduced ? 0 : 2 * Math.sin(t * 1.5)), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [projectId, color]);

  const cfg = CONFIG[projectId] ?? { label: "DATA·NET" };
  const tx = color === "cyan" ? "text-cyan" : color === "magenta" ? "text-magenta" : color === "orange" ? "text-orange" : "text-lime";

  return (
    <div className={className} aria-hidden>
      <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_58%_44%,rgba(5,5,8,0.62),rgba(5,5,8,0.18)_54%,transparent_78%)]">
        {/* HUD corner ticks */}
        <span className={`absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
        <span className={`absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
        <span className={`absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
        <span className={`absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
        <div className={`absolute left-3 top-2.5 font-monospec text-[9px] uppercase tracking-[0.3em] ${tx} opacity-80`}>
          ◉ {cfg.label}
        </div>
        <canvas ref={ref} className="h-full w-full" />
      </div>
    </div>
  );
}
