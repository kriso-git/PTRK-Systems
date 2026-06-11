# Sprint 4: Signature-réteg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Blueprint Mode, Operátor Terminál, ASCII-mező, NODES lore-réteg, gyro-lencse + mobil terminál-dock, szintetizált hangréteg — a "senki más nem csinálja" szint.

**Spec:** `docs/superpowers/specs/2026-06-11-sprint4-signature-design.md`

---

### Task 1: NODES core
**Files:** Create: `src/lib/nodes.ts`, `src/components/NodeToast.tsx` (client, Konami-listener is itt), `src/components/NodesCounter.tsx` (client, Footer-be), `src/components/NodeTrigger.tsx` + `src/components/AcquireOnMount.tsx` (pici client triggerek) · Modify: `Footer.tsx`, `layout.tsx` (NodeToast mount), `ManifestoBand.tsx` (NOD·0A20070A → NodeTrigger), `not-found.tsx` (`AcquireOnMount id="signal-lost"`), `font-preview/page.tsx` (`AcquireOnMount id="font-preview"`)
- [ ] `nodes.ts`: NODES registry (7 id+label), `getAcquired(): string[]` (try/catch localStorage), `acquireNode(id)` → set + `window.dispatchEvent(new CustomEvent("ptrk:node", {detail}))` (csak ha új).
- [ ] NodeToast: event-listener → magenta HUD-toast 3s (`▓ NODE ACQUIRED · <label> · n/7`); Konami-sorozat figyelése (`↑↑↓↓←→←→BA`) → `acquireNode("konami")`.
- [ ] Commit.

### Task 2: HudSystem — SystemTray + OperatorTerminal + BlueprintMode + SND
**Files:** Create: `src/components/HudSystem.tsx` (parent: tray + state + billentyűk), `src/components/OperatorTerminal.tsx`, `src/lib/sfx.ts` · Modify: `layout.tsx` (HudSystem mount), `globals.css` (blueprint CSS-blokk)
- [ ] HudSystem: `mounted` gate; keydown `` ` ``/`~` → terminál, `b/B` → blueprint (SKIP ha `e.target` input/textarea/select v. isContentEditable); blueprint state → `document.documentElement.toggleAttribute("data-blueprint")` + első ON-nál `acquireNode("blueprint")`; SND state localStorage `ptrk-snd` + `sfx.setEnabled`; tray: fixed bottom-left z-40 `hidden md:flex` 3 chip (aria-pressed).
- [ ] OperatorTerminal: bottom-sheet (fixed bottom, max-h-[60vh], lime-on-void, monospec, role="dialog"); history state; parancsok a spec szerint (`useRouter` navigációhoz, ENGAGEMENT a `status`-hoz, TECH_STACK a `stack`-hez, `whoami` → lore + `acquireNode("whoami")`, `nodes` → progress lista, `escape` → "ESCAPE WILL MAKE ME ████", `boot` → sessionStorage törlés + reload, `sudo hire` → ack + push /connect); Esc zár, input autofocus.
- [ ] Blueprint CSS (globals.css): `html[data-blueprint] section { outline: 1px dashed rgba(1,255,255,0.4); }` + `section[data-section]::before { content: attr(data-section) " · " attr(data-label); … }` csak blueprint alatt; `html[data-blueprint] canvas { opacity: 0.15; }`; grid-overlay + token-legend a HudSystem-ben renderelve (12 oszlop cyan/10 + fix panel: 4 szín-swatch hex-szel, font-nevek, "radius 0px").
- [ ] sfx.ts: lazy AudioContext; `tick()` square 1200Hz 6ms gain 0.04; `blip()` sine sweep 300→900Hz 70ms gain 0.05; `setEnabled(bool)`; hover-delegáció (`pointerover` + closest('a,button'), 80ms throttle) + route-blip a HudSystem-ben (usePathname).
- [ ] Commit.

### Task 3: AsciiField hero
**Files:** Create: `src/components/AsciiField.tsx` (client) · Modify: `src/app/page.tsx` (hero section, `-z-10` absolute)
- [ ] Canvas: cell 14px, minden 2. cella (checker), char-készlet `"01<>/_\\|#▓░·"`; fényerő = idle sin-hullám + kurzor-proximitás (r=180px); lime fill `rgba(194,254,12,alpha)` alpha 0.04–0.3; 24fps cap (`now-last<41ms` skip), DPR=1, IO: csak ha a hero látszik, visibilitychange pause; reduced-motion: egyetlen statikus frame; coarse: csak hullám.
- [ ] Hero section: `<div aria-hidden className="absolute inset-0 -z-10 pointer-events-none"><AsciiField /></div>` (a §00 section `relative`; a tartalom static → a -z-10 alá kerül, ld. ghost-lecke).
- [ ] Commit.

### Task 4: Gyro + MobileTerminalDock
**Files:** Create: `src/lib/gyro.ts`, `src/components/GyroChip.tsx`, `src/components/MobileTerminalDock.tsx` · Modify: `src/components/MarathonBackground.tsx` (2 Lissajous-ág), `layout.tsx` (dock mount + mobil pb)
- [ ] gyro.ts: `export const gyroState = { active: false, x: 0.5, y: 0.5 };` + `enableGyro(): Promise<boolean>` — iOS `DeviceOrientationEvent.requestPermission?.()` tap-kontextusból; listener: `x = clamp((gamma+30)/60)`, `y = clamp((beta-15)/60)`.
- [ ] MarathonBackground:31-64 (glow-loop): `if (coarsePointer) { if (gyroState.active) { targetX=gyroState.x; targetY=gyroState.y; setCrisp(...); } else { …Lissajous… } }`; ugyanez a WarpMesh draw()-ban (281-285: `mx = w*gyroState.x` stb.).
- [ ] GyroChip: csak coarse + `"DeviceOrientationEvent" in window`; a dockban ül; tap → enableGyro → "GYRO·ON".
- [ ] MobileTerminalDock (`md:hidden`): zárt = 32px sáv `▶ TX·LIVE` + 1 gépelődő sor (COMMAND_POOL random, 45ms/char, 2.2s tartás); tap → sheet (max-h-[50vh], utolsó ~14 sor listája TAG_COLOR színekkel, 900ms-onként új sor); `pb-[env(safe-area-inset-bottom)]`; layout flex-wrapper `pb-9 md:pb-0`.
- [ ] Commit.

### Task 5: Gates + review + merge
- [ ] `npm run build` + `npm run smoke` PASS; headless funkcionális próba: terminál `projects`+`whoami` (node acquired?), `B` → `data-blueprint` attr + screenshot, dock jelenlét 390px viewporton, AsciiField canvas jelenlét; vizuális screenshotok.
- [ ] Code-review agent → Critical/Important fixek → merge main + push + Obsidian tükör.
