# R3F Phase D — Transitions + Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the portfolio tasteful, restrained WebGL transitions driven by the shared Stage. (1) Add a `<RouteVeil/>` — a one-shot lime/cyan nebula-wash that plays on route change, reading `readSignal()` velocity and route changes, replacing the CSS "wave" the owner removed. (2) Fold the standalone `ScrollJourney` raw-WebGL tunnel into the Stage architecture as a reusable, scroll-driven `<TunnelTransition/>` (one shared WebGL context, the existing copy and stations untouched). (3) Add a light, DOM-placed `<View>` 3D signature to the Method hero (matching Phase C's proven pattern). (4) Carefully expand the shared EffectComposer ("the skin") with a gentle vignette + scanline without breaking `<View>` compositing. (5) A performance + motion-gate sweep (DPR cap, pause-on-hidden, `frameloop` on reduce, route-aware pause). (6) Delete the throwaway concept-preview + scratch files. End: `npx tsc --noEmit` clean, `npm run build` succeeds, `npm run smoke` = PASS (8 routes, 0 console/page errors), no Lighthouse regression.

**Architecture:** Build ON the Phase A Stage: the single ssr:false `<Canvas>` (`src/components/r3f/Stage.tsx`) hosting `<Background/>`, `<View.Port/>`, `<Effects/>`, fed by the dependency-free `readSignal()/bindSignals()` module (`src/lib/r3f/scroll-signal.ts`). Phase D adds: (a) a module-level *route-transition signal* that a tiny `<RouteSignalBridge/>` pulses on `usePathname()` change (mirroring the `RevealObserver` route-hook); (b) a `<RouteVeil/>` mesh inside the Stage that reads it and runs a 0.7s nebula-wash with no React re-render; (c) `<TunnelTransition/>` — the ScrollJourney FRAG ported to an R3F `shaderMaterial` on a DOM-placed `<View track={wrapRef}>` so the tunnel composites through the SAME Canvas + shared skin instead of a second context; (d) a `<MethodSignature/>` DOM-placed `<View>` on the Method hero. The composer stays Bloom-first; a low-strength Vignette + a custom thin Scanline effect are added and verified not to break view compositing. Everything is motion-gated through `reducedMotion()` and the existing `readSignal()`.

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
  Confirm a recompile line in the dev log before trusting any screenshot.
- **NEVER put a backtick inside a GLSL string** (the shaders live in `` `...` `` template literals — a stray backtick silently breaks the file → stale compile).
- **WebGL visuals are not unit-testable here.** Per task verification is: `npx tsc --noEmit` clean → restart dev → a puppeteer screenshot run with `headless:'shell'` + `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`. The hard gate is `npm run build && npm run smoke` (smoke = 0 console/page errors across the 8 routes in `scripts/smoke.mjs`; pass string is `SMOKE PASS — 0 console/page errors`).
- **MeshTransmissionMaterial caveat:** glass renders OPAQUE/black under headless software GL (GPU-only). This plan avoids transmission material entirely; the Method signature uses standard/emissive materials so screenshots are meaningful.
- **Keep the EffectComposer minimal-then-careful.** In the concept preview, extra composer effects (ChromaticAberration/Noise) broke `<View>` compositing. Task 6 expands the composer in ONE small step and verifies views still render before committing.
- Commit after each task with the shown message. Do NOT push.
- Work in the main checkout (`e:/Website Biz/PTRK-Systems/ptrk-portfolio`). The dev server runs from the main checkout; a git worktree is optional and not required.

---

## Pre-flight (read-only, do once before Task 1)

- [ ] Confirm Phase A landed: `src/components/r3f/Stage.tsx`, `Background.tsx`, `Effects.tsx`, `StageLazy.tsx`, `ScrollSignalBridge.tsx`, and `src/lib/r3f/scroll-signal.ts` all exist; `BgNebula.tsx`/`BgNebulaLazy.tsx` are gone. Phase D is written against those exact symbols (`readSignal()`, `bindSignals()`, `<View.Port/>` inside `Stage`, the `reduced` prop pattern). If Phase A is NOT present, stop and run it first — this plan has no value standalone.
- [ ] Confirm the Stage `<Canvas>` already contains `<View.Port/>` (from Phase A Task 5). Phase D's tunnel + Method signature are DOM-placed `<View track={ref}>` units that composite through that port — exactly the variant proven in the concept preview (NOT the Canvas-internal multi-`<View track>` variant, which did not render).

---

## File map

Create:
- `src/lib/r3f/route-signal.ts` — module-level route-transition signal (pulse on route change) + a velocity-aware veil intensity helper.
- `src/components/r3f/RouteSignalBridge.tsx` — `usePathname()` hook that pulses the route signal (renders null).
- `src/components/r3f/RouteVeil.tsx` — fullscreen one-shot nebula-wash mesh inside the Stage.
- `src/components/r3f/routeVeilShader.ts` — VERT/FRAG for the wash.
- `src/components/r3f/tunnelShader.ts` — the ScrollJourney FRAG/VERT ported to a drei-`<View>`-friendly `shaderMaterial` (Three-prefix-injected, not RawShader).
- `src/components/r3f/TunnelView.tsx` — the tunnel `shaderMaterial` mesh that runs inside a `<View>` (reads scroll progress + the wrap rect).
- `src/components/r3f/TunnelTransition.tsx` — the DOM unit: the 300vh scroll-spacer + a fixed full-takeover `<View track>` host + the station overlays (existing copy), replacing `ScrollJourney`.
- `src/components/r3f/MethodSignature.tsx` — a light DOM-placed `<View>` 3D signature for the Method hero.

Modify:
- `src/app/layout.tsx` — mount `<RouteSignalBridge/>` (next to `<ScrollSignalBridge/>`).
- `src/components/r3f/Stage.tsx` — add `<RouteVeil/>`; add route-aware `frameloop`/pause; raise DPR-cap discipline (already `[1,1.75]`); pause-on-hidden via drei.
- `src/components/r3f/Effects.tsx` — expand the shared skin (Bloom + low Vignette + thin Scanline), carefully.
- `src/app/page.tsx` — swap `<ScrollJourneyLazy/>` for `<TunnelTransition/>`.
- `src/app/method/page.tsx` — mount `<MethodSignature/>` in the hero (presentation only; copy untouched).

