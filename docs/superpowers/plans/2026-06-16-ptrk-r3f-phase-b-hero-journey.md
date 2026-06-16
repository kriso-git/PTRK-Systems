# R3F Phase B — Hero Journey (the Concept-1 entrance) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Prerequisite:** Phase A must be merged first. This plan assumes the shared `<Stage>` already exists and exports/hosts: `src/components/r3f/Stage.tsx` (the single `<Canvas>` with `<Background reduced/>`, `<View.Port/>`, `<Effects/>`), `src/components/r3f/StageLazy.tsx`, `src/components/r3f/Effects.tsx`, `src/components/r3f/ScrollSignalBridge.tsx`, and `src/lib/r3f/scroll-signal.ts` exporting `readSignal()` (returns `Readonly<{ progress:number; velocity:number; mx:number; my:number }>`) and `bindSignals()`. The Stage is mounted in `src/app/layout.tsx`, `fixed z-0 pointer-events-none`, `eventSource=document.body`. Confirm with `git grep -n "View.Port" src/components/r3f/Stage.tsx` before starting — if it returns nothing, STOP and finish Phase A.

**Goal:** Replace the home `§00` hero backdrop — today `HeroBackdrop` (= `NetworkField`, a standalone WebGL node-network canvas) plus the two extruded ghost words `Text3DLazy word="ACCESS"` (§02) and `word="PROCESS"` (§05) — with ONE Concept-1-style scroll-reactive 3D data-constellation rendered through a **DOM-placed `<View track={heroRef}>`** that tracks the hero `<section>` and composites in the shared Stage. The 3D **forms** when the hero is in view and **recedes/dissolves** on scroll via `readSignal()`. The existing DOM hero copy (`PTRK` / `Systems`, the manifesto paragraph, the three links, `ScrollCue`) stays exactly as-is, painted on top. Motion-gated. Then retire and delete `NetworkField.tsx`, `HeroBackdrop.tsx`, `Text3D.tsx`, `Text3DLazy.tsx`. `npm run build && npm run smoke` green.

**Architecture:** A new `src/components/r3f/HeroField.tsx` is the in-Canvas scene (a glowing lime/cyan/magenta/orange node constellation with faint links + travelling data-pulses + Sparkles, ported from the proven `Concept1` `Constellation` + the `NetworkField` data-pulse idea). A new `src/components/r3f/HeroView.tsx` is a DOM element (`<View track={heroRef}>`) placed INSIDE the hero section's tracked div — the variant proven to render in the concept preview (the Canvas-internal multi-`<View track>` variant did NOT render). `HeroField` reads `readSignal()` in `useFrame`: `progress` drives a bloom-then-recede camera dolly + group scale + fade, `mx/my` give a hand-held pointer parallax — the same signal Phase A already publishes from Lenis/native scroll. The shared `<View.Port/>` + minimal Bloom `<EffectComposer>` (already in `<Stage>` from Phase A) composite it. `HeroBackdrop`/`NetworkField`/`Text3D` are removed from `page.tsx` and deleted.

**Tech Stack:** Next.js 15.5.19 (App Router, Turbopack) · React 19.1 · TypeScript strict · Tailwind v4 · Lenis · three 0.171 · @react-three/fiber 9.6.1 · @react-three/drei 10.7.7 · @react-three/postprocessing 3.0.4

---

## Conventions for EVERY task

- **TS check:** `npx tsc --noEmit` must print nothing (clean) before a commit.
- **Dev watcher is broken on this machine.** To SEE a change in the browser/puppeteer you MUST restart the dev server. Helper (run from `ptrk-portfolio/`):
  ```bash
  # kill whatever owns :3000, then start fresh in the background
  powershell -Command "$p=(Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue).OwningProcess|Select-Object -First 1; if($p){Get-CimInstance Win32_Process -Filter \"ParentProcessId=$p\"|%{Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue}; Stop-Process -Id $p -Force -EA SilentlyContinue}"
  # then: npm run dev  (run in background; wait for 'Ready in')
  ```
  Wait for a fresh `Compiled /` / `Ready in` line in the dev log BEFORE trusting any screenshot.
