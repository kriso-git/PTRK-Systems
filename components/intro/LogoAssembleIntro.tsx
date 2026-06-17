"use client";

/**
 * PTRK-Systems — Boot Intro / Concept B: "LOGO ASSEMBLE / MATERIALIZE"
 * --------------------------------------------------------------------
 * Scattered instanced shards fly in from chaos and lock into the shape of
 * the lime PTRK "P"-tile mark, with a light sweep + neon edge glow as it
 * solidifies, a short settle, then it dissolves and the intro auto-replays
 * on a ~6s loop (preview behaviour).
 *
 * Self-contained: only the allowed packages are imported. Target positions
 * are sampled live from /logo-mark.png pixels (offscreen canvas); a robust
 * procedural P-tile mask is used as a fallback so the component can never
 * render an empty / black screen.
 */

import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/* ---------------------------------------------------------------- brand */
const VOID = "#050508";
const LIME = "#c2fe0c";
const CYAN = "#01ffff";
const MAGENTA = "#ea027e";
const ORANGE = "#ff8c42";

const C_LIME = new THREE.Color(LIME);
const C_CYAN = new THREE.Color(CYAN);
const C_MAGENTA = new THREE.Color(MAGENTA);
const C_ORANGE = new THREE.Color(ORANGE);

/* loop / phase timing (seconds) */
const LOOP = 6.0;
const T_ASSEMBLE = 2.4; // chaos -> locked
const T_SWEEP = 1.0; // light sweep across the locked mark
const T_SETTLE = 1.4; // crisp hold
const T_DISSOLVE = 1.0; // dissolve back to chaos
const GRID = 48; // sample resolution (GRID x GRID candidate cells)

/* ----------------------------------------------------------- utilities */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/* Deterministic hash -> pseudo random in [0,1) (stable per shard index) */
function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/* ----------------------------------------------------------------------
 * Procedural P-tile mask. Mirrors public/logo-mark.svg:
 *   - 240x240 tile centred in a 320 box (margin 40)
 *   - top-right 45deg corner cut
 *   - white "P" knocked out
 * u,v are in [0,1] over the tile bounds (origin bottom-left).
 * Returns true where the LIME body is solid (i.e. a valid target cell).
 * -------------------------------------------------------------------- */
function proceduralMask(u: number, v: number): boolean {
  // map tile-local [0,1] back to the 320 viewbox coords used by the svg
  const x = 40 + u * 240;
  const y = 40 + (1 - v) * 240; // svg y is top-down

  // outside the 240 tile
  if (x < 40 || x > 280 || y < 40 || y > 280) return false;

  // top-right corner cut: path 217.6,40 -> 280,40 -> 280,102.4
  // cut removes the triangle where (x-217.6) + (102.4-y) > 0  in that corner
  if (x > 217.6 && y < 102.4) {
    if (x - 217.6 > y - 40) return false;
  }

  // The "P" is knocked OUT (white), so those cells are NOT solid lime.
  // Approximate the Chakra-Petch bold P within the tile.
  // P bounding box (tuned to the svg glyph): stem + bowl.
  const pL = 118; // left of stem
  const pR = 210; // right edge of bowl
  const pT = 96; // top
  const pB = 248; // baseline bottom
  if (x >= pL && x <= pR && y >= pT && y <= pB) {
    const stemR = 150; // stem right edge
    const bowlB = 178; // bowl bottom (where stem becomes thin)
    const innerL = 150;
    const innerR = 188;
    const innerT = 120;
    const innerB = 158;
    // stem (full height vertical bar)
    const inStem = x <= stemR;
    // bowl outer (upper rounded block)
    const inBowl = y <= bowlB;
    // counter (the hole inside the bowl) stays solid lime
    const inCounter =
      x >= innerL && x <= innerR && y >= innerT && y <= innerB;
    if ((inStem || inBowl) && !inCounter) {
      return false; // knocked-out glyph -> not lime
    }
  }
  return true;
}

/* ----------------------------------------------------------------------
 * Build target shard set. Tries to sample /logo-mark.png; falls back to
 * the procedural mask. Returns flat arrays consumed by the instanced mesh.
 * -------------------------------------------------------------------- */
type ShardData = {
  positions: Float32Array; // target xyz (3 per shard)
  colors: Float32Array; // base rgb (3 per shard)
  scales: Float32Array; // per-shard scale
  count: number;
};

