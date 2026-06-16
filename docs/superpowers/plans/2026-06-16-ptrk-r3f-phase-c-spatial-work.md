# R3F Phase C — Spatial Work (per-project 3D signatures) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each real project (F3XYKEE / MolekulaX / Donna) a distinct, accent-colored 3D "signature" object anchored to its card via the **DOM-placed `<View track={selfRef}>`** pattern (proven in `Concept3.tsx`), rendered inside the persistent Phase-A `<Stage>` Canvas through its existing `<View.Port/>`. Apply on BOTH the home `§ 04` "Selected work" index rows AND the `/work` page cases. Vary the object per project (distorted sphere / glass knot / wireframe icosahedron) in the project accent color, with a subtle hover reaction. Keep ALL existing copy / IA / metrics untouched — only ADD a viewport. `npx tsc --noEmit` clean, `npm run build` succeeds, `npm run smoke` green.

**Architecture:** Phase A already mounts one persistent `ssr:false` R3F `<Canvas>` (`src/components/r3f/Stage.tsx`) at `z-0`, hosting `<Background/>` + `<View.Port/>` + a minimal Bloom `<Effects/>`, with a dependency-free `scroll-signal` (`readSignal()` / `bindSignals()`). Phase C adds a small set of **signature objects** (`DistortBlob` / `GlassKnot` / `WireIco`) and a reusable client component `<ProjectSignature project hover/>` that renders a drei `<View track={selfRef}>` **placed inside the tracked DOM div**. drei composites every such `<View>` through the Stage's single `<View.Port/>` — no new Canvas, no second WebGL context. A tiny per-project `kind` map (keyed by the REAL `project.id`) chooses the object; the accent comes from the existing `ACCENT_HEX` table. Motion is gated by `reducedMotion()` (the View renders one formed frame, no animation). The DOM cards/rows are wrapped so the signature mounts beside the existing markup without rewriting any copy.

**Tech Stack:** Next.js 15.5.19 (App Router, Turbopack) · React 19.1 · TypeScript strict · Tailwind v4 · Lenis · three 0.171 · @react-three/fiber 9.6.1 · @react-three/drei 10.7.7 · @react-three/postprocessing 3.0.4

---

## Preconditions (Phase A + B landed)

This plan **builds on Phase A**. Before starting, confirm these exist (created by the Phase-A plan `docs/superpowers/plans/2026-06-16-ptrk-r3f-phase-a-stage.md`):

```bash
# from e:/Website Biz/PTRK-Systems/ptrk-portfolio
ls src/components/r3f/Stage.tsx src/components/r3f/StageLazy.tsx \
   src/components/r3f/Effects.tsx src/lib/r3f/scroll-signal.ts
grep -n "View.Port" src/components/r3f/Stage.tsx     # expect a match
grep -n "readSignal\|bindSignals" src/lib/r3f/scroll-signal.ts  # expect matches
grep -n "StageLazy" src/app/layout.tsx               # Stage mounted in layout
```

If any is missing, STOP — land Phase A first. The signature views composite through the Stage's `<View.Port/>`; without it they render nothing.

> **Reality check on the data:** `src/data/projects.ts` `PROJECTS` has exactly **3** real entries — `f3xykee-terminal` (`color:"lime"`), `molekulax` (`color:"cyan"`), `donna-pizza` (`color:"magenta"`). The 4th project + the orange/`wire` look in `Concept3.tsx` were a preview-only mock — **do NOT invent a 4th project or new copy.** This plan maps a signature `kind` onto the 3 real ids only. Accent hex comes from the existing `ACCENT_HEX` map in `src/components/BrowserPreview.tsx` (`lime #c2fe0c · cyan #01ffff · magenta #ea027e · orange #ff8c42`).

---

## Conventions for EVERY task