- **NEVER put a backtick inside a GLSL string.** (Phase B has no raw GLSL — it uses drei/R3F materials — but if you add any `shaderMaterial`, the same rule applies: a stray backtick in a `` `...` `` template literal silently breaks the file → stale compile.)
- **drei `<View>`: ONLY the DOM-placed variant.** `<View track={heroRef}>` placed inside the tracked DOM div (proven in `src/app/concept-preview/Concept3.tsx`, lines ~349 + ~464). Do NOT use a Canvas-internal `<View track>` — it did not render. Keep the shared `<EffectComposer>` minimal (Bloom-first); do NOT add ChromaticAberration/Noise (they broke view compositing in the preview).
- **`MeshTransmissionMaterial` renders OPAQUE/black under the headless software GL** used for screenshots — this plan deliberately avoids glass in the hero (uses `meshBasicMaterial` / points / `MeshDistortMaterial`), so screenshots are trustworthy.
- Commit after each task with the shown message. Do NOT push.
- Work in the main checkout (`e:/Website Biz/PTRK-Systems/ptrk-portfolio`). A git worktree is optional; the dev server runs from the main checkout.

---

## File map

Create:
- `src/components/r3f/HeroField.tsx` — the in-Canvas constellation scene (nodes + links + data-pulses + sparkles); reads `readSignal()` and reacts to scroll (form → recede) + pointer parallax. Motion-gated (frozen formed frame).
- `src/components/r3f/HeroView.tsx` — the DOM-placed `<View track={heroRef}>` wrapper that mounts `<HeroField/>` into the Stage's `<View.Port/>`; renders the tracked div + the existing left-dim wash (moved from `HeroBackdrop`).

Modify:
- `src/app/page.tsx` — swap `<HeroBackdrop/>` for `<HeroView/>` in the §00 backdrop slot; remove the two `<Text3DLazy .../>` ghost-word blocks (§02 ACCESS, §05 PROCESS) and their wrapper divs; drop the now-unused imports.

Delete (after visual verification):
- `src/components/NetworkField.tsx`
- `src/components/HeroBackdrop.tsx`
- `src/components/Text3D.tsx`
- `src/components/Text3DLazy.tsx`

---

## Task 1: HeroField — the in-Canvas scroll-reactive constellation

**Files:**
- Create: `src/components/r3f/HeroField.tsx`

The scene is a glowing **data-constellation**: a deterministic lime/cyan/magenta/orange node cloud (most lime, a few "hot" accents), faint cyan links between near neighbours, travelling **data pulses** along those links (the signature idea from the retired `NetworkField`), and a soft cyan `Sparkles` dust. A `useFrame` loop reads `readSignal()`:
- `progress` (0..1 page scroll) → the constellation **blooms outward** (group scale up) while the group **recedes** (z back) and **fades** out as you leave the hero — mirroring the old `NetworkField` "blooms outward, camera recedes, dissolves" behaviour, but driven by the Phase-A signal instead of a private `scrollY` read.
- `mx/my` (cursor) → eased pointer parallax on the group rotation (hand-held drift).
- Reduced motion → one **formed** frame at a fixed phase, no animation, no listeners (the signal still exists but the loop early-returns after the first formed frame).

Note: this `<View>` is camera-decoupled from the Stage's main camera in the sense that the constellation lives in its own group and is sized to read well in a `~320px`-tall tracked region; the View uses the Canvas's default camera (Stage camera `position:[0,0,5] fov:50`), so the group is placed at `z≈0` and scaled to fit.

- [ ] **Step 1: Create `HeroField.tsx`**