function buildFromMask(
  sample: (u: number, v: number) => boolean,
  worldSize: number
): ShardData {
  const px: number[] = [];
  const py: number[] = [];
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      const u = (gx + 0.5) / GRID;
      const v = (gy + 0.5) / GRID;
      if (sample(u, v)) {
        px.push(u);
        py.push(v);
      }
    }
  }
  const count = px.length || 1;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const cellW = worldSize / GRID;

  for (let i = 0; i < count; i++) {
    const u = px[i];
    const v = py[i];
    const wx = (u - 0.5) * worldSize;
    const wy = (v - 0.5) * worldSize;
    // small z jitter so the slab has depth and catches light
    const wz = (hash(i * 1.7) - 0.5) * cellW * 1.4;
    positions[i * 3 + 0] = wx;
    positions[i * 3 + 1] = wy;
    positions[i * 3 + 2] = wz;

    // colour: dominant lime, with rare accent shards near the edges
    const edge =
      Math.abs(u - 0.5) > 0.36 || Math.abs(v - 0.5) > 0.36 ? 1 : 0;
    const r = hash(i * 3.3);
    let c = C_LIME;
    if (edge && r > 0.86) c = C_CYAN;
    else if (edge && r > 0.74) c = C_MAGENTA;
    else if (r > 0.965) c = C_ORANGE;
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    scales[i] = cellW * (0.78 + hash(i * 5.1) * 0.34);
  }
  return { positions, colors, scales, count };
}

/* ----------------------------------------------------------------- hook */
function useShardTargets(worldSize: number): ShardData {
  const [data, setData] = useState<ShardData>(() =>
    buildFromMask(proceduralMask, worldSize)
  );

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      try {
        const S = 160;
        const cnv = document.createElement("canvas");
        cnv.width = S;
        cnv.height = S;
        const ctx = cnv.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, S, S);
        const buf = ctx.getImageData(0, 0, S, S).data;
        // sampler: lime (non-void, non-white) opaque pixel => solid target
        const sample = (u: number, v: number) => {
          const sx = Math.min(S - 1, Math.max(0, Math.floor(u * S)));
          const sy = Math.min(S - 1, Math.max(0, Math.floor((1 - v) * S)));
          const idx = (sy * S + sx) * 4;
          const r = buf[idx];
          const g = buf[idx + 1];
          const b = buf[idx + 2];
          const a = buf[idx + 3];
          if (a < 80) return false; // transparent background
          // lime body is high-green, mid-red, low-blue; reject white P + void
          const isWhite = r > 220 && g > 220 && b > 220;
          const isVoid = r < 40 && g < 40 && b < 40;
          return g > 120 && b < 140 && !isWhite && !isVoid;
        };
        const built = buildFromMask(sample, worldSize);
        if (built.count > 40) setData(built); // sanity guard
      } catch {
        /* keep procedural fallback */
      }
    };
    img.onerror = () => {
      /* keep procedural fallback */
    };
    img.src = "/logo-mark.png";
    return () => {
      alive = false;
    };
  }, [worldSize]);

  return data;
}

/* --------------------------------------------------------- shard field */
const _dummy = new THREE.Object3D();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _baseCol = new THREE.Color();
const _curCol = new THREE.Color();

