"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { readSignal } from "@/lib/r3f/scroll-signal";

// Brand palette (hex). Most nodes lime; a few cyan/magenta/orange "hot" accents.
const LIME = "#c2fe0c";
const CYAN = "#01ffff";
const MAGENTA = "#ea027e";
const ORANGE = "#ff8c42";

// Deterministic PRNG so the node cloud and its link geometry stay in sync.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NODE_COUNT = 64;
const PULSE_COUNT = 24;
const LINK_DIST = 1.35;

/**
 * HeroField – the §00 hero data-constellation rendered IN the shared Stage via a
 * DOM-placed <View>. A glowing lime node cloud with cyan/magenta/orange accents,
 * faint links between near neighbours, and data PULSES travelling those links
 * (the signature carried over from the retired NetworkField). It FORMS while the
 * hero is in view and RECEDES + dissolves as you scroll (Phase-A scroll signal).
 * Pointer parallax via readSignal().mx/my. On reduced motion: one formed frame.
 */
export function HeroField({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { nodes, colors, sizes } = useMemo(() => {
    const rng = mulberry32(0x50508);
    const pts: THREE.Vector3[] = [];
    const cols: THREE.Color[] = [];
    const szs: number[] = [];
    const cLime = new THREE.Color(LIME);
    const cCyan = new THREE.Color(CYAN);
    const cMag = new THREE.Color(MAGENTA);
    const cOra = new THREE.Color(ORANGE);
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = 1.6 + Math.pow(rng(), 0.7) * 1.9;
      const th = rng() * Math.PI * 2;
      const ph = Math.acos(2 * rng() - 1);
      pts.push(
        new THREE.Vector3(
          r * Math.sin(ph) * Math.cos(th) + 1.1,
          r * Math.sin(ph) * Math.sin(th) * 0.78,
          r * Math.cos(ph) * 0.9
        )
      );
      const roll = rng();
      const [c, hot] =
        roll > 0.95 ? [cOra, true] : roll > 0.9 ? [cMag, true] : roll > 0.82 ? [cCyan, true] : [cLime, false];
      cols.push(c as THREE.Color);
      szs.push(hot ? 0.11 + rng() * 0.05 : 0.05 + rng() * 0.03);
    }
    return { nodes: pts, colors: cols, sizes: szs };
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const instColor = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3] = colors[i].r;
      arr[i * 3 + 1] = colors[i].g;
      arr[i * 3 + 2] = colors[i].b;
    }
    return arr;
  }, [colors]);

  const linkPositions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < LINK_DIST) {
          pts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          pts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return new Float32Array(pts);
  }, [nodes]);

  const edges = useMemo(() => {
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < LINK_DIST) out.push([nodes[i], nodes[j]]);
      }
    }
    return out;
  }, [nodes]);

  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3));
    return g;
  }, []);
  const pulseState = useMemo(() => {
    const edgeIdx = new Int32Array(PULSE_COUNT);
    const t = new Float32Array(PULSE_COUNT);
    const speed = new Float32Array(PULSE_COUNT);
    const seed = new Float32Array(PULSE_COUNT);
    const rng = mulberry32(0xc2fe0c);
    for (let k = 0; k < PULSE_COUNT; k++) {
      edgeIdx[k] = edges.length ? (rng() * edges.length) | 0 : 0;
      t[k] = rng();
      speed[k] = 0.18 + rng() * 0.32;
      seed[k] = rng();
    }
    return { edgeIdx, t, speed, seed };
  }, [edges]);

  const eased = useRef({ mx: 0.5, my: 0.5, fade: 1, z: 0, scale: 1 });

  useFrame((state, delta) => {
    const g = group.current;
    const mesh = meshRef.current;
    if (!g || !mesh) return;
    const dt = Math.min(0.05, delta);
    const time = reduced ? 1.4 : state.clock.elapsedTime;
    const s = readSignal();

    const heroExit = Math.min(1, Math.max(0, s.progress / 0.18));
    const e = eased.current;
    e.fade += (1 - heroExit * 0.95 - e.fade) * 0.1;
    e.z += (-heroExit * 3.5 - e.z) * 0.08;
    e.scale += (1 + heroExit * 0.7 - e.scale) * 0.08;
    g.position.z = e.z;
    g.scale.setScalar(e.scale);

    if (!reduced) {
      e.mx += (s.mx - e.mx) * 0.05;
      e.my += (s.my - e.my) * 0.05;
      g.rotation.y = (e.mx - 0.5) * 0.5 + time * 0.05;
      g.rotation.x = -(e.my - 0.5) * 0.32 + Math.sin(time * 0.12) * 0.06;
    } else {
      g.rotation.set(0.1, 0.45, 0);
    }

    for (let i = 0; i < nodes.length; i++) {
      const pulse = 1 + Math.sin(time * 1.5 + i) * 0.16;
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(sizes[i] * pulse * (0.4 + 0.6 * e.fade) * 18);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const posAttr = pulseGeo.getAttribute("position") as THREE.BufferAttribute;
    const pArr = posAttr.array as Float32Array;
    const ps = pulseState;
    for (let k = 0; k < PULSE_COUNT; k++) {
      if (!reduced) {
        ps.t[k] += dt * ps.speed[k];
        if (ps.t[k] >= 1) ps.t[k] = 0;
      }
      const ed = edges[ps.edgeIdx[k]];
      const tt = reduced ? ps.seed[k] : ps.t[k];
      if (ed) {
        pArr[k * 3] = ed[0].x + (ed[1].x - ed[0].x) * tt;
        pArr[k * 3 + 1] = ed[0].y + (ed[1].y - ed[0].y) * tt;
        pArr[k * 3 + 2] = ed[0].z + (ed[1].z - ed[0].z) * tt;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group ref={group} dispose={null}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.95} />
        <instancedBufferAttribute attach="instanceColor" args={[instColor, 3]} />
      </instancedMesh>

      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={CYAN} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </lineSegments>

      <points geometry={pulseGeo} frustumCulled={false}>
        <pointsMaterial color={LIME} size={0.16} sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>

      <Sparkles count={36} scale={[7, 5, 5]} size={2} speed={reduced ? 0 : 0.3} color={CYAN} opacity={0.45} />
    </group>
  );
}