```tsx
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

// Deterministic PRNG so the node cloud and its link geometry stay in sync
// across renders (ported from Concept1.mulberry32).
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
const LINK_DIST = 1.35; // world units; tuned for the spread below

/**
 * HeroField — the §00 hero data-constellation rendered IN the shared Stage via a
 * DOM-placed <View>. A glowing lime node cloud with cyan/magenta/orange accents,
 * faint links between near neighbours, and data PULSES travelling those links
 * (the signature carried over from the retired NetworkField). It FORMS while the
 * hero is in view and RECEDES + dissolves as you scroll, driven by the Phase-A
 * scroll signal (readSignal().progress) — the same Lenis/native-scroll value the
 * Background reads. Pointer parallax via readSignal().mx/my. On reduced motion it
 * renders one formed frame and stops.
 */
export function HeroField({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  // --- deterministic node cloud (positions, colours, sizes) ---------------
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
      // a flattened ellipsoid shell, nudged right so it sits beside the copy
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

  // --- instanced node spheres -------------------------------------------
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // per-instance colour buffer (instanceColor) set once
  const instColor = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3] = colors[i].r;
      arr[i * 3 + 1] = colors[i].g;
      arr[i * 3 + 2] = colors[i].b;
    }
    return arr;
  }, [colors]);

  // --- faint links between near neighbours ------------------------------
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

  // each pulse rides one link segment; precompute (a,b) endpoint pairs
  const edges = useMemo(() => {
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < LINK_DIST) out.push([nodes[i], nodes[j]]);
      }
    }
    return out;
  }, [nodes]);

  // --- data pulses (points travelling along links) ----------------------
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

  // smoothed pointer + scroll easing state
  const eased = useRef({ mx: 0.5, my: 0.5, fade: 1, z: 0, scale: 1 });

  useFrame((state, delta) => {
    const g = group.current;
    const mesh = meshRef.current;
    if (!g || !mesh) return;
    const dt = Math.min(0.05, delta);
    const time = reduced ? 1.4 : state.clock.elapsedTime;
    const s = readSignal();

    // scroll → "form then recede": near the top the constellation is dense and
    // bright; as progress climbs out of the hero (~ first 0.18 of the page) it
    // blooms outward (scale up), recedes (z back) and fades — same gesture as the
    // retired NetworkField, now from the shared signal.
    const heroExit = Math.min(1, Math.max(0, s.progress / 0.18));
    const e = eased.current;
    e.fade += (1 - heroExit * 0.95 - e.fade) * 0.1;
    e.z += (-heroExit * 3.5 - e.z) * 0.08;
    e.scale += (1 + heroExit * 0.7 - e.scale) * 0.08;
    g.position.z = e.z;
    g.scale.setScalar(e.scale);

    // pointer parallax (eased)
    if (!reduced) {
      e.mx += (s.mx - e.mx) * 0.05;
      e.my += (s.my - e.my) * 0.05;
      g.rotation.y = (e.mx - 0.5) * 0.5 + time * 0.05;
      g.rotation.x = -(e.my - 0.5) * 0.32 + Math.sin(time * 0.12) * 0.06;
    } else {
      g.rotation.set(0.1, 0.45, 0);
    }

    // node pulse (breathing scale) + fade via instance scale
    for (let i = 0; i < nodes.length; i++) {
      const pulse = 1 + Math.sin(time * 1.5 + i) * 0.16;
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(sizes[i] * pulse * (0.4 + 0.6 * e.fade) * 18);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // advance data pulses along their links
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
      {/* node spheres (per-instance brand colour, additive glow via emissive-free basic) */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, NODE_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.95} />
        <instancedBufferAttribute attach="instanceColor" args={[instColor, 3]} />
      </instancedMesh>

      {/* faint cyan links */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* travelling data pulses */}
      <points geometry={pulseGeo} frustumCulled={false}>
        <pointsMaterial
          color={LIME}
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* soft cyan dust so the field never reads as empty */}
      <Sparkles count={36} scale={[7, 5, 5]} size={2} speed={reduced ? 0 : 0.3} color={CYAN} opacity={0.45} />
    </group>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (no output). If `instanceColor` / `instancedBufferAttribute` errors, confirm three 0.171 + R3F 9.6.1 are installed (`grep '"three"\|@react-three/fiber' package.json`).

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/HeroField.tsx
git commit -m "feat(r3f): HeroField — scroll-reactive data-constellation scene"
```

---

## Task 2: HeroView — DOM-placed `<View track>` + the left-dim wash

**Files:**
- Create: `src/components/r3f/HeroView.tsx`

This is the **only** rendering boundary that touches the DOM. It renders the tracked `<div>` (filling the §00 backdrop slot) and, INSIDE it, a `<View track={heroRef}>` hosting `<HeroField/>`. The View composites into the Stage's `<View.Port/>` (already present from Phase A). It also carries over the **exact** left-dim gradient wash from the retired `HeroBackdrop` so the hero copy keeps its high-contrast left edge. Motion-gated: `reducedMotion()` read once and passed to `HeroField`.