- **TS check:** `npx tsc --noEmit` must print nothing (clean) before a commit.
- **Dev watcher is broken on this machine.** To SEE a change in the browser/puppeteer you MUST restart the dev server. Helper (run from `ptrk-portfolio/`):
  ```bash
  # kill whatever owns :3000, then start fresh in the background
  powershell -Command "$p=(Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue).OwningProcess|Select-Object -First 1; if($p){Get-CimInstance Win32_Process -Filter \"ParentProcessId=$p\"|%{Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue}; Stop-Process -Id $p -Force -EA SilentlyContinue}"
  # then: npm run dev  (run in background; wait for 'Ready in')
  ```
- **drei `<View>` rule:** ONLY the DOM-placed variant `<View track={selfRef as RefObject<HTMLElement>}>` rendered in the preview. The `track` ref MUST point at a real, mounted DOM element that has nonzero size and is on screen. Place the `<View>` INSIDE that div. Never use the Canvas-internal multi-`<View track>` variant.
- **Keep the composer minimal.** Phase A's `<Effects/>` is Bloom-only; do NOT add ChromaticAberration/Noise here (it broke view compositing in the preview). Signatures must read fine under Bloom-only.
- **MeshTransmissionMaterial caveat:** glass (`GlassKnot`) renders OPAQUE/black under the headless SwiftShader GL used for screenshots (GPU-only material). That is EXPECTED in the puppeteer shot — verify the glass look in a REAL browser. Do not "fix" black glass based on a headless screenshot.
- **No backtick inside any GLSL/template-literal string** (none are introduced here, but if you add a shader, obey this — a stray backtick silently breaks the file → stale compile).
- **Tailwind JIT:** never build accent class names at runtime. Pass accent as inline hex from `ACCENT_HEX`; use existing static `text-*`/`bg-*` literals where the page already does.
- Commit after each task with the shown message. Do NOT push.
- Work in the main checkout (`e:/Website Biz/PTRK-Systems/ptrk-portfolio`). The dev server runs from the main checkout; a worktree is optional and not required.

---

## File map

Create:
- `src/components/r3f/signatures/signatureObjects.tsx` — the three signature objects (`DistortBlob`, `GlassKnot`, `WireIco`) + a `Signature` selector + shared lighting, ported from `Concept3.tsx`. Runs inside a `<View>` (i.e. inside the Stage Canvas).
- `src/components/r3f/ProjectSignature.tsx` — the reusable client component: a DOM-placed `<View track={selfRef}>` wrapper that mounts the right `Signature` for a `project`, with a `hover` prop and motion gate.
- `src/lib/r3f/signature-kind.ts` — `SIGNATURE_KIND` map (real `project.id` → object kind) + `signatureAccentHex(color)` helper (re-exports the canonical hex).
- `src/components/WorkIndexRow.tsx` — client wrapper for ONE home `§ 04` index row: owns `hover` state + the `<ProjectSignature/>` viewport, renders the EXISTING row markup verbatim as children-free internal JSX (copy unchanged).
- `src/components/WorkCaseSignature.tsx` — client island that mounts a `<ProjectSignature/>` into the `/work` case article (drop-in, used in the existing "Preview" column).

Modify:
- `src/app/page.tsx` — replace the inline `§ 04` `<li>` body with `<WorkIndexRow project={p} index={i} />` (same data, same copy, same `<Link href="/work">`).
- `src/app/work/page.tsx` — add `<WorkCaseSignature project={p} />` inside the existing "Preview" `aside`/column of each case (additive; existing `<BrowserPreview/>` stays).

Delete: none.

---

## Task 1: Signature kind map + accent helper

**Files:**
- Create: `src/lib/r3f/signature-kind.ts`

The signature object is chosen per REAL project id. F3XYKEE = glass knot (HUD/terminal, cyan-ish but its accent is lime → glass in lime), MolekulaX = distorted sphere (molecule/blob, cyan), Donna = instanced... no: keep the set to the three that read well under Bloom-only and don't depend on Environment too heavily. Map:

- `f3xykee-terminal` → `"wire"` (wireframe icosahedron — military-HUD lattice), accent lime.
- `molekulax` → `"distort"` (distorted sphere — molecule blob), accent cyan.
- `donna-pizza` → `"glass"` (glass knot — warm, premium), accent magenta.

