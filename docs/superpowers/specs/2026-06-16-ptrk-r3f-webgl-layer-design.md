# PTRK Systems — R3F "WebGL-layer" migration (design)

Date: 2026-06-16
Status: design approved (architecture + phases + Phase A), pending spec review → writing-plans
Repo: `e:/Website Biz/PTRK-Systems/ptrk-portfolio` (Next.js 15.5.19, React 19.1, TS strict, Tailwind v4, Lenis)

## 1. Vision & hard constraints

Elevate the **presentation** of the existing portfolio with a cohesive three.js layer — keep the **content, information architecture, and messaging exactly as they are today**. Same words and sections; a WOW, cinematic three.js tálalás with interesting WebGL solutions and visual transitions.

Replace the current **isolated, per-effect WebGL canvases** with **one persistent react-three-fiber "Stage"** that lives behind/around the DOM, scroll-synced to the existing Lenis smooth-scroll, with one shared post-processing pass ("unified skin"). On that Stage we present the existing copy with: a cinematic 3D hero entrance (Concept 1), DOM-anchored per-project 3D signatures (Concept 3), and WebGL section/route transitions.

Hard constraints:
- **Do NOT change content / copy / IA / messaging.** Only the presentation layer changes.
- Brand: near-black (#050508), neon lime #c2fe0c / cyan #01ffff, whisper magenta #ea027e, orange #ff8c42; monospace HUD/terminal vibe.
- Owner policy: motion gate via `reducedMotion()` (localStorage `ptrk-motion`, NOT OS prefers-reduced-motion). No em-dashes in copy.
- Performance matters but is no longer an absolute ceiling — the owner builds heavy 3D when a client wants it. Still: keep `npm run smoke` green and avoid gratuitous regressions. One shared WebGL context is *better* for perf than today's several.
- Incremental, shippable phases; site stays working and smoke-green between phases.

## 2. Current WebGL inventory (to be consolidated)

Isolated three.js / raw-WebGL canvases today (each its own context):
- `BgNebula.tsx` — full-viewport nebula background (fullscreen fragment shader). Inside `MarathonBackground`.
- `NetworkField.tsx` — hero node-network (HeroBackdrop on home).
- `Text3D.tsx` — extruded "ghost" words ACCESS / PROCESS (home §02/§05).
- `ScrollJourney.tsx` — the scroll-pinned nebula tunnel (just built, on home after hero; raw WebGL).
- `LabEffect.tsx` — effect on `/lab`.

Non-WebGL (2D canvas / DOM, stay as-is): `AsciiField`, `CodeRain`, scanlines, `RightDataStream` terminal, grain.

R3F stack installed (2026-06-16): `@react-three/fiber@9.6.1`, `@react-three/drei@10.7.7`, `@react-three/postprocessing@3.0.4` (three stays `0.171`).

## 3. Target architecture — "one WebGL Stage under the DOM"

1. **`<Stage>`** — one R3F `<Canvas>` mounted in the root layout: `fixed inset-0 z-0`, `pointer-events-none`, `eventSource = document.body` (so future `<View>`s can track any DOM element), `dpr={[1,1.75]}`, `alpha: true`. Lazy (`next/dynamic` ssr:false). Motion-gated. Hosts:
   - `<Background />` — the nebula (existing shader ported to an R3F `shaderMaterial` on a fullscreen plane), scroll + cursor reactive.
   - `<View.Port />` — bridge for future drei `<View>`s (none in Phase A).
   - `<Effects />` — one `<EffectComposer>` (Bloom + subtle vignette), tuned restrained so body copy stays readable.
2. **Scroll bridge** — keep Lenis; a tiny module-level signal publishes scroll progress + velocity; Stage children read it in `useFrame`. No new dependency.
3. **`<View>` bridge** (phases B/C) — drei `<View track={ref}>` placed IN the DOM (the pattern proven working in the Concept 3 preview), composited by `<View.Port/>`. NOTE: the `<View>`-inside-Canvas + multi-view `track` variant did NOT render in the preview; the DOM-placed `<View>` variant did. Use the DOM-placed variant.
4. **Hero journey** (phase B) — Concept-1 scroll-reactive 3D entrance presenting the existing hero copy.
5. **Per-project signatures** (phase C) — Concept-3 per-card 3D objects via DOM-placed `<View>`.
6. **Transitions** (phase D) — WebGL section/route transitions; fold the existing tunnel in.

## 4. Decomposition (each phase: own spec → plan → build; smoke-green between)

- **Phase A — Foundation (the Stage).** Build `<Stage>` + `<Background>` + `<Effects>` + scroll-signal + `<View.Port/>`. Migrate the nebula into the Stage; retire `BgNebula` from `MarathonBackground`. Everything else untouched. **← this spec details Phase A.**
- **Phase B — Hero journey.** Replace `NetworkField` (+ ghost `Text3D`) with a Concept-1 entrance in the Stage, existing hero copy.
- **Phase C — Spatial work.** Per-project 3D signatures on work cards (home §04 index + `/work`) via DOM-placed `<View>`.
- **Phase D — Transitions + polish.** WebGL section/route transitions (fold the tunnel in); method/other pages; perf + motion pass; post-processing final tune.

## 5. Phase A — detailed spec

### 5.1 Units (new files under `src/components/r3f/`)
- **`Stage.tsx`** (client): the single `<Canvas>`. Props: none (reads globals). Sets `fixed inset-0 z-0 pointer-events-none`, `eventSource=document.body`, `eventPrefix="client"`, `dpr={[1,1.75]}`, `gl={{ alpha:true, antialias:true, powerPreference:"high-performance" }}`, `camera={{ position:[0,0,5], fov:50 }}`. Children: `<Background/>`, `<View.Port/>`, `<Effects/>`. On `reducedMotion()` → set `frameloop="never"` and render one frame (drei `<PerformanceMonitor>`/manual invalidate), so it is a static nebula.
- **`StageLazy.tsx`**: `next/dynamic(() => import("./Stage").then(m=>m.Stage), { ssr:false })`.
- **`Background.tsx`** (client, runs inside Canvas): a fullscreen plane (or fullscreen-triangle) with a `shaderMaterial` ported from `BgNebula`'s FRAG (dark base, domain-warped fbm wisps, lime/cyan + whisper magenta, cursor torch). Uniforms: `uTime`, `uRes`, `uMouse`, `uScroll`. Reads scroll-signal + a cursor signal in `useFrame`. Rendered behind everything (renderOrder low, depthTest false).
- **`Effects.tsx`** (client, inside Canvas): `<EffectComposer>` with `<Bloom intensity≈0.5 luminanceThreshold≈0.35 mipmapBlur/>` + a gentle `<Vignette/>`. Restrained so text stays readable. (Multi-effect composer was fine in isolation; keep it minimal first, expand in phase D.)
- **`src/lib/r3f/scroll-signal.ts`**: a module singleton `{ progress:number, velocity:number, mouse:{x,y} }` updated by passive `scroll` + `mousemove` listeners on `window`. Lenis drives **native** scroll, so `window.scrollY / (scrollHeight - innerHeight)` is the correct, already-smoothed progress — no need to expose the Lenis instance. `velocity` = delta of progress per frame (eased). No React state, no new dependency; read directly in `useFrame`. A tiny `<ScrollSignalBridge/>` (renders null) mounted in the layout wires/tears down the listeners.

### 5.2 Wiring
- `layout.tsx`: add `<StageLazy/>` as the backmost layer (before/under `<MarathonBackground/>`'s decorative bits). Mount `<ScrollSignalBridge/>`.
- `MarathonBackground.tsx`: remove `<BgNebulaLazy/>` (its role moves to the Stage `<Background>`). Keep CodeRain, scanlines, grain, terminal — they layer above the Stage (Stage z-0; these stay where they are).
- Keep `BgNebula.tsx` on disk until the Stage nebula is verified visually equivalent, then delete `BgNebula.tsx` + `BgNebulaLazy.tsx`.

### 5.3 Data flow
- Scroll: Lenis/`window` scroll → `scroll-signal` (`progress`, `velocity`) → `Background` `useFrame` reads `uScroll`. (Phase B/C cameras will read the same.)
- Cursor: `window` mousemove → `scroll-signal.setMouse` → `Background` eases `uMouse` (the existing nebula "torch").
- Reduced motion: `reducedMotion()` → Stage `frameloop="never"`, render one formed frame; no listeners drive animation.

### 5.4 z-index / stacking
- `<Stage>` canvas: `fixed inset-0 z-0`. Site content: z-10+. Nav z-40. So the Stage is backmost, exactly where `BgNebula` was. `pointer-events-none` so it never blocks clicks (cursor read via window listener, not canvas events; `eventSource=document.body` is only for future `<View>` hit-testing, which is also pointer-events-safe since views are decorative).

### 5.5 Error handling
- No WebGL → R3F Canvas fails to create context → render nothing; the CSS void bg (#050508) shows; content unaffected. Wrap nothing special; R3F + ssr:false already degrades to empty.
- SSR: Stage is ssr:false → no server render of WebGL.

### 5.6 Testing / acceptance
- `npm run smoke` (existing Puppeteer, 7 routes) stays green — no blank pages, no console errors.
- New smoke assertion: on `/`, a Stage `<canvas>` exists and renders non-blank (sample a pixel, expect non-uniform / non-pure-black where the nebula is).
- Visual: the Stage nebula reads like today's `BgNebula` (dark, lime/cyan wisps, cursor torch). Side-by-side puppeteer screenshot vs current.
- Perf sanity: exactly ONE persistent WebGL context added for the background (was one for BgNebula too → net neutral/now shared for future phases). No Lighthouse regression on `/`.

### 5.7 Explicitly OUT of scope for Phase A (YAGNI)
- No hero journey (B), no per-project signatures (C), no transitions (D).
- Do not touch `NetworkField`, `Text3D`, `ScrollJourney`, `LabEffect` yet — they keep running as-is alongside the Stage. (They will be folded in / retired in later phases.)

## 6. Risks & notes
- **drei `<View>` gotcha (proven in preview):** the DOM-placed `<View track={selfRef}>` variant renders; the Canvas-internal multi-`<View track>` variant did not. Phases B/C must use the DOM-placed variant. A global `<EffectComposer>` with extra effects (ChromaticAberration/Noise) appeared to break view compositing in the preview — keep the composer minimal (Bloom-first) and expand carefully.
- **Turbopack dev watcher is unreliable on this machine** — restart `next dev` to apply changes; check the dev log for a recompile line before trusting a screenshot. (See memory `feedback_turbopack_watcher_broken_windows`.)
- **No backticks inside the GLSL template-literal strings** — a stray backtick silently breaks the file → stale compile. (See memory `feedback_backtick_in_template_literal_stale_compile`.)
- Throwaway to delete once Phase A lands (or earlier): `src/app/concept-preview/` (+ Concept1/2/3), `public/_tunnel.html`, `public/_tunnel_variants.js`, `scripts/_scratch-*.mjs`, `scripts/_shots/`.

## 7. Success criteria (Phase A)
The home (and all routes) look essentially unchanged to a visitor, but the background nebula is now rendered by the shared R3F `<Stage>` (not the standalone `BgNebula`), with one `<EffectComposer>` skin and a scroll/cursor signal ready for phases B–D. `npm run smoke` green; no Lighthouse regression; `BgNebula.tsx` retired.

## 8. Validation results (2026-06-16) + LOCKED architecture (supersedes §3/§5 where they differ)

Per the LLM-council "validate first" gate, a throwaway full-chain prototype (`/r3f-validate`) exercised the whole risky chain on a real desktop GPU + a real phone before touching the working site. Findings:

- **Desktop: validated, excellent.** Nebula bg + hero `<View>` + 8 lazy per-card signature `<View>`s + Bloom ran at **108-120 FPS**, clean, no flicker, after two fixes below. Desktop gets the FULL experience.
- **A fullscreen nebula mesh in the SAME canvas as the `<View>`s flickers + bleeds** (scissor fight). FIX: the nebula lives on its **own dedicated bg canvas**; a **second transparent canvas hosts ONLY the `<View>`s + Bloom** (the Concept-3 pattern). Two contexts on desktop is fine.
- **Per-view `<Environment>` (one per card) tanks FPS.** FIX: NO per-view environment; lights only. Glass cards need a richer material without an env (clearcoat/iridescent physical material, or ONE shared low-cost env reserved for a few hero cards), since `MeshTransmissionMaterial` needs an env AND renders opaque under headless GL.
- **Views must lazy-mount** (IntersectionObserver, `rootMargin ~300px`): only cards near the viewport render 3D. Required for scaling (the owner keeps adding projects).
- **Mobile: the per-card drei-`<View>` is fragile.** Two WebGL canvases → mobile Safari throttles/suspends the bg context (nebula freezes until a touch); and `<View>` scissor-tracking lags Lenis smooth-scroll so objects spill outside their card frames on scroll.

### LOCKED decision: responsive `quality` split (the Expansionist's `quality` prop, baked in from the start)
- **Desktop (full WOW):** nebula bg canvas + transparent View canvas (hero View + lazy per-card signature Views) + Bloom. Validated.
- **Mobile (lite):** detect coarse-pointer / small viewport. Serve a LIGHT variant: a single light/static nebula layer (or a cheap animated one, ONE context) and **static / CSS / image** project signatures instead of per-card `<View>`s (no heavy View stack, no two-context throttle, no scroll-spill). The hero may be a simpler single object or static.
- The `<Stage>` (and the future per-card signature component) take a `quality: "full" | "lite"` derived from device, decided once at mount. This is also the re-skin/`quality` hook for future client demos.

### Revised Phase A (supersedes §5 where it conflicts)
- The nebula is its OWN bg canvas/layer (NOT a fullscreen mesh inside the View canvas). The `<Stage>` View canvas is transparent and hosts `<View.Port/>` + Bloom (empty of views in Phase A).
- Add the `quality` (device) gate from the start: on `lite`, the nebula bg is the cheap path and no View canvas mounts.
- Build behind a git branch + (optionally) a feature flag, so the working 98-Lighthouse site stays intact as a fallback (council's protection point).

### Validated build pattern (for B/C)
Per-card signature = the proven Concept-3 DOM-placed `<View track={selfRef}>` + lazy-mount + lights-only material, on the transparent View canvas, **desktop only**; mobile shows a static signature.