The proven pattern (from `Concept3.tsx`): `const heroRef = useRef<HTMLDivElement>(null!)` → tracked div → `<View track={heroRef as RefObject<HTMLElement>} className="h-full w-full">`.

- [ ] **Step 1: Create `HeroView.tsx`**

```tsx
"use client";

import { useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { HeroField } from "./HeroField";

/**
 * HeroView — the §00 hero's 3D backdrop, rendered through the SHARED Stage.
 *
 * A DOM-placed drei <View track={heroRef}> (the variant proven to render in the
 * concept preview; the Canvas-internal multi-<View track> variant did NOT) mounts
 * <HeroField/> into the Stage's <View.Port/>. The View is sized to this tracked
 * div, which fills the hero section's backdrop slot. The DOM hero copy in
 * page.tsx paints ABOVE this (the copy lives at the section's normal z; this
 * sits at -z-20 in page.tsx exactly where HeroBackdrop did).
 *
 * The left-dim gradient wash (carried over verbatim from the retired
 * HeroBackdrop) keeps the headline high-contrast over the constellation.
 */
export function HeroView() {
  const heroRef = useRef<HTMLDivElement>(null!);
  const [reduced] = useState(() => reducedMotion());

  return (
    <>
      <div ref={heroRef} className="absolute inset-0">
        <View track={heroRef as RefObject<HTMLElement>} className="h-full w-full">
          <HeroField reduced={reduced} />
        </View>
      </div>
      {/* left-dim wash so the hero copy stays high-contrast over the network
          (verbatim from the retired HeroBackdrop) */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,8,0.82)_0%,rgba(5,5,8,0.45)_44%,rgba(5,5,8,0.12)_74%,transparent_100%)]" />
    </>
  );
}
```

> Note on `<View>` import availability: `View` is a named export of `@react-three/drei` (used identically in `src/app/concept-preview/Concept3.tsx`). No new dependency.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/HeroView.tsx
git commit -m "feat(r3f): HeroView — DOM-placed <View> mounting HeroField in the Stage"
```

---

## Task 3: Wire HeroView into the hero + remove the ghost Text3D usages

**Files:**
- Modify: `src/app/page.tsx`

Three surgical edits to `page.tsx`. The hero **copy, links, and `ScrollCue` are untouched** — only the backdrop component swaps, and the two decorative ghost words are removed (their visual job is replaced by the unified Stage skin + the live constellation; keeping a separate extruded-word WebGL context would defeat the consolidation goal).

- [ ] **Step 1: Swap the §00 backdrop.** Find (lines ~50–53):

```tsx
        {/* 3D node-network backdrop (Three.js, lazy + motion-gated) — deepest layer */}
        <div aria-hidden className="absolute inset-0 -z-20 pointer-events-none">
          <HeroBackdrop />
        </div>
```

Replace with:

```tsx
        {/* 3D data-constellation backdrop, rendered through the shared R3F Stage
            via a DOM-placed <View> — deepest layer, motion-gated */}
        <div aria-hidden className="absolute inset-0 -z-20 pointer-events-none">
          <HeroView />
        </div>
```

- [ ] **Step 2: Remove the §02 "ACCESS" ghost word.** Find (lines ~215–224):

```tsx
        {/* 3D-extruded ghost word — the §02 section sits at z-20 so the
            whole slab (including this) paints ABOVE the right terminal
            aside (z-12); inline textShadow overrides .text-ghost's none */}
        {/* 3D extruded brand-font ghost word (replaces the CSS textShadow fake-3D) */}
        <div
          aria-hidden
          className="absolute right-[-40px] top-2 -z-10 w-[620px] h-[320px] opacity-80 pointer-events-none hidden lg:block"
        >
          <Text3DLazy word="ACCESS" color="lime" />
        </div>
