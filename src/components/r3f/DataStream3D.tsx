"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COMMAND_POOL, COLOR_HEX, TAG_COLOR, detectTag } from "@/lib/terminal-pool";
import { reducedMotion } from "@/lib/motion";
import { readSignal } from "@/lib/r3f/scroll-signal";

/**
 * DataStream3D — the right-edge live console reimagined as a holographic 3D
 * data-stream. Each log line is a glowing monospace text plane (rendered to a
 * cached canvas texture using the real font) that flows up a perspective column,
 * receding + dissolving into the void at the top, new lines surfacing at the
 * bottom. The whole column tilts with the cursor for a hologram parallax.
 *
 * Dedicated transparent canvas (the page / nebula shows through). No View, no
 * post-processing (so none of the opaque-scissor pitfalls). DOM fallback lives
 * in MarathonBackground for visitors without WebGL.
 */

const FONT = "'SFMono-Regular','Menlo','Consolas','Liberation Mono',monospace";

// text -> glowing canvas texture, cached (pool is finite, so this stays small).
const texCache = new Map<string, THREE.CanvasTexture>();
function lineTexture(text: string, hex: string): THREE.CanvasTexture {
  const key = `${text}|${hex}`;
  const hit = texCache.get(key);
  if (hit) return hit;
  const H = 72;
  const FS = 40;
  const pad = 14;
  const meas = document.createElement("canvas").getContext("2d")!;
  meas.font = `${FS}px ${FONT}`;
  const w = Math.ceil(meas.measureText(text).width) + pad * 2;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.font = `${FS}px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.shadowColor = hex;
  ctx.shadowBlur = 11;
  ctx.fillStyle = hex;
  ctx.fillText(text, pad, H / 2 + 2);
  ctx.shadowBlur = 0;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  texCache.set(key, tex);
  return tex;
}

type Row = { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial };

function Stream({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const cursor = useRef(0);
  const inited = useRef(false);

  // Deterministic, well-spread traversal of the command pool.
  const order = useMemo(() => {
    const L = COMMAND_POOL.length;
    return Array.from({ length: L }, (_, i) => COMMAND_POOL[(i * 37) % L]);
  }, []);

  const rows = useMemo<Row[]>(() => {
    const N = 18;
    return Array.from({ length: N }, () => {
      const mat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      mesh.renderOrder = 3;
      return { mesh, mat };
    });
  }, []);

  // side rails for framing
  const rails = useMemo(() => {
    const g = new THREE.Group();
    const mk = () => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0xc2fe0c, transparent: true, opacity: 0.18, depthTest: false, depthWrite: false })
      );
      m.renderOrder = 1;
      g.add(m);
      return m;
    };
    return { g, left: mk(), right: mk() };
  }, []);

  const lineH = () => viewport.height * 0.044;
  const gap = () => viewport.height * 0.059;

  const assign = (row: Row) => {
    const cmd = order[cursor.current % order.length];
    cursor.current += 1;
    const tag = detectTag(cmd) ?? "$";
    const hex = COLOR_HEX[TAG_COLOR[tag]];
    const tex = lineTexture(cmd, hex);
    row.mat.map = tex;
    row.mat.color.set(0xffffff);
    row.mat.needsUpdate = true;
    const h = lineH();
    const aspect = (tex.image as HTMLCanvasElement).width / (tex.image as HTMLCanvasElement).height;
    const w = h * aspect;
    row.mesh.scale.set(w, h, 1);
    row.mesh.position.x = -viewport.width / 2 + w / 2 + viewport.width * 0.08;
  };

  useFrame((state, dtRaw) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(dtRaw, 0.05);
    const top = viewport.height / 2;
    const bottom = -viewport.height / 2;
    const span = top - bottom;

    if (!inited.current) {
      inited.current = true;
      g.add(rails.g);
      rows.forEach((row, i) => {
        g.add(row.mesh);
        assign(row);
        row.mesh.position.y = bottom + i * gap();
      });
      // rails
      const railW = viewport.width * 0.006;
      [rails.left, rails.right].forEach((m, i) => {
        m.scale.set(railW, viewport.height * 1.1, 1);
        m.position.set((i === 0 ? -1 : 1) * viewport.width * 0.4, 0, -0.2);
      });
    }

    const speed = reduced ? 0 : viewport.height * 0.11;
    rows.forEach((row) => {
      if (!reduced) row.mesh.position.y += speed * dt;
      if (row.mesh.position.y > top + gap()) {
        let minY = Infinity;
        rows.forEach((r) => { if (r.mesh.position.y < minY) minY = r.mesh.position.y; });
        row.mesh.position.y = minY - gap();
        assign(row);
      }
      const tnorm = (row.mesh.position.y - bottom) / span; // 0 bottom .. 1 top
      const fade = Math.min(1, tnorm * 3.5) * Math.min(1, (1 - tnorm) * 3);
      row.mat.opacity = Math.max(0, fade) * 0.96;
    });

    // cursor parallax + a slow auto-sway (so it reads as 3D even at rest) +
    // a fixed receding tilt so the column climbs away into the void.
    const s = readSignal();
    const sway = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.45) * 0.07;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, (s.mx - 0.5) * 0.5 + sway, 3, dt);
    g.rotation.x = -0.2;
  });

  return <group ref={group} />;
}

export function DataStream3D() {
  const reduced = reducedMotion();
  return (
    <Canvas
      className="!absolute !inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.setClearAlpha(0); }}
      camera={{ position: [0, 0, 5], fov: 40 }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden
    >
      <Stream reduced={reduced} />
    </Canvas>
  );
}