function ShardField({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const WORLD = 5.2;
  const data = useShardTargets(WORLD);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  // per-shard chaos source state (stable across frames for this dataset)
  const chaos = useMemo(() => {
    const n = data.count;
    const start = new Float32Array(n * 3);
    const spin = new Float32Array(n * 3);
    const delay = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // scatter on a shell around the mark
      const a = hash(i * 12.9) * Math.PI * 2;
      const b = Math.acos(2 * hash(i * 78.2) - 1);
      const rad = 7 + hash(i * 4.4) * 9;
      start[i * 3 + 0] = Math.sin(b) * Math.cos(a) * rad;
      start[i * 3 + 1] = Math.sin(b) * Math.sin(a) * rad * 0.7;
      start[i * 3 + 2] = Math.cos(b) * rad - 3;
      spin[i * 3 + 0] = (hash(i * 1.3) - 0.5) * 14;
      spin[i * 3 + 1] = (hash(i * 9.7) - 0.5) * 14;
      spin[i * 3 + 2] = (hash(i * 5.9) - 0.5) * 14;
      // staggered arrival: outer-ring shards arrive a touch later
      delay[i] = hash(i * 2.2) * 0.5;
    }
    return { start, spin, delay };
  }, [data]);

  // write static instanceColor once per dataset
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < data.count; i++) {
      _baseCol.fromArray(data.colors, i * 3);
      mesh.setColorAt(i, _baseCol);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.count = data.count;
  }, [data]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime % LOOP;

    /* ---- global phase progress ---- */
    // assemble 0..1
    const aRaw = clamp01(t / T_ASSEMBLE);
    // dissolve window starts at end of settle
    const dStart = T_ASSEMBLE + T_SWEEP + T_SETTLE;
    const dRaw = clamp01((t - dStart) / T_DISSOLVE);
    // overall "solidity" 0 chaos -> 1 locked
    const solidity = (1 - dRaw) * aRaw + 0; // dissolve overrides at end

    // light sweep position (vertical band crossing the mark), only meaningful
    // during sweep+settle; runs 0..1 across that combined window
    const sweepT = clamp01((t - T_ASSEMBLE) / (T_SWEEP + 0.4));
    const sweepY = (sweepT * 2 - 1) * 3.6; // world Y of the bright band

    const ptr = pointer.current;
    for (let i = 0; i < data.count; i++) {
      const sx = chaos.start[i * 3 + 0];
      const sy = chaos.start[i * 3 + 1];
      const sz = chaos.start[i * 3 + 2];
      const tx = data.positions[i * 3 + 0];
      const ty = data.positions[i * 3 + 1];
      const tz = data.positions[i * 3 + 2];

      // per-shard assemble progress with stagger
      const d = chaos.delay[i];
      const pa = easeOutCubic(clamp01((aRaw - d) / (1 - d + 1e-3)));
      const pd = easeInCubic(dRaw); // shared dissolve
      // blended progress: 1 = at target, 0 = at chaos source
      const p = pa * (1 - pd);

      // position: lerp chaos -> target, plus a small overshoot snap
      _v.set(
        sx + (tx - sx) * p,
        sy + (ty - sy) * p,
        sz + (tz - sz) * p
      );
      // gentle parallax once mostly locked
      const lockAmt = clamp01((p - 0.7) / 0.3);
      _v.x += ptr.x * 0.32 * lockAmt;
      _v.y += ptr.y * 0.32 * lockAmt;

      // rotation: spinning while travelling, snapping to flat when locked
      const rot = (1 - p) * (1 - p);
      _euler.set(
        chaos.spin[i * 3 + 0] * rot * 0.5 +
          state.clock.elapsedTime * 0.0,
        chaos.spin[i * 3 + 1] * rot * 0.5,
        chaos.spin[i * 3 + 2] * rot * 0.5
      );
      _q.setFromEuler(_euler);

      // scale: shards pop to full as they lock; shrink during dissolve
      let sc = data.scales[i];
      const grow = 0.25 + 0.75 * easeOutCubic(p);
      sc *= grow;
      // light-sweep bump: shards near the sweep band briefly enlarge + glow
      const bandDist = Math.abs(ty - sweepY);
      const band = Math.exp(-(bandDist * bandDist) / 0.18) * sweepT *
        (1 - sweepT) * 4;
      sc *= 1 + band * 0.5;

      _dummy.position.copy(_v);
      _dummy.quaternion.copy(_q);
      _dummy.scale.setScalar(Math.max(0.0001, sc));
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);

      // colour: ramp toward bright lock colour; sweep band flashes white-hot
      _baseCol.fromArray(data.colors, i * 3);
      const lockGlow = 0.45 + 0.55 * p;
      _curCol.copy(_baseCol).multiplyScalar(lockGlow);
      if (band > 0.05) {
        _curCol.lerp(new THREE.Color(1, 1, 1), Math.min(0.9, band));
      }
      mesh.setColorAt(i, _curCol);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // overall emissive lift on the material as it solidifies
    if (matRef.current) {
      const settleHold =
        t > T_ASSEMBLE && t < dStart ? 1 : solidity;
      matRef.current.emissiveIntensity = 0.6 + settleHold * 1.7;
    }

    // group: slow cinematic yaw + subtle breathing, parallax-tilted
    if (groupRef.current) {
      const g = groupRef.current;
      const breathe = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
      g.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.25) * 0.18 + ptr.x * 0.12;
      g.rotation.x = -ptr.y * 0.12 + breathe;
      const s = 1 + breathe * 0.5;
      g.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined as any, undefined as any, Math.max(1, data.count)]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 0.65]} />
        <meshStandardMaterial
          ref={matRef}
          vertexColors
          metalness={0.35}
          roughness={0.25}
          emissive={LIME}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------- scanning ring sweep */