This uses all three distinct objects across the three real projects, one each, varied as required. (`"cubes"` from the preview is intentionally dropped — instanced cubes need the most light and add the least over the other three; keep it out of scope.)

- [ ] **Step 1: Create the map + helper**

```ts
// Per-project 3D signature selection. Keyed by the REAL project.id in
// src/data/projects.ts (3 entries today). One distinct object each so the
// home index and /work cases read as a varied set. Accent hex is the single
// canonical brand table (mirrors BrowserPreview's ACCENT_HEX).
import type { AccentColor } from "@/data/projects";

export type SignatureKind = "distort" | "glass" | "wire";

/** project.id -> signature object kind. Unknown ids fall back to "wire". */
export const SIGNATURE_KIND: Record<string, SignatureKind> = {
  "f3xykee-terminal": "wire",
  molekulax: "distort",
  "donna-pizza": "glass",
};

export function signatureKind(id: string): SignatureKind {
  return SIGNATURE_KIND[id] ?? "wire";
}

const ACCENT_HEX: Record<AccentColor, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

export function signatureAccentHex(color: AccentColor): string {
  return ACCENT_HEX[color];
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/lib/r3f/signature-kind.ts
git commit -m "feat(r3f): per-project signature kind map + accent helper"
```

---

## Task 2: Signature objects (ported from Concept3)

**Files:**
- Create: `src/components/r3f/signatures/signatureObjects.tsx`

Port `DistortBlob`, `GlassKnot`, `WireIco` and the `Signature` selector + lighting **verbatim in behavior** from `src/app/concept-preview/Concept3.tsx` (which is proven). Differences: typed `accent: string` (we pass hex), the selector takes a `SignatureKind`, and lighting uses `Environment preset="city"` exactly as the preview. These run INSIDE a `<View>`, so they assume the Stage Canvas context (no `<Canvas>` here).

- [ ] **Step 1: Create the objects file**

```tsx
"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Environment,
} from "@react-three/drei";
import type { SignatureKind } from "@/lib/r3f/signature-kind";

interface ObjProps {
  accent: string;
  active: boolean;
}

/* Distorted emissive sphere — "molecule blob". */
function DistortBlob({ accent, active }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const scale = useRef(1);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const speed = active ? 0.9 : 0.28;
    m.rotation.y += delta * speed;
    m.rotation.x += delta * speed * 0.45;
    const target = active ? 1.12 : 1;
    scale.current = THREE.MathUtils.damp(scale.current, target, 6, delta);
    m.scale.setScalar(scale.current);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 96, 96]} />
      <MeshDistortMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={0.6}
        roughness={0.15}
        metalness={0.2}
        distort={active ? 0.42 : 0.3}
        speed={active ? 2.4 : 1.3}
      />
    </mesh>
  );
}

/* Glass torus-knot. NOTE: MeshTransmissionMaterial is GPU-only — renders
   opaque/black under headless SwiftShader screenshots; verify in a real browser. */
function GlassKnot({ accent, active }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const scale = useRef(1);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const speed = active ? 0.85 : 0.25;
    m.rotation.x += delta * speed;
    m.rotation.y += delta * speed * 0.6;
    const target = active ? 1.12 : 1;
    scale.current = THREE.MathUtils.damp(scale.current, target, 6, delta);
    m.scale.setScalar(scale.current);
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[0.72, 0.26, 220, 32]} />
      <MeshTransmissionMaterial
        color={accent}
        thickness={0.9}
        transmission={1}
        roughness={0.05}
        ior={1.4}
        chromaticAberration={0.5}
        anisotropy={0.3}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0.1}
        attenuationColor={accent}
        attenuationDistance={1.2}
      />
    </mesh>
  );
}

/* Glowing solid core inside a wireframe icosahedron shell — "HUD lattice". */
function WireIco({ accent, active }: ObjProps) {
  const group = useRef<THREE.Group>(null);
  const scale = useRef(1);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const speed = active ? 0.95 : 0.3;
    g.rotation.y += delta * speed;
    g.rotation.x += delta * speed * 0.5;
    const target = active ? 1.14 : 1;
    scale.current = THREE.MathUtils.damp(scale.current, target, 6, delta);
    g.scale.setScalar(scale.current);
  });

  return (
    <group ref={group}>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/** Selector + shared lighting. `reduced` freezes the Float drift (still renders
 *  one formed frame). Lighting mirrors the proven Concept3 setup. */
export function Signature({
  kind,
  accent,
  active,
  reduced,
}: {
  kind: SignatureKind;
  accent: string;
  active: boolean;
  reduced: boolean;
}) {
  let obj: React.ReactNode;
  if (kind === "distort") obj = <DistortBlob accent={accent} active={active} />;
  else if (kind === "glass") obj = <GlassKnot accent={accent} active={active} />;
  else obj = <WireIco accent={accent} active={active} />;

  return (
    <>
      <Float
        enabled={!reduced}
        speed={active ? 2.2 : 1.1}
        rotationIntensity={reduced ? 0 : 0.4}
        floatIntensity={reduced ? 0 : active ? 0.9 : 0.5}
      >
        {obj}
      </Float>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-3, -2, -2]} intensity={1.2} color={accent} />
      <Environment preset="city" />
    </>
  );
}
```

