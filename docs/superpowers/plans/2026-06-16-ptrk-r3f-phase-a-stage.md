# R3F Phase A — the Stage (foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up one persistent react-three-fiber `<Stage>` (Canvas + nebula background + a minimal shared EffectComposer + a scroll/cursor signal + a `<View.Port/>` bridge), mount it in the root layout, and retire the standalone `BgNebula` — with the site looking essentially unchanged and `npm run smoke` green.

**Architecture:** A single ssr:false R3F Canvas fixed at `z-0` behind all DOM content hosts a fullscreen nebula shader (ported verbatim from `BgNebula`), a Bloom EffectComposer, and a `<View.Port/>` ready for later phases. A dependency-free module signal bridges Lenis/native scroll + cursor into the Canvas via `useFrame`. The old `BgNebula` (inside `MarathonBackground`) is removed; everything else (NetworkField, Text3D, ScrollJourney, terminal, code-rain) keeps running untouched.

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
- **NEVER put a backtick inside a GLSL string** (the shader lives in a `` `...` `` template literal — a stray backtick silently breaks the file → stale compile).
- Commit after each task with the shown message. Do NOT push.
- Work in the main checkout (`e:/Website Biz/PTRK-Systems/ptrk-portfolio`). A git worktree is optional and not required here (the dev server runs from the main checkout).

---

## File map

Create:
- `src/components/r3f/nebulaShader.ts` — the ported VERT/FRAG strings.
- `src/lib/r3f/scroll-signal.ts` — dependency-free scroll+cursor signal.
- `src/components/r3f/ScrollSignalBridge.tsx` — mounts/tears down the signal listeners.
- `src/components/r3f/Background.tsx` — fullscreen nebula mesh (runs inside Canvas).
- `src/components/r3f/Effects.tsx` — the shared EffectComposer (subtle Bloom).
- `src/components/r3f/Stage.tsx` — the single `<Canvas>` hosting Background + View.Port + Effects.
- `src/components/r3f/StageLazy.tsx` — ssr:false dynamic wrapper.

Modify:
- `src/app/layout.tsx` — mount `<StageLazy/>` (backmost) + `<ScrollSignalBridge/>`.
- `src/components/MarathonBackground.tsx` — remove `<BgNebulaLazy/>` + its import.

Delete (last task, after visual verification):
- `src/components/BgNebula.tsx`, `src/components/BgNebulaLazy.tsx`.

---

## Task 1: Port the nebula shader to a shared module

**Files:**
- Create: `src/components/r3f/nebulaShader.ts`

- [ ] **Step 1: Create the shader module** (VERT + FRAG copied verbatim from `BgNebula.tsx`; no behavior change)

```ts
// Nebula background shader — ported verbatim from the original BgNebula.tsx so
// the Stage background is visually identical. Fullscreen-triangle vertex shader
// (ignores the camera); fragment shader = domain-warped fbm wisps on a dark base,
// revealed by a cursor "torch". NOTE: never put a backtick inside these strings.
export const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const NEBULA_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++){
      v += amp * vnoise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv0 = (vUv * uRes - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.075;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec2 uv = uv0 + m * 0.30;

    vec2 q = vec2(
      fbm(uv * 1.6 + vec2(0.0, t)),
      fbm(uv * 1.6 + vec2(5.2, -t * 0.8))
    );
    vec2 r = vec2(
      fbm(uv * 1.6 + 3.4 * q + vec2(1.7 - t * 0.5, 9.2) + m * 0.6),
      fbm(uv * 1.6 + 3.4 * q + vec2(8.3, 2.8 + t * 0.6) + m * 0.9)
    );
    float cloud = fbm(uv * 1.6 + 4.0 * r + vec2(t * 0.45, -t * 0.35));
    cloud = smoothstep(0.32, 0.95, cloud);
    cloud = pow(cloud, 1.4);

    vec2 mAC = (uMouse * uRes - 0.5 * uRes) / uRes.y;
    float md = length(uv0 - mAC);
    float torch = exp(-md * md * 1.8);

    float hue = clamp(0.5 + 0.5 * (q.x - r.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.45);

    vec3 col = vec3(0.011, 0.012, 0.017);
    col += tint * cloud * 0.10;
    col += tint * cloud * torch * 1.05;
    col += tint * torch * 0.10;
    col += CYAN * pow(cloud, 3.0) * torch * 0.28;

    float vig = smoothstep(1.3, 0.2, length(uv));
    col *= 0.5 + 0.5 * vig;
    col *= 0.92;

    gl_FragColor = vec4(col, 1.0);
  }
`;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean (no output).

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/nebulaShader.ts
git commit -m "feat(r3f): port nebula shader to a shared module"
```

---

## Task 2: Dependency-free scroll + cursor signal

**Files:**
- Create: `src/lib/r3f/scroll-signal.ts`
- Create: `src/components/r3f/ScrollSignalBridge.tsx`

- [ ] **Step 1: Create the signal module**

```ts
// A tiny, dependency-free signal that bridges native scroll + cursor into the
// R3F Stage. Lenis drives NATIVE scroll, so window.scrollY is already smoothed —
// no need to expose the Lenis instance. Read synchronously inside useFrame.
type Signal = { progress: number; velocity: number; mx: number; my: number };

