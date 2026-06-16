"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";

// Wireframe HUD word ("meshes rácsos"): a dark solid extruded body for depth, a faint
// triangle MESH grid over its surface, and bright additive EDGE lines (outline + bevel)
// glowing in the accent colour. Built from the brand font (Chakra Petch) via opentype.js
// -> SVGLoader.createShapes -> ExtrudeGeometry. Cheap (no transmission/PMREM/lights),
// renders identically everywhere. Clamped tilt so it never clips. Decorative, motion-gated.
const PALETTE: Record<string, number> = {
  lime: 0xc2fe0c,
  cyan: 0x01ffff,
  magenta: 0xea027e,
  orange: 0xff8c42,
};

export function Text3D({ word, color = "lime" }: { word: string; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const { SVGLoader } = await import("three/addons/loaders/SVGLoader.js");
      const opentype = (await import("opentype.js")).default;

      const buf = await fetch("/fonts/ChakraPetch-Bold.ttf").then((r) => r.arrayBuffer());
      if (disposed) return;

      const accent = PALETTE[color] ?? PALETTE.lime;
      const font = opentype.parse(buf);
      const d = font.getPath(word, 0, 0, 100).toPathData(2);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`;
      const paths = new SVGLoader().parse(svg).paths;
      const shapes: THREE.Shape[] = [];
      for (const p of paths) for (const s of SVGLoader.createShapes(p)) shapes.push(s);

      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1.4,
        bevelSize: 1.1,
        bevelSegments: 2,
        steps: 1,
      });
      geom.computeBoundingBox();
      const bb = geom.boundingBox!;
      const w = bb.max.x - bb.min.x;
      const h = bb.max.y - bb.min.y;
      geom.translate(-(bb.min.x + w / 2), -(bb.min.y + h / 2), -8);

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 4000);
      const group = new THREE.Group();
      group.scale.y = -1; // SVG y-down -> three y-up
      scene.add(group);

      // 1) dark solid body: occludes the BACK lines so the word reads as a 3D object.
      const fillMat = new THREE.MeshBasicMaterial({
        color: 0x070a09,
        transparent: true,
        opacity: 0.66,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      group.add(new THREE.Mesh(geom, fillMat));

      // 2) faint triangle MESH grid over the surface ("rácsos").
      const wireGeo = new THREE.WireframeGeometry(geom);
      const wireMat = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.LineSegments(wireGeo, wireMat));

      // 3) bright clean EDGES (outline + extrusion + bevel) — additive glow.
      const edgeGeo = new THREE.EdgesGeometry(geom, 22);
      const edgeMat = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.LineSegments(edgeGeo, edgeMat));

      const pointer = new THREE.Vector2(0, 0);
      const onMove = (e: MouseEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };

      // Fit so the word fills only ~60% of the frame -> generous margin (no clipping on tilt).
      const PAD = 1.7;
      const size = () => {
        const r = canvas.getBoundingClientRect();
        const cw = Math.max(1, Math.floor(r.width));
        const ch = Math.max(1, Math.floor(r.height));
        renderer.setSize(cw, ch, false);
        cam.aspect = cw / ch;
        const tan = Math.tan((cam.fov * Math.PI) / 360);
        const distW = (w * PAD) / 2 / (tan * cam.aspect);
        const distH = (h * PAD) / 2 / tan;
        cam.position.z = Math.max(distW, distH, 140);
        cam.updateProjectionMatrix();
      };

      const render = () => renderer.render(scene, cam);
      const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
      const reduced = reducedMotion();
      let raf = 0;
      let inView = false;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!inView) return;
        const t = performance.now() / 1000;
        const ty = clamp(pointer.x * 0.16 + Math.sin(t * 0.3) * 0.09, 0.2);
        const tx = clamp(-pointer.y * 0.11 + Math.sin(t * 0.22) * 0.03, 0.13);
        group.rotation.y += (ty - group.rotation.y) * 0.05;
        group.rotation.x += (tx - group.rotation.x) * 0.05;
        render();
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView && reduced) {
            size();
            render();
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      window.addEventListener("resize", size);
      window.addEventListener("mousemove", onMove, { passive: true });
      size();
      if (reduced) {
        group.rotation.set(-0.09, 0.16, 0);
        render();
      } else {
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", size);
        window.removeEventListener("mousemove", onMove);
        geom.dispose();
        wireGeo.dispose();
        edgeGeo.dispose();
        fillMat.dispose();
        wireMat.dispose();
        edgeMat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [word, color]);

  return <canvas ref={ref} className="w-full h-full block" aria-hidden />;
}