> Note: `<Float enabled={false}>` is a real drei prop — it stops the per-frame drift but still renders the formed pose, which is exactly the reduced-motion behavior we want. The per-object `useFrame` rotation also keys off `active`/`delta`; under the Stage's reduced-motion `frameloop` (`demand`) it ticks once on mount and then idles, so a static frame results without extra code. (If Phase A's Stage uses `frameloop="never"` instead, that single formed frame still renders; do not change Phase A here.)

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean. (If TS flags `Environment`/`Float` JSX, confirm `@react-three/drei` types resolve — they do in Concept3.tsx already.)

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/signatures/signatureObjects.tsx
git commit -m "feat(r3f): port per-project signature objects (distort/glass/wire)"
```

---

## Task 3: `<ProjectSignature/>` — the DOM-placed View wrapper

**Files:**
- Create: `src/components/r3f/ProjectSignature.tsx`

This is the single reusable unit both surfaces use. It renders a tracked `<div>` and places a drei `<View track={selfRef}>` INSIDE it (the proven pattern). The viewport is decorative (`pointer-events-none`, `aria-hidden`) so it never intercepts the card's `<Link>` clicks. The accent + kind come from the real project; `hover` is passed in by the parent (which already owns hover state for the card's existing visual transitions).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei";
import type { Project } from "@/data/projects";
import { reducedMotion } from "@/lib/motion";
import { signatureKind, signatureAccentHex } from "@/lib/r3f/signature-kind";
import { Signature } from "./signatures/signatureObjects";

/** A decorative, accent-colored 3D signature anchored to its own DOM box via a
 *  drei <View track={selfRef}> placed INSIDE the tracked div (the variant proven
 *  to render in the concept preview). Composited by the Stage's <View.Port/>.
 *  pointer-events-none + aria-hidden so it never blocks the card's link. */
export function ProjectSignature({
  project,
  hover,
  className = "",
}: {
  project: Project;
  hover: boolean;
  /** sizing/position classes for the tracked box (must give it nonzero size). */
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null!);
  const [reduced] = useState(() => reducedMotion());
  const accent = signatureAccentHex(project.color);
  const kind = signatureKind(project.id);

  return (
    <div
      ref={trackRef}
      aria-hidden
      className={`pointer-events-none relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 45%, ${accent}14, transparent 70%)`,
      }}
    >
      <View track={trackRef as RefObject<HTMLElement>} className="h-full w-full">
        <Signature kind={kind} accent={accent} active={hover} reduced={reduced} />
      </View>
      {/* HUD corner ticks — match the existing terminal language */}
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-white/15" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-white/15" />
    </div>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/r3f/ProjectSignature.tsx
git commit -m "feat(r3f): ProjectSignature DOM-placed View wrapper"
```

---

## Task 4: Home `§ 04` index rows — `<WorkIndexRow/>` client wrapper