const signal: Signal = { progress: 0, velocity: 0, mx: 0.5, my: 0.5 };
let prev = 0;
let bound = 0;

export function readSignal(): Readonly<Signal> {
  return signal;
}

/** Wire passive scroll + mousemove listeners. Returns an unbind fn. Ref-counted
 *  so multiple mounts are safe. */
export function bindSignals(): () => void {
  if (typeof window === "undefined") return () => {};
  bound += 1;
  if (bound === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    onScroll();
  }
  return () => {
    bound -= 1;
    if (bound === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    }
  };
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  signal.velocity = p - prev;
  prev = p;
  signal.progress = p;
}

function onMove(e: MouseEvent) {
  signal.mx = e.clientX / window.innerWidth;
  signal.my = 1 - e.clientY / window.innerHeight;
}
```

- [ ] **Step 2: Create the bridge component**

```tsx
"use client";

import { useEffect } from "react";
import { bindSignals } from "@/lib/r3f/scroll-signal";

/** Renders nothing; just owns the scroll/cursor listeners for the lifetime of
 *  the app. Mounted once in the root layout. */
export function ScrollSignalBridge() {
  useEffect(() => bindSignals(), []);
  return null;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/lib/r3f/scroll-signal.ts src/components/r3f/ScrollSignalBridge.tsx
git commit -m "feat(r3f): dependency-free scroll+cursor signal + bridge"
```

---

## Task 3: Background — fullscreen nebula mesh (inside the Canvas)

**Files:**
- Create: `src/components/r3f/Background.tsx`

- [ ] **Step 1: Create the Background component**

```tsx
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { readSignal } from "@/lib/r3f/scroll-signal";
import { NEBULA_VERT, NEBULA_FRAG } from "./nebulaShader";

/** Fullscreen nebula. A fullscreen-triangle geometry + the ported shader; the
 *  vertex shader ignores the camera, so it always fills the viewport behind any
 *  future <View>s (renderOrder -1, depth off). uMouse eases toward the cursor
 *  signal (the "torch"). On reduced motion uTime is frozen at a formed frame. */
export function Background({ reduced }: { reduced: boolean }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  const target = useMemo(() => new THREE.Vector2(0.5, 0.5), []);

  useFrame((state) => {
    uniforms.uTime.value = reduced ? 4.2 : state.clock.elapsedTime;
    uniforms.uRes.value.set(state.size.width, state.size.height);
    const s = readSignal();
    target.set(s.mx, s.my);
    uniforms.uMouse.value.lerp(target, 0.14);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={-1}>
      <shaderMaterial
        vertexShader={NEBULA_VERT}
        fragmentShader={NEBULA_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/Background.tsx
git commit -m "feat(r3f): fullscreen nebula Background"
```

---

## Task 4: Effects — the shared EffectComposer

**Files:**
- Create: `src/components/r3f/Effects.tsx`

- [ ] **Step 1: Create the Effects component** (subtle Bloom only — establishes the shared "skin" without washing out the dark nebula; the shader already vignettes. Keep it Bloom-first; more effects are a later phase.)

```tsx
"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/** One shared post-processing pass for the whole Stage — the "unified skin".
 *  Kept deliberately subtle in Phase A: only bright torch-lit wisps bloom, so
 *  the background still reads like the original dark nebula. */
export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.35} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/Effects.tsx
git commit -m "feat(r3f): shared subtle-Bloom EffectComposer"
```

---

## Task 5: Stage — the single Canvas

**Files:**
- Create: `src/components/r3f/Stage.tsx`
- Create: `src/components/r3f/StageLazy.tsx`

- [ ] **Step 1: Create the Stage**

```tsx
"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { Background } from "./Background";
import { Effects } from "./Effects";

/** The single persistent WebGL surface for the whole site. Fixed, backmost
 *  (z-0), never intercepts pointer events. eventSource = document.body so later
 *  phases' DOM-placed <View>s can hit-test against the page. On reduced motion
 *  the loop is on-demand (one formed frame, no animation). */
export function Stage() {
  const [reduced] = useState(() => reducedMotion());

  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <Background reduced={reduced} />
      <View.Port />
      <Effects />
    </Canvas>
  );
}
```

- [ ] **Step 2: Create the lazy wrapper**

```tsx
"use client";

import dynamic from "next/dynamic";

// Heavy (R3F + three + postprocessing) — lazy + client-only, off the critical path.
const Stage = dynamic(() => import("./Stage").then((m) => m.Stage), { ssr: false });

export function StageLazy() {
  return <Stage />;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

> Note: with `frameloop="demand"` the on-mount render happens automatically once; the static reduced-motion frame uses `uTime = 4.2` (a formed nebula). No manual `invalidate()` needed for the single initial frame.

- [ ] **Step 4: Commit**

```bash
git add src/components/r3f/Stage.tsx src/components/r3f/StageLazy.tsx
git commit -m "feat(r3f): persistent Stage canvas + lazy wrapper"
```

---

## Task 6: Wire the Stage into the layout + remove BgNebula usage

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/MarathonBackground.tsx`

- [ ] **Step 1: Add imports to `layout.tsx`** (near the other component imports, e.g. after the `MarathonBackground` import)

```tsx
import { StageLazy } from "@/components/r3f/StageLazy";
import { ScrollSignalBridge } from "@/components/r3f/ScrollSignalBridge";
```

- [ ] **Step 2: Mount the Stage as the backmost layer + the bridge.** In `layout.tsx`, find the block:

```tsx
        <SmoothScroll />
        <RevealObserver />
        <MarathonBackground />
```

Replace it with:

```tsx
        <SmoothScroll />
        <ScrollSignalBridge />
        <RevealObserver />
        <StageLazy />
        <MarathonBackground />
```

(`StageLazy` is `fixed z-0`; `MarathonBackground`'s wrapper is also `z-0` and comes AFTER in DOM order, so its code-rain/scanlines/grain paint over the Stage nebula — same visual stack as today.)

- [ ] **Step 3: Remove the old nebula from `MarathonBackground.tsx`.** Delete the import line:

```tsx
import { BgNebulaLazy } from "./BgNebulaLazy";
```

and delete the usage block (the `<BgNebulaLazy />` element and its comment):

```tsx
      {/* Volumetric nebula backdrop (replaces the WarpMesh grid) — backmost layer,
          cursor-reactive (swells + glows toward the pointer). Lazy + motion-gated. */}
      <BgNebulaLazy />
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Restart the dev server** (watcher is broken), then visually verify the nebula renders from the Stage.

Restart dev (see Conventions helper), wait for `Ready in`, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1280,height:720});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await pg.mouse.move(820,300);await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:'scripts/_shots/phaseA-home.png'});const px=await pg.evaluate(()=>{const c=document.querySelector('canvas');return !!c;});console.log('canvas present:',px);await b.close();})"
```

Expected: `canvas present: true`; open `scripts/_shots/phaseA-home.png` and confirm the dark nebula with lime/cyan wisps + a cursor torch near (820,300) — i.e. it looks like the current background. (The site content/nav/terminal still render over it.)

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/MarathonBackground.tsx
git commit -m "feat(r3f): mount Stage in layout, retire BgNebula usage"
```