Delete (final tasks, after smoke is green):
- `src/components/ScrollJourney.tsx`, `src/components/ScrollJourneyLazy.tsx` (folded into the Stage).
- `src/app/concept-preview/` (whole folder: `page.tsx`, `Concept1.tsx`, `Concept2.tsx`, `Concept3.tsx`).
- `public/_tunnel.html`, `public/_tunnel_variants.js`.
- `scripts/_scratch-concept-shots.mjs`, `scripts/_scratch-gen-concepts.mjs`, `scripts/_scratch-gen-variants.mjs`, `scripts/_scratch-home-journey.mjs`, `scripts/_scratch-tunnel-shots.mjs`, `scripts/_shots/`.

---

## Task 1: Route-transition signal + bridge

**Files:**
- Create: `src/lib/r3f/route-signal.ts`
- Create: `src/components/r3f/RouteSignalBridge.tsx`

- [ ] **Step 1: Create the route signal module** (dependency-free, no React state; read in `useFrame`. A route change sets `startedAt`; the Stage's RouteVeil samples `veilProgress(now)` → 0..1 over `VEIL_MS`, eased, then idles. Scroll velocity at the moment of transition tints intensity so a fast scroll-jump washes brighter.)

```ts
// Route-transition signal — a module singleton pulsed on every client route
// change by <RouteSignalBridge/>. The Stage's <RouteVeil/> reads it each frame
// (no React re-render) and plays a single nebula-wash. Velocity is sampled from
// the scroll-signal at pulse time so a fast scroll into a nav-click washes
// slightly brighter. Dependency-free; safe to import on the server (guards).
import { readSignal } from "./scroll-signal";

const VEIL_MS = 700; // wash duration
const FIRST_LOAD_SUPPRESS_MS = 400; // do not wash on the very first mount

type RouteState = { startedAt: number; intensity: number; firstDone: boolean };

const state: RouteState = { startedAt: -1e9, intensity: 0, firstDone: false };

/** Pulse a transition. Called by the bridge on pathname change. The first call
 *  (initial mount) is suppressed so a hard refresh does not flash a veil. */
export function pulseRoute() {
  if (typeof window === "undefined") return;
  if (!state.firstDone) {
    state.firstDone = true;
    // suppress the mount pulse but record a baseline so timing math is sane
    state.startedAt = performance.now() - FIRST_LOAD_SUPPRESS_MS - VEIL_MS;
    return;
  }
  const v = Math.min(1, Math.abs(readSignal().velocity) * 14);
  state.intensity = 0.85 + v * 0.15; // 0.85..1.0
  state.startedAt = performance.now();
}

/** 0..1 wash progress for `now` (performance.now()). 0 when idle/finished. */
export function veilProgress(now: number): number {
  const t = (now - state.startedAt) / VEIL_MS;
  if (t <= 0 || t >= 1) return 0;
  // ease in-out, peak around the middle so the wash crests then clears
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return e;
}

export function veilIntensity(): number {
  return state.intensity;
}
```

- [ ] **Step 2: Create the bridge** (mirrors `RevealObserver`'s `usePathname()` route hook; renders null)

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pulseRoute } from "@/lib/r3f/route-signal";

/** Pulses the route-transition signal on every client navigation. Renders
 *  nothing. The first run (initial mount) is suppressed inside pulseRoute() so
 *  a fresh page load does not flash a veil. */
export function RouteSignalBridge() {
  const pathname = usePathname();
  useEffect(() => {
    pulseRoute();
  }, [pathname]);
  return null;
}
```

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/lib/r3f/route-signal.ts src/components/r3f/RouteSignalBridge.tsx
git commit -m "feat(r3f): route-transition signal + pathname bridge"
```

---

## Task 2: RouteVeil — the WebGL route-transition wash (replaces the deleted CSS wave)

**Files:**
- Create: `src/components/r3f/routeVeilShader.ts`
- Create: `src/components/r3f/RouteVeil.tsx`

- [ ] **Step 1: Create the veil shader** (a fullscreen-triangle pass; same nebula DNA as `Background`/tunnel — domain-warped fbm in lime/cyan with a whisper of magenta — but driven by `uVeil` 0..1. At `uVeil≈0` it is fully transparent; mid-wash it sweeps a bright diagonal nebula band across the screen, then clears. Premultiplied-free: alpha = the band envelope so it composites over the DOM as a brief glowing veil, never a permanent overlay. NO backticks inside this string.)

```ts
// One-shot route-transition wash. A diagonal nebula band crosses the viewport
// when uVeil goes 0 -> 1 -> 0. Same lime/cyan(+magenta) language as the Stage
// background, so the transition reads as the bg surging up and clearing, not a
// foreign wipe. alpha is the band envelope => fully transparent at rest.
// NOTE: never put a backtick inside these strings.
export const VEIL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const VEIL_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uVeil;    // 0..1 wash progress (0 = idle)
  uniform float uTime;
  uniform float uAmp;     // velocity-scaled intensity (0.85..1.0)
  uniform vec2  uRes;

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++){ v += a * vnoise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    if (uVeil <= 0.001) { gl_FragColor = vec4(0.0); return; }
    vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;

    // diagonal sweep position: the band center travels from one corner to the
    // other as uVeil rises and falls (a crest, not a hard wipe).
    float axis = (uv.x + uv.y) * 0.5;            // -~1 .. ~1 along the diagonal
    float center = mix(-1.2, 1.2, uVeil);        // band sweeps across
    float band = exp(-pow((axis - center) * 1.8, 2.0)); // soft gaussian band

    // nebula content inside the band
    float t = uTime * 0.4;
    vec2 q = vec2(fbm(uv * 1.8 + vec2(0.0, t)), fbm(uv * 1.8 + vec2(5.2, -t)));
    float cloud = fbm(uv * 1.8 + 3.0 * q + vec2(t * 0.5, -t * 0.5));
    cloud = smoothstep(0.30, 0.95, cloud);

    float hue = clamp(0.5 + 0.5 * (q.x - q.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.4);

    vec3 col = tint * (0.35 + cloud * 0.9);
    float env = band * uAmp * smoothstep(0.0, 0.12, uVeil) * smoothstep(1.0, 0.85, uVeil);
    gl_FragColor = vec4(col * env, env * 0.92);
  }
`;
```

- [ ] **Step 2: Create the RouteVeil mesh** (renders ON TOP of the nebula `Background` but is part of the SAME Canvas; `renderOrder` high, `depthTest/Write` off, `transparent`, additive-ish via normal blend with alpha. On reduced motion it never animates — `pulseRoute` still records but `veilProgress` only matters when the loop runs; on reduce the Stage `frameloop` is demand so the veil simply stays transparent.)

```tsx
"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VEIL_VERT, VEIL_FRAG } from "./routeVeilShader";
import { veilProgress, veilIntensity } from "@/lib/r3f/route-signal";

/** Fullscreen one-shot route-transition wash. Same fullscreen-triangle trick as
 *  <Background/>; drawn after it (renderOrder 10) with alpha = band envelope, so
 *  at rest it is fully transparent and costs ~nothing. Reads the route-signal in
 *  useFrame — no React state. */
export function RouteVeil({ reduced }: { reduced: boolean }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uVeil: { value: 0 },
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    // On reduce the loop is on-demand; veil stays 0 (no transitions animate).
    uniforms.uVeil.value = reduced ? 0 : veilProgress(performance.now());
    uniforms.uAmp.value = veilIntensity();
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uRes.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={10}>
      <shaderMaterial
        vertexShader={VEIL_VERT}
        fragmentShader={VEIL_FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
```

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/r3f/routeVeilShader.ts src/components/r3f/RouteVeil.tsx
git commit -m "feat(r3f): RouteVeil one-shot WebGL route-transition wash"
```

---

## Task 3: Wire RouteVeil + RouteSignalBridge + route-aware pause into the Stage/layout

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/r3f/Stage.tsx`

- [ ] **Step 1: Mount the bridge in `layout.tsx`.** Add the import near the other r3f imports:

```tsx
import { RouteSignalBridge } from "@/components/r3f/RouteSignalBridge";
```

Then mount it right after the existing `<ScrollSignalBridge/>` (added in Phase A Task 6). Find:

```tsx
        <ScrollSignalBridge />
```

and make it:

```tsx
        <ScrollSignalBridge />
        <RouteSignalBridge />
```

- [ ] **Step 2: Add `<RouteVeil/>` to the Stage + on-demand invalidation so the veil plays even under `frameloop="demand"`.** Open `src/components/r3f/Stage.tsx` (Phase A). Add imports:

```tsx
import { RouteVeil } from "./RouteVeil";
```

Add the veil inside the `<Canvas>` AFTER `<Background reduced={reduced} />` and BEFORE `<View.Port />` (so it draws over the bg but views/effects still sit above it in compositing):

```tsx
      <Background reduced={reduced} />
      <RouteVeil reduced={reduced} />
      <View.Port />
      <Effects />
```

> The veil reads its own progress via `useFrame`; with the default `frameloop="always"` (motion ON) it animates for free. On reduce (`frameloop="demand"`) the veil stays transparent by design (Task 2 forces `uVeil=0` when `reduced`), so no invalidation is needed there — a reduced-motion visitor sees an instant route change with no wash, which is the correct, calm behavior.

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 4: Restart dev, screenshot a route change** (watcher broken). Restart dev (Conventions helper), wait for `Ready in`, then capture the veil mid-transition by navigating client-side and shooting fast:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1280,height:720});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await new Promise(r=>setTimeout(r,1500));await Promise.all([pg.click('a[href=\"/method\"]'),(async()=>{await new Promise(r=>setTimeout(r,300));await pg.screenshot({path:'scripts/_shots/phaseD-veil.png'});})()]);await new Promise(r=>setTimeout(r,1200));await pg.screenshot({path:'scripts/_shots/phaseD-after.png'});console.log('canvas present:',!!(await pg.$('canvas')));await b.close();})"
```

Expected: `canvas present: true`; `phaseD-veil.png` shows a brief diagonal lime/cyan nebula band across the page during navigation, and `phaseD-after.png` (post-wash on `/method`) is clear (no permanent overlay — the veil returned to transparent). The home/Method copy renders normally under/after the wash.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/r3f/Stage.tsx
git commit -m "feat(r3f): wire RouteVeil + RouteSignalBridge into Stage/layout"
```

---

## Task 4: Fold the ScrollJourney tunnel into the Stage as a DOM-placed `<View>` transition

The standalone `ScrollJourney` runs its OWN raw-WebGL context portaled to `<body>`. Fold it into the shared Stage as a DOM-placed `<View track={wrapRef}>` (the proven variant), keeping the exact stations/copy/scroll behavior, so there is one WebGL context.

**Files:**
- Create: `src/components/r3f/tunnelShader.ts`
- Create: `src/components/r3f/TunnelView.tsx`
- Create: `src/components/r3f/TunnelTransition.tsx`

- [ ] **Step 1: Port the tunnel shader to a drei-`<View>`-friendly module.** This is the FRAG from `ScrollJourney.tsx` (lines 52–130) **verbatim** in body, but as a `shaderMaterial`-style program (R3F injects the Three prefix, so drop the explicit `precision`/`attribute` declarations and the RawShader assumptions). The vertex shader is the fullscreen-triangle (`position.xy`). NO backticks inside the strings.

```ts
// Tunnel transition shader — the ScrollJourney nebula-tunnel FRAG, ported to an
// R3F shaderMaterial so it runs inside the shared Stage Canvas (one context) via
// a DOM-placed <View>. Body is byte-identical to the original ScrollJourney FRAG;
// only the precision/attribute prologue is dropped (R3F/Three injects it).
// NOTE: never put a backtick inside these strings.
export const TUNNEL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const TUNNEL_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);
  const float PI = 3.14159265;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++){ v += a * vnoise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 p = (vUv * uRes - 0.5 * uRes) / uRes.y;
    vec2 m = uMouse;
    p -= m * 0.12;
    float r = length(p) + 1e-4;
    vec2 dir = p / r;
    float depth = uProgress * 4.0 + uTime * 0.06;
    float flow = 0.42 / r + depth;

    vec2 cb = dir * 1.7;
    vec2 q  = vec2(fbm(cb + vec2(0.0, flow)), fbm(cb + vec2(5.2, flow * 0.8)));
    vec2 rr = vec2(fbm(cb + 3.4 * q + vec2(1.7, flow * 0.5) + m * 0.5),
                   fbm(cb + 3.4 * q + vec2(8.3, flow * 0.6) + m * 0.8));
    float cloud = fbm(cb + 4.0 * rr + vec2(flow * 0.45, -flow * 0.35));
    cloud = smoothstep(0.30, 0.95, cloud);
    cloud = pow(cloud, 1.3);

    vec2 cur = m * vec2(uRes.x / uRes.y, 1.0) * 0.5;
    float md = length(p - cur);
    float torch = exp(-md * md * 1.7);

    float hue = clamp(0.5 + 0.5 * (q.x - rr.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.45);

    vec3 col = vec3(0.011, 0.012, 0.017);
    col += tint * cloud * 0.42;
    col += CYAN * pow(cloud, 3.0) * 0.12;
    col += tint * cloud * torch * 0.5;
    col += tint * torch * 0.08;

    float ribs = smoothstep(0.92, 1.0, sin(flow * PI));
    col += tint * ribs * 0.12;

    float centerDark = smoothstep(0.0, 0.45, r);
    col *= mix(0.55, 1.0, centerDark);

    float vig = smoothstep(1.4, 0.18, r);
    col *= 0.5 + 0.5 * vig;
    col = col / (col + 0.85);

    gl_FragColor = vec4(col, 1.0);
  }
`;
```

- [ ] **Step 2: Create `TunnelView`** — the mesh that runs INSIDE a drei `<View>`. It reads the same `readSignal()` (cursor) plus a `progress`/`vis` it gets from the DOM wrap via a ref the parent updates. We pass a `getState()` accessor (a ref holding `{progress, vis, time0}`) so there is no React re-render per frame.

```tsx
"use client";

import { useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { readSignal } from "@/lib/r3f/scroll-signal";
import { TUNNEL_VERT, TUNNEL_FRAG } from "./tunnelShader";

export type TunnelState = { progress: number; time0: number };

/** Fullscreen-triangle tunnel inside a <View>. Reads scroll progress from a
 *  parent-owned ref (no re-render) and the cursor from readSignal(). On reduced
 *  motion the parent freezes progress at a formed value and the Stage frameloop
 *  is demand, so this draws a single static frame. */
export function TunnelView({ state }: { state: RefObject<TunnelState> }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  const eased = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((s) => {
    const st = state.current;
    uniforms.uProgress.value = st ? st.progress : 0;
    uniforms.uTime.value = st ? (performance.now() - st.time0) / 1000 : 0;
    // <View> renders into the tracked element's box; size is that box.
    uniforms.uRes.value.set(s.size.width, s.size.height);
    const sig = readSignal();
    // map signal mx/my (0..1) to centered -1..1 like the original onMove
    eased.set(sig.mx * 2 - 1, sig.my * 2 - 1);
    uniforms.uMouse.value.lerp(eased, 0.08);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={TUNNEL_VERT}
        fragmentShader={TUNNEL_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
```

- [ ] **Step 3: Create `TunnelTransition`** — the DOM unit replacing `ScrollJourney`. Keep the EXACT stations array + copy + the 300vh spacer + the gate math + the station cross-fade, but render the WebGL through a DOM-placed `<View track={hostRef}>` (fixed full-takeover host) instead of the portaled raw canvas. The host `<View>` composites through the Stage's `<View.Port/>`. Stations/hint DOM stay as the original (the existing copy: ENTER → STRATEGY → BUILD → SHIP).

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { TunnelView, type TunnelState } from "./TunnelView";

/**
 * TunnelTransition — the home scroll-flight, folded into the shared Stage.
 *
 * The visuals now render through a DOM-placed <View track={hostRef}> (the proven
 * drei variant) that composites in the single Stage Canvas — one WebGL context,
 * the shared post-processing skin — instead of ScrollJourney's separate context.
 * The 300vh spacer, the edge cross-fade gate, the four stations, and ALL copy are
 * unchanged from the original component (content-preserving; presentation only).
 */
const STATIONS = [
  { center: 0.05, label: "§ 00 · ENTER", title: "PTRK.SYSTEMS", sub: "Design Engineering Unit · Budapest", c: "#c2fe0c" },
  { center: 0.37, label: "§ 01 · STRATEGY", title: "Stratégiától", sub: "kutatás · IA · design rendszerek", c: "#01ffff" },
  { center: 0.64, label: "§ 02 · BUILD", title: "a frontendig", sub: "production-grade kód · CI/CD", c: "#ea027e" },
  { center: 0.93, label: "§ 03 · SHIP", title: "élesben.", sub: "discovery → live deploy", c: "#ff8c42" },
];
const STATION_W = 0.17;
const RAMP = 0.55;

export function TunnelTransition() {
  const [reduced] = useState(() => (typeof window === "undefined" ? false : reducedMotion()));
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<TunnelState>({ progress: 0, time0: 0 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = hostRef.current;
    if (!wrap) return;
    stateRef.current.time0 = performance.now();

    // ---- reduced: one formed static frame, in-flow, only ENTER --------------
    if (reduced) {
      stateRef.current.progress = 0.12;
      const s0 = stationRefs.current[0];
      if (s0) s0.style.opacity = "1";
      if (host) host.style.opacity = "1";
      return;
    }

    // ---- animated: gate the fixed host's opacity to the wrap rect -----------
    let progress = 0;
    let vis = 0;
    const readScroll = () => {
      const vh = window.innerHeight;
      const ramp = vh * RAMP;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - vh;
      progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (rect.top > 0) vis = 1 - Math.min(1, rect.top / ramp);
      else if (rect.bottom < vh) vis = Math.max(0, (rect.bottom - (vh - ramp)) / ramp);
      else vis = 1;
      vis = Math.min(1, Math.max(0, vis));
      stateRef.current.progress = progress;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (host) host.style.opacity = String(vis);
      for (let i = 0; i < STATIONS.length; i++) {
        const el = stationRefs.current[i];
        if (el) el.style.opacity = String(vis * Math.max(0, 1 - Math.abs(progress - STATIONS[i].center) / STATION_W));
      }
      if (hintRef.current) hintRef.current.style.opacity = String(vis * Math.max(0, 1 - progress / 0.12));
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (raf === 0) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, mounted]);

  const station = (s: (typeof STATIONS)[number], i: number, z: string) => (
    <div
      key={i}
      ref={(el) => { stationRefs.current[i] = el; }}
      className={`pointer-events-none fixed inset-0 ${z}`}
      style={{ opacity: 0 }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 54% 42% at 50% 52%, rgba(5,5,8,0.82), rgba(5,5,8,0.35) 55%, transparent 78%)" }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 font-monospec text-xs uppercase tracking-[0.4em]" style={{ color: s.c }}>{s.label}</div>
        <h2 className="font-khinterference text-[clamp(48px,9vw,150px)] font-extrabold uppercase leading-[0.85] tracking-tight text-primary">
          {s.title}
        </h2>
        <div className="mt-6 font-monospec text-sm uppercase tracking-[0.3em] text-secondary">{s.sub}</div>
      </div>
    </div>
  );

  // --- reduced: one calm static screen, in-flow (no pin, no portal) --------
  if (reduced) {
    return (
      <section
        ref={wrapRef}
        data-section="§ 00→"
        data-label="Stratégiától élesig"
        className="relative h-screen w-full overflow-hidden bg-[#050508]"
      >
        <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" style={{ opacity: 1 }} aria-hidden>
          <View className="h-full w-full" track={hostRef as React.RefObject<HTMLElement>}>
            <TunnelView state={stateRef} />
          </View>
        </div>
        <div
          ref={(el) => { stationRefs.current[0] = el; }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: 1 }}
        >
          <div className="mb-5 font-monospec text-xs uppercase tracking-[0.4em]" style={{ color: STATIONS[0].c }}>{STATIONS[0].label}</div>
          <h2 className="font-khinterference text-[clamp(48px,9vw,150px)] font-extrabold uppercase leading-[0.85] tracking-tight text-primary">
            {STATIONS[0].title}
          </h2>
          <div className="mt-6 font-monospec text-sm uppercase tracking-[0.3em] text-secondary">{STATIONS[0].sub}</div>
        </div>
      </section>
    );
  }

  // --- animated: 300vh scroll-spacer + portaled full-takeover overlay ------
  return (
    <>
      <section
        ref={wrapRef}
        data-section="§ 00→"
        data-label="Stratégiától élesig"
        className="relative h-[300vh] w-full"
      />
      {mounted &&
        createPortal(
          <>
            {/* z-[35]: above the live terminal aside (z-12) + progress chips
                (z-30), below the nav (z-40). The <View> host tracks this box;
                the Stage Canvas composites the tunnel into it. */}
            <div ref={hostRef} className="pointer-events-none fixed inset-0 z-[35] h-full w-full" style={{ opacity: 0 }} aria-hidden>
              <View className="h-full w-full" track={hostRef as React.RefObject<HTMLElement>}>
                <TunnelView state={stateRef} />
              </View>
            </div>
            {STATIONS.map((s, i) => station(s, i, "z-[36]"))}
            <div
              ref={hintRef}
              className="pointer-events-none fixed bottom-6 left-1/2 z-[36] -translate-x-1/2 font-monospec text-[11px] uppercase tracking-[0.3em] text-secondary/50"
              style={{ opacity: 0 }}
            >
              ↓ görgess
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
```

> **`<View track>` gotcha:** drei `<View>` tracks the DOM box you pass. We track the SAME `hostRef` div the `<View>` lives in — this is the DOM-placed variant proven to render in the concept preview. The Stage's `<View.Port/>` (Phase A) does the compositing; do NOT add a second Canvas.

- [ ] **Step 4: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 5: Commit** (not yet swapped into the page — that is Task 5, so home still uses ScrollJourney here)

```bash
git add src/components/r3f/tunnelShader.ts src/components/r3f/TunnelView.tsx src/components/r3f/TunnelTransition.tsx
git commit -m "feat(r3f): TunnelTransition — fold ScrollJourney into a Stage <View>"
```

---

## Task 5: Swap the home page to `TunnelTransition`, retire `ScrollJourney`

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/ScrollJourney.tsx`, `src/components/ScrollJourneyLazy.tsx`

- [ ] **Step 1: Swap the import + usage in `src/app/page.tsx`.** Replace the import line:

```tsx
import { ScrollJourneyLazy } from "@/components/ScrollJourneyLazy";
```

with:

```tsx
import { TunnelTransition } from "@/components/r3f/TunnelTransition";
```

Replace the usage block:

```tsx
      {/* ─────────────────────  SCROLL JOURNEY (pinned camera)  ───────────────────── */}
      {/* Cinematic fly-through: ENTER → STRATEGY → BUILD → SHIP. Lazy three.js,
          motion-gated, self-pinning via a fixed canvas over a 300vh wrap. */}
      <ScrollJourneyLazy />
```

with:

```tsx
      {/* ─────────────────────  SCROLL JOURNEY (pinned camera)  ───────────────────── */}
      {/* Cinematic fly-through: ENTER → STRATEGY → BUILD → SHIP. Now folded into
          the shared Stage Canvas via a DOM-placed <View> (one WebGL context),
          motion-gated, self-pinning via a fixed host over a 300vh wrap. */}
      <TunnelTransition />
```

> `TunnelTransition` is already a client component; it does not need a Lazy wrapper because the heavy three/drei code lives in the Stage (already `ssr:false` via `StageLazy`). `TunnelTransition` only renders DOM + a `<View>` placeholder, which is cheap and SSR-safe (the `<View>` no-ops until the Stage's `<View.Port/>` mounts).

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 3: Restart dev, verify the tunnel renders through the Stage** (watcher broken). Restart dev, wait for `Ready in`, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1280,height:720});const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PE:'+e.message));await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await pg.evaluate(()=>window.scrollTo(0, window.innerHeight*2.2));await new Promise(r=>setTimeout(r,1800));await pg.screenshot({path:'scripts/_shots/phaseD-tunnel.png'});console.log('canvases:',(await pg.$$('canvas')).length,'errors:',errs.length,errs.slice(0,3));await b.close();})"
```

Expected: exactly **ONE** `canvas` (the Stage — confirming the tunnel no longer spins up its own context); `errors: 0`; `phaseD-tunnel.png` shows the nebula tunnel with a station overlay (e.g. STRATEGY/BUILD copy) over it, same look as before. If you see TWO canvases, the old ScrollJourney is still mounted — re-check the page swap.

- [ ] **Step 4: Confirm nothing else imports ScrollJourney**

Run: `git grep -n "ScrollJourney" src` — Expected: NO matches.

- [ ] **Step 5: Delete the dead tunnel files**

```bash
git rm src/components/ScrollJourney.tsx src/components/ScrollJourneyLazy.tsx
```

- [ ] **Step 6: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(r3f): home uses Stage TunnelTransition, delete raw ScrollJourney"
```

---

## Task 6: Carefully expand the shared EffectComposer skin (without breaking views)

The Phase A `Effects.tsx` is Bloom-only. Add a low-strength `Vignette` and a thin animated `Scanline` (a custom shader Effect from `postprocessing`) to unify the "skin" — but the concept preview showed extra effects can break `<View>` compositing, so do it in ONE careful step and verify views still render before committing.

**Files:**
- Modify: `src/components/r3f/Effects.tsx`

- [ ] **Step 1: Replace `Effects.tsx`** (Bloom-first kept; add a gentle Vignette + a hand-rolled thin Scanline effect via `postprocessing`'s `Effect` class wrapped as a drei-style primitive. The Scanline is subtle so HUD copy stays readable. `BlendFunction.NORMAL`/low opacity keeps it from washing the dark nebula.)

```tsx
"use client";

import { forwardRef, useMemo } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import { Uniform } from "three";

// --- a minimal, restrained CRT scanline effect (no backticks in the GLSL) ----
const SCANLINE_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform float uDensity;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
    float line = sin(uv.y * uDensity) * 0.5 + 0.5;
    float scan = mix(1.0, 1.0 - uOpacity, line);
    outputColor = vec4(inputColor.rgb * scan, inputColor.a);
  }
`;

class ScanlineEffect extends Effect {
  constructor({ opacity = 0.06, density = 1400 } = {}) {
    super("ScanlineEffect", SCANLINE_FRAG, {
      uniforms: new Map([
        ["uOpacity", new Uniform(opacity)],
        ["uDensity", new Uniform(density)],
      ]),
    });
  }
}

const Scanline = forwardRef<ScanlineEffect, { opacity?: number; density?: number }>(
  function Scanline({ opacity, density }, ref) {
    const effect = useMemo(() => new ScanlineEffect({ opacity, density }), [opacity, density]);
    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);

/** One shared post-processing pass for the whole Stage — the "unified skin".
 *  Bloom-first (Phase A) + a low vignette + a very faint scanline, all kept
 *  subtle so body copy and the nebula stay readable. Ordered Bloom -> Vignette
 *  -> Scanline. KEEP this minimal: heavier effects (chromatic aberration, noise)
 *  broke <View> compositing in testing — do not add them. */
export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.35} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.28} darkness={0.62} />
      <Scanline opacity={0.05} density={1400} />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean. (If `postprocessing`'s `Effect`/`BlendFunction` types complain, the import is `import { Effect } from "postprocessing"` — it is a transitive dep of `@react-three/postprocessing`; it resolves.)

- [ ] **Step 3: Restart dev, verify the tunnel `<View>` STILL composites with the expanded skin** (this is the risk step). Restart dev, then re-run the Task-5 tunnel screenshot AND the Method/work-card view check (Task 7 view if already in; otherwise just the tunnel):

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1280,height:720});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await pg.evaluate(()=>window.scrollTo(0, window.innerHeight*2.2));await new Promise(r=>setTimeout(r,1800));await pg.screenshot({path:'scripts/_shots/phaseD-skin-tunnel.png'});await b.close();})"
```

Expected: `phaseD-skin-tunnel.png` still shows the tunnel through the `<View>` (NOT a black/empty box) with a slightly richer bloom + faint vignette + barely-visible scanlines. **If the tunnel view goes black/empty, the composer broke view compositing** — back off: remove the `<Scanline/>` line first and re-test; if still broken, remove `<Vignette/>` too and keep Bloom-only. Commit only what still renders the view.

- [ ] **Step 4: Commit**

```bash
git add src/components/r3f/Effects.tsx
git commit -m "feat(r3f): expand shared skin (Bloom + vignette + faint scanline)"
```

---

## Task 7: Light 3D signature on the Method hero (DOM-placed `<View>`)

Add a restrained 3D mark to the Method hero that sits behind the existing headline — a slowly rotating wireframe "process ladder" (six stacked rings = the six phases), in cyan/lime, using emissive standard material (NO transmission material — it renders black headless). Content/copy untouched; this is a decorative backdrop layer.

**Files:**
- Create: `src/components/r3f/MethodSignature.tsx`
- Modify: `src/app/method/page.tsx`

- [ ] **Step 1: Create `MethodSignature.tsx`** (DOM host + a `<View track>` rendering six wireframe torus rings receding in Z; gentle auto-rotate + scroll-coupled tilt via `readSignal()`; motion-gated to a static pose. The six rings echo the page's "06 phases" without adding copy.)

```tsx
"use client";

import { useRef, useMemo, type RefObject } from "react";
import { View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";
import { readSignal } from "@/lib/r3f/scroll-signal";

const CYAN = "#01ffff";
const LIME = "#c2fe0c";

function Ladder({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  useFrame((s) => {
    if (!group.current) return;
    if (reduced) {
      group.current.rotation.set(0.35, 0.6, 0);
      return;
    }
    const sig = readSignal();
    group.current.rotation.y = s.clock.elapsedTime * 0.18 + sig.mx * 0.4;
    group.current.rotation.x = 0.25 + sig.my * 0.2;
  });

  return (
    <group ref={group}>
      {rings.map((i) => (
        <mesh key={i} position={[0, 0, -i * 0.9]}>
          <torusGeometry args={[1.4 - i * 0.04, 0.02, 8, 80]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? CYAN : LIME}
            emissive={i % 2 === 0 ? CYAN : LIME}
            emissiveIntensity={1.1}
            wireframe
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Light decorative 3D signature for the Method hero — six wireframe rings (the
 *  six phases) receding in Z, slow auto-rotate + cursor/scroll tilt. DOM-placed
 *  <View> (proven variant); composites in the shared Stage Canvas. No transmission
 *  material (renders black headless). Motion-gated to a static pose. */
export function MethodSignature() {
  const [reduced] = useState(() => (typeof window === "undefined" ? false : reducedMotion()));
  const hostRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
    >
      <View className="h-full w-full" track={hostRef as RefObject<HTMLElement>}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 2, 4]} intensity={2} color={CYAN} />
        <Ladder reduced={reduced} />
      </View>
    </div>
  );
}
```

Add the missing import at the top of the file (named `useState`):

```tsx
import { useRef, useMemo, useState, type RefObject } from "react";
```

(Replace the earlier `import { useRef, useMemo, type RefObject } from "react";` line with this one so `useState` is in scope.)

- [ ] **Step 2: Mount it in the Method hero (presentation only).** Open `src/app/method/page.tsx`. Add the import after the existing component imports:

```tsx
import { MethodSignature } from "@/components/r3f/MethodSignature";
```

The hero `<section>` (line 58) is already `relative ... overflow-hidden`. Inject the signature as the deepest decorative layer, right after the opening `<section ...>` tag and before `<div className="max-w-[1500px] ...">`:

```tsx
      <section className="relative z-10 px-6 md:px-10 pt-32 md:pt-48 pb-32 md:pb-44 overflow-hidden">
        {/* Decorative 3D process-ladder signature (Stage <View>, motion-gated) */}
        <MethodSignature />
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
```

(The signature is `absolute inset-0 -z-10`, behind the headline; the global `text-shadow` readability shield keeps the copy legible over it, same as `AsciiField`/`HeroBackdrop` on the home hero.)

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 4: Restart dev, verify the Method signature renders + copy stays legible**. Restart dev, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push('PE:'+e.message));await pg.goto('http://localhost:3000/method',{waitUntil:'networkidle0',timeout:60000});await pg.mouse.move(900,400);await new Promise(r=>setTimeout(r,2000));await pg.screenshot({path:'scripts/_shots/phaseD-method.png'});console.log('canvases:',(await pg.$$('canvas')).length,'errors:',errs.length,errs.slice(0,3));await b.close();})"
```

Expected: ONE canvas; `errors: 0`; `phaseD-method.png` shows the cyan/lime wireframe rings faintly behind the "Stratégiától / a deployig." headline, with the headline fully readable. (No black box — confirming the emissive/standard material works headless, unlike transmission.)

- [ ] **Step 5: Commit**

```bash
git add src/components/r3f/MethodSignature.tsx src/app/method/page.tsx
git commit -m "feat(r3f): light wireframe 3D signature on the Method hero"
```

---

## Task 8: Performance + motion-gate sweep (DPR cap, pause-on-hidden, frameloop-on-reduce, route-aware)

Consolidate the perf/motion discipline now that the Stage hosts background + veil + tunnel-view + method-view.

**Files:**
- Modify: `src/components/r3f/Stage.tsx`

- [ ] **Step 1: Add pause-on-hidden + DPR clamp + on-reduce static frame to `Stage.tsx`.** Confirm/keep `dpr={[1, 1.75]}` and `frameloop={reduced ? "demand" : "always"}` (Phase A). Add a small `<StagePerf/>` child inside the Canvas that (a) pauses the render loop when the tab is hidden by toggling the R3F frameloop via `useThree().setFrameloop`, and (b) on reduce, requests exactly one frame so the static nebula + static method rings + static tunnel-frame paint. Add the import and the child:

```tsx
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
```

Add this component in `Stage.tsx` (above `export function Stage`):

```tsx
/** Pauses the shared render loop while the tab is hidden (battery/CPU) and, on
 *  reduced motion, requests a single formed frame so the static scene paints. */
function StagePerf({ reduced }: { reduced: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (reduced) {
      // demand mode: paint one formed frame after children mount.
      const id = requestAnimationFrame(() => invalidate());
      return () => cancelAnimationFrame(id);
    }
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      setFrameloop("always");
    };
  }, [reduced, setFrameloop, invalidate]);
  return null;
}
```

Mount it first inside the Canvas:

```tsx
    >
      <StagePerf reduced={reduced} />
      <Background reduced={reduced} />
      <RouteVeil reduced={reduced} />
      <View.Port />
      <Effects />
    </Canvas>
```

> Net effect: motion ON → loop runs, pauses when tab hidden, resumes on focus. Motion OFF → `frameloop="demand"`, one formed frame, zero ongoing animation across background/veil/tunnel/method. The route veil correctly stays inert on reduce (Task 2). DPR is capped at 1.75 (matches the original ScrollJourney cap) so SwiftShader/low-GPU machines stay smooth.

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 3: Restart dev, verify reduced-motion is static + visible-pause works**. Restart dev, then test reduce by setting localStorage before load:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1280,height:720});await pg.evaluateOnNewDocument(()=>localStorage.setItem('ptrk-motion','off'));await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await new Promise(r=>setTimeout(r,1500));await pg.screenshot({path:'scripts/_shots/phaseD-reduce.png'});console.log('canvas:',!!(await pg.$('canvas')));await b.close();})"
```

Expected: `canvas: true`; `phaseD-reduce.png` shows a static formed nebula (no animation), the home hero copy intact. (Manually scrubbing would show no veil flash, no tunnel motion — reduced visitors get a calm static site.)

- [ ] **Step 4: Commit**

```bash
git add src/components/r3f/Stage.tsx
git commit -m "perf(r3f): pause-on-hidden + reduced-motion static frame + DPR discipline"
```

---

## Task 9: Delete the throwaway concept-preview + scratch files

**Files:**
- Delete: `src/app/concept-preview/` (folder), `public/_tunnel.html`, `public/_tunnel_variants.js`, the five `scripts/_scratch-*.mjs`, `scripts/_shots/`.

- [ ] **Step 1: Confirm the concept-preview route is not referenced by the sitemap/nav.**

Run: `git grep -n "concept-preview" src` — Expected: matches ONLY inside `src/app/concept-preview/` itself (no nav link, not in `src/app/sitemap.ts`). If `sitemap.ts` lists it, remove that entry first.

- [ ] **Step 2: Delete the throwaway files**

```bash
git rm -r src/app/concept-preview
git rm public/_tunnel.html public/_tunnel_variants.js
git rm scripts/_scratch-concept-shots.mjs scripts/_scratch-gen-concepts.mjs scripts/_scratch-gen-variants.mjs scripts/_scratch-home-journey.mjs scripts/_scratch-tunnel-shots.mjs
git rm -r scripts/_shots
```

> Note: `scripts/_shots/` also held the Phase D verification screenshots. That is fine — they are throwaway. If you want to keep the LAST verification shots for the PR, copy them out first (e.g. `cp scripts/_shots/phaseD-*.png /tmp/`), but do not re-add `_shots/` to git.

- [ ] **Step 3: Confirm nothing imports the deleted concepts**

Run: `git grep -n "concept-preview\|Concept1\|Concept2\|Concept3\|_tunnel" src` — Expected: NO matches.

- [ ] **Step 4: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(r3f): delete throwaway concept-preview + scratch files"
```

---

## Task 10: Production build + smoke gate + Lighthouse sanity

**Files:** none (verification only)

- [ ] **Step 1: Stop the dev server first** (build + dev share `.next` → white-page risk). Kill the dev server (Conventions helper).

- [ ] **Step 2: Production build** — Run: `npm run build` — Expected: build succeeds (no type/compile errors). The Stage (with the veil, tunnel-view, method-view, expanded composer) is ssr:false via `StageLazy`, so it is excluded from SSR.

- [ ] **Step 3: Render-smoke gate** — Run: `npm run smoke` — Expected: `SMOKE PASS — 0 console/page errors` (all 8 routes `✓`: `/`, `/work`, `/work/f3xykee-terminal`, `/work/nemletezik`, `/method`, `/lab`, `/connect`, `/nemletezik`). Common failure to fix if it trips: a `<View>` mounted before the Stage `<View.Port/>` exists can warn — confirm `StageLazy` is mounted in the layout and the `<View track>` hosts no-op gracefully when the port is absent (drei does this). A `postprocessing` `Effect` construction error would surface here too (Task 6) — if so, back off the Scanline.

- [ ] **Step 4: Lighthouse sanity on `/` and `/method`** (no regression vs Phase A). Build is already up from the smoke `next start` is torn down; start it again on a free port and run Lighthouse via the puppeteer-driven CLI if available, else compare the `98` claimed Performance does not drop materially:

```bash
# from ptrk-portfolio/, with a production server on :3100
npx next start -p 3100 &
node -e "setTimeout(()=>{},6000)"  # let it boot
npx lighthouse http://localhost:3100/ --only-categories=performance --quiet --chrome-flags="--headless=new --no-sandbox --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader" --output=json --output-path=./lh-home.json 2>/dev/null || echo "lighthouse CLI not present — skip, rely on smoke + manual"
node -e "try{const j=require('./lh-home.json');console.log('perf:',Math.round(j.categories.performance.score*100))}catch{console.log('no lh json')}"
# then kill the :3100 server (Conventions helper, port 3100)
```

Expected: Performance score is within a few points of the pre-Phase-D baseline (one shared WebGL context is NOT heavier than before — the old `ScrollJourney` added a SECOND context that Phase D removed, so this should be neutral-to-better). If Lighthouse CLI is not installed, rely on the smoke gate + the fact that contexts went from 2 (Stage + ScrollJourney) to 1 (Stage only). Clean up `lh-home.json` (do not commit it).

- [ ] **Step 5: Commit (only if a smoke/build fix was needed; otherwise skip)**

```bash
git add -A
git commit -m "fix(r3f): Phase D smoke-gate fixes"
```

---

## Definition of done (Phase D)

- [ ] A restrained WebGL route-transition (`<RouteVeil/>`) plays on client navigation — a brief lime/cyan nebula band that crests and clears — driven by `readSignal()` velocity + `usePathname()` changes (replacing the removed CSS wave). No permanent overlay; transparent at rest.
- [ ] The home scroll-flight is the SAME copy/stations (ENTER → STRATEGY → BUILD → SHIP) but now renders through the shared Stage Canvas via a DOM-placed `<View>` — exactly ONE WebGL context on `/` (verified: `(await pg.$$('canvas')).length === 1`). `ScrollJourney.tsx` + `ScrollJourneyLazy.tsx` deleted; no references remain.
- [ ] The Method hero has a light, motion-gated 3D wireframe "ladder" signature behind the headline (emissive/standard material, renders correctly headless), copy fully legible.
- [ ] The shared EffectComposer is expanded (Bloom + low Vignette + faint Scanline) WITHOUT breaking `<View>` compositing — the tunnel + method views still render through it (verified by screenshot, not black boxes). If any effect broke views, it was backed off and the composer kept to what renders.
- [ ] Perf/motion sweep in place: `dpr={[1,1.75]}`; render loop pauses on hidden tab; `frameloop="demand"` on reduced motion with a single formed frame; the route veil is inert on reduce. Reduced-motion visitors see a calm static site (verified with `localStorage['ptrk-motion']='off'`).
- [ ] All throwaway deleted: `src/app/concept-preview/`, `public/_tunnel.html`, `public/_tunnel_variants.js`, `scripts/_scratch-*.mjs`, `scripts/_shots/`. No references remain (`git grep` clean).
- [ ] `npx tsc --noEmit` clean; `npm run build` succeeds; `npm run smoke` = `SMOKE PASS — 0 console/page errors` (8 routes). No Lighthouse Performance regression on `/` and `/method` vs the Phase A baseline (context count dropped 2 → 1).
- [ ] Content, copy, IA, and messaging are byte-identical to before across home/Method (only presentation changed). No new marketing copy invented; the stations + Method text are reused verbatim from the existing components/data.

## Notes / risks carried forward
- **MeshTransmissionMaterial avoided on purpose** — it renders OPAQUE/black under headless SwiftShader. The Method signature uses emissive standard material so screenshots are trustworthy. If real-browser glass is wanted later, verify it on a real GPU, not via smoke.
- **Composer-vs-`<View>` fragility:** Task 6 is the one place where an extra effect could blank the tunnel/method views (as ChromaticAberration/Noise did in the concept preview). The plan deliberately adds only Vignette + a tiny custom Scanline and verifies views before committing; the documented back-off path is Bloom-only.
- **Turbopack watcher is broken** — every visual verification step restarts `next dev`; never trust a screenshot without a fresh recompile line in the dev log.
- **No backticks inside any GLSL template literal** (RouteVeil, tunnel, scanline shaders) — a stray backtick silently breaks the module → stale compile.