**Files:**
- Create: `src/components/WorkIndexRow.tsx`
- Modify: `src/app/page.tsx`

The home `§ 04` "Selected work" list is an `<ol>` of `<li>` rows (see `src/app/page.tsx` lines ~381–428). Each row already: wraps in `<Link href="/work">`, computes `colorClass`, and renders index / name / `client · role` / desc / metric. We move ONE row into a client component that ALSO owns `hover` state and adds a signature viewport in a previously-empty grid column. **Copy, classes, the `<Link>`, the metric block stay byte-identical** — we only (a) lift `hover` into React state to drive both the existing `group-hover` visuals AND the signature `active`, and (b) add the viewport in the md+ layout. To avoid disturbing the 12-col grid, the signature occupies a compact box on the right of the name block on md+ and is hidden on small screens.

- [ ] **Step 1: Create `WorkIndexRow.tsx`** (mirrors the existing `<li>` JSX from `page.tsx` exactly; only `hover` wiring + signature added)

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectSignature } from "@/components/r3f/ProjectSignature";

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

/** One row of the home §04 "Selected work" index. Identical copy/markup to the
 *  former inline <li>; adds hover state (drives both the existing group-hover
 *  visuals and the 3D signature) + a compact accent signature viewport (md+). */
export function WorkIndexRow({ project: p, index: i }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const colorClass = ACCENT_TEXT[p.color];

  return (
    <li data-reveal style={{ transitionDelay: `${i * 70}ms` }} className="border-b border-white/15">
      <Link
        href="/work"
        className="block group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <div className="grid grid-cols-12 gap-4 py-8 md:py-12 items-center transition-colors group-hover:bg-surface/40">
          <div className="col-span-2 md:col-span-1 font-monospec text-xs md:text-sm text-secondary tracking-[0.2em] self-baseline">
            {String(i + 1).padStart(2, "0")} /
          </div>
          <div className="col-span-10 md:col-span-4 self-baseline">
            <div
              className={`font-khinterference uppercase tracking-[0.01em] text-5xl md:text-7xl leading-none ${colorClass} transition-transform duration-500 group-hover:translate-x-2`}
            >
              {p.name}
            </div>
            <div className="font-shorai text-secondary mt-3 text-base md:text-lg">
              {p.client} · {p.role}
            </div>
          </div>

          {/* NEW: compact 3D signature — md+ only, decorative, never blocks the link */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center">
            <ProjectSignature
              project={p}
              hover={hover}
              className="h-[120px] w-[120px] rounded-lg border border-white/5"
            />
          </div>

          <div className="col-span-7 md:col-span-4 font-shorai text-secondary/90 text-sm md:text-base leading-snug max-w-[44ch] self-baseline">
            {p.desc}
          </div>
          <div className="col-span-5 md:col-span-2 text-right font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary self-baseline">
            <div className={`${colorClass} font-sequel text-2xl md:text-3xl tracking-[-0.02em] leading-none mb-2`}>
              {p.metric}
            </div>
            <div>{p.metricLabel}</div>
            <div className="mt-2 opacity-60">{p.year}</div>
          </div>
        </div>
      </Link>
    </li>
  );
}
```

> Grid note: the original row used `md:col-span-1 / md:col-span-5 / md:col-span-4 / md:col-span-2` (= 12). We add a `md:col-span-1` signature box and shrink the name block `md:col-span-5 → md:col-span-4` so the total stays 12 and no other column moves. `items-baseline` on the grid became `items-center` (so the 120px box centers) with `self-baseline` restored on each text column to preserve the original baseline alignment of the text. Copy is unchanged.

- [ ] **Step 2: Wire it into `page.tsx`.** In `src/app/page.tsx`, replace the entire inline `{PROJECTS.map((p, i) => { ... return ( <li ...> ... </li> ); })}` block inside the `<ol className="border-t border-white/15">` (lines ~382–427) with:

```tsx
            {PROJECTS.map((p, i) => (
              <WorkIndexRow key={p.id} project={p} index={i} />
            ))}
```

And add the import near the top of `src/app/page.tsx` (after the existing component imports, e.g. after the `ScrollJourneyLazy` import):

```tsx
import { WorkIndexRow } from "@/components/WorkIndexRow";
```

(The now-unused local `colorClass` computation lived only inside that map, so it leaves with the block. `PROJECTS` is still imported and used elsewhere on the page — do not remove that import.)

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean. (If TS warns about an unused `ACCENT_*` or `colorClass` left behind in `page.tsx`, confirm the old map body was fully removed.)

- [ ] **Step 4: Restart dev + visually verify** the home §04 rows show a small accent signature, copy unchanged.

Restart dev (Conventions helper), wait for `Ready in`, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.goto('http://localhost:3000/',{waitUntil:'networkidle0',timeout:60000});await pg.evaluate(()=>{const el=[...document.querySelectorAll('h2')].find(h=>/Selected/i.test(h.textContent||''));el&&el.scrollIntoView();});await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:'scripts/_shots/phaseC-home-work.png'});const n=await pg.evaluate(()=>document.querySelectorAll('ol li').length);console.log('index rows:',n);await b.close();})"
```

Expected: `index rows: 3`; open `scripts/_shots/phaseC-home-work.png` and confirm each of the 3 rows (F3XYKEE / MOLEKULAX / DONNA) has a small glowing accent object beside the name, all original text/metrics intact. (Glass on DONNA may look dark in this headless shot — that is the documented SwiftShader caveat; verify in a real browser.)

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkIndexRow.tsx src/app/page.tsx
git commit -m "feat(r3f): per-project 3D signatures on home §04 work index"
```

---

## Task 5: `/work` cases — `<WorkCaseSignature/>` island

**Files:**
- Create: `src/components/WorkCaseSignature.tsx`
- Modify: `src/app/work/page.tsx`

`/work` is a Server Component that maps `PROJECTS` into full-width `<article>` cases wrapped in `<Link href={`/work/${p.id}`}>` (see `src/app/work/page.tsx`). The existing case has a left "Preview" label column (`md:col-span-3 lg:col-span-2`) above the `<BrowserPreview/>` row. We add a small client island `<WorkCaseSignature/>` into that left "Preview" aside so a signature sits beside each case without touching the `<BrowserPreview/>`, the copy, the stack list, or the metric block. The island owns its own hover (the whole case is a `<Link group>`, but the island reads its own pointer for the signature's `active`).

- [ ] **Step 1: Create `WorkCaseSignature.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectSignature } from "@/components/r3f/ProjectSignature";