```

Delete that entire block (the comment lines, the wrapper `<div>`, and the `<Text3DLazy .../>`). Leave the surrounding `GoliathOrnament` and the `<div className="max-w-[1500px] grid ...">` that follows intact.

- [ ] **Step 3: Remove the §05 "PROCESS" ghost word.** Find (lines ~441–447):

```tsx
        {/* 3D extruded brand-font ghost word (replaces the CSS textShadow fake-3D) */}
        <div
          aria-hidden
          className="absolute -left-8 bottom-0 -z-10 w-[700px] h-[300px] opacity-80 pointer-events-none hidden lg:block"
        >
          <Text3DLazy word="PROCESS" color="orange" />
        </div>
```

Delete that entire block. Leave the following `<div className="max-w-[1500px]">` intact.

- [ ] **Step 4: Fix the imports.** At the top of `page.tsx`, remove the now-unused lines:

```tsx
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Text3DLazy } from "@/components/Text3DLazy";
```

and add (next to the other component imports):

```tsx
import { HeroView } from "@/components/r3f/HeroView";
```

(Keep `ScrollJourneyLazy`, `AsciiField`, `GoliathOrnament`, and every other import — they stay.)

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: clean. If TS reports `'HeroBackdrop' is declared but never used` / `'Text3DLazy' ...`, you missed removing an import or a usage — fix it.

- [ ] **Step 6: Restart the dev server, then visually verify the hero.**

Restart dev (Conventions helper), wait for `Ready in`, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await pg.mouse.move(1050,360);await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:'scripts/_shots/phaseB-hero-top.png'});const n=await pg.evaluate(()=>document.querySelectorAll('canvas').length);console.log('canvas count:',n);await pg.evaluate(()=>window.scrollTo(0,window.innerHeight*0.6));await new Promise(r=>setTimeout(r,1500));await pg.screenshot({path:'scripts/_shots/phaseB-hero-scrolled.png'});await b.close();})"
```

Expected:
- `canvas count: 1` — the SINGLE shared Stage canvas (no per-component canvas; `NetworkField`/`Text3D` are gone). If it prints `2`+ you have not removed an old canvas component.
- `scripts/_shots/phaseB-hero-top.png`: the hero shows the lime/cyan node constellation with links + a few hot accents on the RIGHT side, the headline `PTRK.` / `Systems` crisp on the left over the dim wash, links and `ScrollCue` present.
- `scripts/_shots/phaseB-hero-scrolled.png`: scrolled ~0.6vh, the constellation has visibly **receded/faded** (the "form → recede" gesture).
- (Glass caveat does not apply — HeroField uses no `MeshTransmissionMaterial`.)

> If the View renders BLACK / nothing: confirm `<View.Port/>` is inside `<Stage>` (Phase A) and that you used the DOM-placed `<View track={heroRef}>` (not a Canvas-internal one). Confirm `eventSource=document.body` on the Stage Canvas. A missing `<View.Port/>` is the #1 cause.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(r3f): home hero uses Stage HeroView; retire ghost Text3D usages"
```

---

## Task 4: Reduced-motion verification (static formed frame)

**Files:** none (verification only)

- [ ] **Step 1: Force motion off and restart dev.**

In the browser console (or before load) set `localStorage['ptrk-motion']='off'`, OR toggle the MOT tray chip off, then restart the dev server (watcher broken).

- [ ] **Step 2: Screenshot with motion off.**

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.evaluateOnNewDocument(()=>{try{localStorage.setItem('ptrk-motion','off')}catch{}});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await new Promise(r=>setTimeout(r,2000));await pg.screenshot({path:'scripts/_shots/phaseB-hero-reduced.png'});await b.close();})"
```