function ScanRing() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime % LOOP;
    const m = ref.current;
    if (!m) return;
    // expands during assemble + sweep, fades during settle/dissolve
    const grow = clamp01(t / (T_ASSEMBLE + T_SWEEP));
    const r = 0.4 + easeOutCubic(grow) * 6.5;
    m.scale.setScalar(r);
    const vis =
      t < T_ASSEMBLE + T_SWEEP
        ? Math.sin((grow) * Math.PI) * 0.9
        : 0;
    if (matRef.current) matRef.current.opacity = vis * 0.5;
    m.rotation.z = state.clock.elapsedTime * 0.4;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1.2]}>
      <ringGeometry args={[0.96, 1, 96]} />
      <meshBasicMaterial
        ref={matRef}
        color={CYAN}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* --------------------------------------------------- camera rig + lights */
function Rig({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useFrame((state) => {
    const ptr = pointer.current;
    // subtle dolly-in pulse synced to the loop start
    const t = state.clock.elapsedTime % LOOP;
    const dolly = 9.4 - easeOutCubic(clamp01(t / T_ASSEMBLE)) * 0.6;
    camera.position.x += (ptr.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (ptr.y * 0.8 - camera.position.y) * 0.04;
    camera.position.z += (dolly - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------------------------------------------------------- scene root */
function Scene() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <color attach="background" args={[VOID]} />
      <fog attach="fog" args={[VOID, 12, 24]} />

      {/* key + rim lights tuned to the neon palette */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} color={"#ffffff"} />
      <pointLight position={[-6, -2, 4]} intensity={60} color={CYAN} distance={30} />
      <pointLight position={[6, 4, -3]} intensity={50} color={MAGENTA} distance={30} />
      <pointLight position={[0, 0, 6]} intensity={28} color={LIME} distance={26} />

      <Rig pointer={pointer} />
      <ScanRing />
      <ShardField pointer={pointer} />

      {/* drifting energy motes for depth */}
      <Sparkles
        count={70}
        scale={[14, 10, 8]}
        size={3}
        speed={0.3}
        opacity={0.5}
        color={LIME}
      />
      <Sparkles
        count={30}
        scale={[16, 12, 6]}
        size={2}
        speed={0.2}
        opacity={0.4}
        color={CYAN}
      />

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------ DOM wordmark + frame */
function Overlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily:
          "ui-monospace, 'Chakra Petch', 'SFMono-Regular', Menlo, monospace",
      }}
    >
      {/* corner HUD ticks */}
      {(
        [
          { top: 22, left: 22, bt: true, bl: true },
          { top: 22, right: 22, bt: true, br: true },
          { bottom: 22, left: 22, bb: true, bl: true },
          { bottom: 22, right: 22, bb: true, br: true },
        ] as const
      ).map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: (c as any).top,
            left: (c as any).left,
            right: (c as any).right,
            bottom: (c as any).bottom,
            width: 26,
            height: 26,
            borderTop: (c as any).bt ? `1.5px solid ${LIME}` : undefined,
            borderBottom: (c as any).bb ? `1.5px solid ${LIME}` : undefined,
            borderLeft: (c as any).bl ? `1.5px solid ${LIME}` : undefined,
            borderRight: (c as any).br ? `1.5px solid ${LIME}` : undefined,
            opacity: 0.5,
          }}
        />
      ))}

      {/* wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "10%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: LIME,
            fontSize: "clamp(14px, 2.4vw, 26px)",
            letterSpacing: "0.62em",
            fontWeight: 700,
            textShadow: `0 0 18px ${LIME}66`,
            paddingLeft: "0.62em",
          }}
        >
          PTRK.SYSTEMS
        </div>
        <div
          style={{
            marginTop: 10,
            color: CYAN,
            fontSize: "clamp(8px, 1vw, 11px)",
            letterSpacing: "0.42em",
            opacity: 0.7,
            paddingLeft: "0.42em",
          }}
        >
          DESIGN · ENGINEERING · SYSTEMS
        </div>
      </div>

      {/* boot status line */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#7a8a55",
          fontSize: 10,
          letterSpacing: "0.34em",
          opacity: 0.7,
        }}
      >
        // INITIALIZING BRAND MATRIX
      </div>

      {/* faint scanline veil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(5,5,8,0.85) 100%)",
        }}
      />
    </div>
  );
}

/* --------------------------------------------------------- public root */
export default function LogoAssembleIntro() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: VOID,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 9.4], fov: 42, near: 0.1, far: 100 }}
        style={{ pointerEvents: "none" }}
      >
        <Scene />
      </Canvas>
      <Overlay />
    </div>
  );
}