/** A standalone accent 3D signature for a /work case. Lives in the case's
 *  "Preview" aside; decorative, additive — does not touch BrowserPreview/copy.
 *  Owns its own hover so the object reacts when the pointer is over the box. */
export function WorkCaseSignature({ project }: { project: Project }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="mt-6"
    >
      <ProjectSignature
        project={project}
        hover={hover}
        className="h-[160px] w-full rounded-lg border border-white/5"
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `work/page.tsx`.** In `src/app/work/page.tsx`, find the "Preview" aside inside the second grid of each case (the block that renders the `Preview` label + "Stilizált landing snapshot…" hint, currently lines ~102–110):

```tsx
                  <div className="hidden md:block md:col-span-3 lg:col-span-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-6 h-px ${bg}`} />
                      <span>Preview</span>
                    </div>
                    <div className="mt-3 text-secondary/60 leading-relaxed max-w-[18ch]">
                      Stilizált landing snapshot — kattints a debriefhez.
                    </div>
                  </div>
```

Add the signature island as the LAST child of that `<div>` (after the hint paragraph, still inside the aside):

```tsx
                  <div className="hidden md:block md:col-span-3 lg:col-span-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-6 h-px ${bg}`} />
                      <span>Preview</span>
                    </div>
                    <div className="mt-3 text-secondary/60 leading-relaxed max-w-[18ch]">
                      Stilizált landing snapshot — kattints a debriefhez.
                    </div>
                    {/* NEW: per-project 3D signature — decorative, additive */}
                    <WorkCaseSignature project={p} />
                  </div>