Expected: `scripts/_shots/phaseB-hero-reduced.png` shows a **formed, static** constellation (nodes + links + pulses frozen at a phase, sparkles still). No animation. The hero copy is identical. (`HeroField`'s `reduced` branch freezes `time=1.4`, sets a fixed rotation, and `Sparkles speed={0}`.)

- [ ] **Step 3: Reset motion.** Remove the override (`localStorage.removeItem('ptrk-motion')` or toggle the chip back on) so subsequent dev work is in the default animated state. No commit (verification only).

---

## Task 5: Delete the dead hero WebGL files

**Files:**
- Delete: `src/components/NetworkField.tsx`
- Delete: `src/components/HeroBackdrop.tsx`
- Delete: `src/components/Text3D.tsx`
- Delete: `src/components/Text3DLazy.tsx`

- [ ] **Step 1: Confirm nothing else imports them.**

Run:
```bash
git grep -nE "NetworkField|HeroBackdrop|Text3D(Lazy)?" src
```
Expected: NO matches (Task 3 removed the only usages). If any remain (e.g. a stray reference under `src/app/concept-preview/`), they are throwaway preview files scheduled for deletion — but `Text3D`/`NetworkField` are NOT used there; if `git grep` shows a real `src/` consumer outside the concept preview, fix it before deleting.

- [ ] **Step 2: Delete the files.**

```bash
git rm src/components/NetworkField.tsx src/components/HeroBackdrop.tsx src/components/Text3D.tsx src/components/Text3DLazy.tsx
```

- [ ] **Step 3: Type-check.**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit.**

```bash
git add -A
git commit -m "chore(r3f): delete dead NetworkField/HeroBackdrop/Text3D files"
```

---

## Task 6: Production build + smoke gate

**Files:** none (verification only)

- [ ] **Step 1: Stop the dev server first** (build + dev share `.next` → white-page risk). Kill it with the Conventions helper.

- [ ] **Step 2: Production build.**

Run: `npm run build`
Expected: build succeeds (no type/compile errors). `HeroView`/`HeroField` are client components inside the ssr:false `<StageLazy>` boundary's sibling; the `<View>` only composites on the client, so no SSR WebGL.

- [ ] **Step 3: Render-smoke gate.**

Run: `npm run smoke`
Expected: `SMOKE PASS` — 0 console/page errors across all 8 routes (`/`, `/work`, `/work/f3xykee-terminal`, `/work/nemletezik`, `/method`, `/lab`, `/connect`, `/nemletezik`). The hero is on `/` only; the other routes must be unaffected. Common failure: an R3F/`<View>` console warning if the Stage `<View.Port/>` is missing on a route — but the Stage is global (layout), so it is present everywhere.

- [ ] **Step 4: Commit (only if a smoke fix was needed; otherwise skip).**

```bash
git add -A
git commit -m "fix(r3f): smoke-gate fixes for hero View"
```

---

## Definition of done (Phase B)

- [ ] The home `§00` hero shows a scroll-reactive 3D data-constellation rendered through the **shared Stage** (DOM-placed `<View track={heroRef}>` → `<View.Port/>`), NOT a standalone canvas. Exactly **one** `<canvas>` on `/` (verified in Task 3, Step 6).
- [ ] The constellation **forms** at the top and **recedes/fades** on scroll, driven by `readSignal().progress`; pointer parallax via `readSignal().mx/my`.
- [ ] The hero **copy / links / `ScrollCue` are byte-for-byte unchanged** (`PTRK.` / `Systems`, the manifesto paragraph "Egy fókuszált, vertikális stúdió…", `→ View projects` / `Methodology` / `Connect`). The left-dim wash is preserved.
- [ ] The two ghost words (§02 `ACCESS`, §05 `PROCESS`) are removed from `page.tsx`; surrounding `GoliathOrnament` + copy intact.
- [ ] `NetworkField.tsx`, `HeroBackdrop.tsx`, `Text3D.tsx`, `Text3DLazy.tsx` are deleted; `git grep -nE "NetworkField|HeroBackdrop|Text3D" src` returns nothing.
- [ ] Reduced-motion (MOT-OFF / `localStorage['ptrk-motion']='off'`) shows a **static formed** constellation (no animation), verified in Task 4.
- [ ] `npx tsc --noEmit` clean; `npm run build` succeeds; `npm run smoke` = PASS.

## Notes for later phases (do NOT do here)
- Phase C (per-project signatures) reuses the SAME DOM-placed `<View track>` pattern on the §04 work index + `/work` cards. Keep the EffectComposer minimal when adding more views (extra effects appeared to break view compositing).
- The standalone `ScrollJourneyLazy` (the pinned nebula tunnel after the hero) is intentionally LEFT IN PLACE in Phase B; it is folded into the Stage in Phase D (transitions). Do not touch it here.
- Throwaway to delete around a later phase: `src/app/concept-preview/` (Concept1/2/3 + page), `scripts/_scratch-*.mjs`, `scripts/_shots/`.