---

## Task 7: Delete the dead BgNebula files

**Files:**
- Delete: `src/components/BgNebula.tsx`
- Delete: `src/components/BgNebulaLazy.tsx`

- [ ] **Step 1: Confirm nothing else imports them**

Run: `git grep -n "BgNebula" src` (or ripgrep `BgNebula`).
Expected: NO matches (Task 6 removed the only usage). If any remain, fix them first.

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/BgNebula.tsx src/components/BgNebulaLazy.tsx
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(r3f): delete dead BgNebula files (now in Stage)"
```

---

## Task 8: Production build + smoke gate

**Files:** none (verification only)

- [ ] **Step 1: Stop the dev server first** (build + dev share `.next` → white-page risk).

Kill the dev server (Conventions helper).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds (no type/compile errors). The Stage is ssr:false so it is excluded from SSR.

- [ ] **Step 3: Render-smoke gate**

Run: `npm run smoke`
Expected: `SMOKE PASS — 0 console/page errors` (all 8 routes `✓`). If any route logs a WebGL/R3F console error, fix it before proceeding (common cause: a Canvas mounted during SSR — confirm `StageLazy` uses `ssr:false`).

- [ ] **Step 4: Commit (if any fix was needed in Step 3; otherwise skip)**

```bash
git add -A
git commit -m "fix(r3f): smoke-gate fixes for Stage"
```

---

## Definition of done (Phase A)

- [ ] Home + all routes look essentially unchanged to a visitor; the background nebula is rendered by `<Stage>` (not `BgNebula`).
- [ ] `npx tsc --noEmit` clean; `npm run build` succeeds; `npm run smoke` = PASS.
- [ ] `BgNebula.tsx` + `BgNebulaLazy.tsx` deleted; no `BgNebula` references remain.
- [ ] `<View.Port/>` + the scroll/cursor signal are in place (unused in A, ready for B/C).
- [ ] Reduced-motion (MOT-OFF) shows a static nebula frame (no animation), verified by toggling the MOT chip or setting `localStorage['ptrk-motion']='off'`.

## Notes for later phases (do NOT do here)
- Phase B (hero journey) and C (per-project signatures) use the **DOM-placed `<View track={selfRef}>`** variant (proven in the concept preview); the Canvas-internal multi-`<View track>` variant did not render. Keep the EffectComposer minimal when adding views (extra effects appeared to break view compositing).
- Throwaway to delete around Phase A landing: `src/app/concept-preview/`, `public/_tunnel.html`, `public/_tunnel_variants.js`, `scripts/_scratch-*.mjs`, `scripts/_shots/`.