```

Add the import at the top of `src/app/work/page.tsx` (after the `DecodeText` import):

```tsx
import { WorkCaseSignature } from "@/components/WorkCaseSignature";
```

> Why the aside and not a new column: the aside is `hidden md:block` (already off on mobile, so no mobile layout change) and was previously just a label + hint — adding a 160px box under it does not shift the 12-col grid or the `<BrowserPreview/>` column. Copy, stack list, metric block, and the wrapping case `<Link>` are untouched.

- [ ] **Step 3: Type-check** — Run: `npx tsc --noEmit` — Expected: clean.

- [ ] **Step 4: Restart dev + visually verify** `/work` cases each show an accent signature in the Preview aside.

Restart dev (Conventions helper), wait for `Ready in`, then:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:1200});await pg.goto('http://localhost:3000/work',{waitUntil:'networkidle0',timeout:60000});await pg.evaluate(()=>window.scrollTo(0,700));await new Promise(r=>setTimeout(r,2500));await pg.screenshot({path:'scripts/_shots/phaseC-work-page.png',fullPage:false});await b.close();})"
```

Expected: open `scripts/_shots/phaseC-work-page.png` and confirm the first case (F3XYKEE) shows its wireframe-icosahedron signature in the Preview aside, alongside the unchanged BrowserPreview + copy + stack + metric. (Re-run with `window.scrollTo(0, 2600)` to spot-check a second case if desired.)

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkCaseSignature.tsx src/app/work/page.tsx
git commit -m "feat(r3f): per-project 3D signatures on /work cases"
```

---

## Task 6: Reduced-motion + click-through verification

**Files:** none (verification only)

The signatures must (a) freeze when motion is off, and (b) never swallow clicks on the wrapping `<Link>`.

- [ ] **Step 1: Reduced-motion check.** Restart dev, then set the off-flag and confirm the signatures render a static frame (no rotation/float):

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});await pg.evaluate(()=>localStorage.setItem('ptrk-motion','off'));await pg.reload({waitUntil:'networkidle0',timeout:60000});await pg.evaluate(()=>{const el=[...document.querySelectorAll('h2')].find(h=>/Selected/i.test(h.textContent||''));el&&el.scrollIntoView();});await pg.screenshot({path:'scripts/_shots/phaseC-home-motoff-a.png'});await new Promise(r=>setTimeout(r,2000));await pg.screenshot({path:'scripts/_shots/phaseC-home-motoff-b.png'});await b.close();})"
```

Expected: the two screenshots (`...motoff-a.png` and `...motoff-b.png`, 2s apart) are visually identical for the signatures (no rotation/drift) — i.e. `reducedMotion()` froze them. (Compare by eye; the rest of the page may differ only where other motion-gated effects already idle.)

- [ ] **Step 2: Click-through check.** Confirm the decorative viewport does not block the card link (it is `pointer-events-none`). With dev running:

```bash
node -e "import('puppeteer').then(async({default:p})=>{const b=await p.launch({headless:'shell',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage();await pg.setViewport({width:1440,height:900});await pg.goto('http://localhost:3000/work',{waitUntil:'networkidle0',timeout:60000});const ok=await pg.evaluate(()=>{const box=document.querySelector('[aria-hidden] canvas, [aria-hidden]');return getComputedStyle(document.querySelector('[aria-hidden]')).pointerEvents;});console.log('signature pointer-events:',ok);await b.close();})"
```

Expected: `signature pointer-events: none`. (The drei `<View>` and Stage canvas are also `pointer-events-none`, so the wrapping `<Link>` stays fully clickable.)

- [ ] **Step 3: Reset the off-flag** for subsequent runs (the localStorage write above is per-browser-context, so nothing persists between puppeteer launches — no cleanup needed). No commit (verification only).

---

## Task 7: Production build + smoke gate

**Files:** none (verification only)

- [ ] **Step 1: Stop the dev server first** (build + dev share `.next` → white-page risk). Kill the dev server (Conventions helper).

- [ ] **Step 2: Production build** — Run: `npm run build` — Expected: build succeeds (no type/compile errors). The Stage + all signatures are client/`ssr:false`, so SSR is unaffected; `/work/[slug]` static params still generate for the 3 ids.

- [ ] **Step 3: Render-smoke gate** — Run: `npm run smoke` — Expected: `SMOKE PASS — 0 console/page errors` (all 8 routes `✓`, including `/`, `/work`, `/work/f3xykee-terminal`). If a route logs an R3F/WebGL console error, the most likely cause is a `<View>` tracking a ref that is null/zero-size at mount (e.g. a signature in a `hidden` container that never lays out) — confirm the tracked box has size in the rendered breakpoint, or guard the `<View>` behind a mounted check. Fix before proceeding.

- [ ] **Step 4: Commit (only if a smoke fix was needed; otherwise skip)**

```bash
git add -A
git commit -m "fix(r3f): smoke-gate fixes for per-project signatures"
```

---

## Task 8: Real-browser glass verification (manual)

**Files:** none (manual verification — headless GL cannot judge transmission glass)

- [ ] **Step 1:** With `npm run dev` running, open `http://localhost:3000/work` in a real GPU browser (Chrome/Edge). Confirm the DONNA case's `GlassKnot` renders as translucent magenta-tinted glass (not the opaque black the SwiftShader screenshot shows), and that F3XYKEE (wire ico) + MolekulaX (distort blob) read in their accents. Hover each signature and confirm the subtle speed/scale reaction. Confirm body copy over the Bloom-lit signatures stays readable.

- [ ] **Step 2:** No code change expected. If the glass is too dark even on GPU, the fallback (do NOT do speculatively) is to reduce `transmission`/raise `roughness` on `GlassKnot`, or swap DONNA to `"distort"` in `SIGNATURE_KIND`. Only apply with a follow-up commit `fix(r3f): tune DONNA glass legibility` if the real browser confirms a problem.

---

## Definition of done (Phase C)

- [ ] Home `§ 04` "Selected work" index: each of the 3 real rows (F3XYKEE / MOLEKULAX / DONNA) shows a distinct accent-colored 3D signature; ALL original copy, `client · role`, desc, metric, year, and the `<Link href="/work">` are byte-identical to before.
- [ ] `/work` page: each case shows a per-project accent signature in the existing "Preview" aside; `<BrowserPreview/>`, stack list, metric, debrief CTA, and the case `<Link href="/work/[id]">` are unchanged.
- [ ] Signatures vary per project: F3XYKEE = wireframe icosahedron (lime), MolekulaX = distorted sphere (cyan), DONNA = glass knot (magenta); each in its real accent from `ACCENT_HEX`. Subtle hover speed/scale reaction works.
- [ ] All signatures composite through the Phase-A Stage's single `<View.Port/>` — NO new `<Canvas>` / WebGL context added; Bloom-only composer unchanged.
- [ ] Decorative viewports are `pointer-events-none` + `aria-hidden`; card/case links remain fully clickable.
- [ ] Reduced-motion (`localStorage['ptrk-motion']='off'`) freezes the signatures (no rotation/float) — verified by two screenshots 2s apart being identical.
- [ ] `npx tsc --noEmit` clean; `npm run build` succeeds; `npm run smoke` = `SMOKE PASS — 0 console/page errors`.
- [ ] Real-browser check (manual): glass knot reads as translucent magenta glass on a GPU browser (headless SwiftShader showing it black is the documented, accepted caveat).
- [ ] No new project, no invented marketing copy — only the 3 real `PROJECTS` entries; presentation-only change.

## Notes for the next phase (do NOT do here)
- Phase D (transitions + polish) may add scroll-progress reactions to the signatures by reading `readSignal().progress` in their `useFrame` (the signal is already live from Phase A) and fold in the WebGL section/route transitions; keep the composer minimal until then.
- Throwaway still scheduled for deletion: `src/app/concept-preview/` (incl. `Concept3.tsx`, now fully ported), `public/_tunnel.html`, `public/_tunnel_variants.js`, `scripts/_scratch-*.mjs`, `scripts/_shots/`.
