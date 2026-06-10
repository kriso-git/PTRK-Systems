# Sprint 3: Konverzió-réteg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Case study aloldalak (verifikálható tényekkel), /lab kísérlet-galéria, rejtett testimonial + Operator struktúrák, szám-konzisztencia egy forrásból.

**Architecture:** Minden tartalom a `src/data/projects.ts`-ből (caseStudy mező) ill. `src/data/operator.ts`-ből vezérelt; a route-ok server componentek; a /lab interaktív demói kis client wrapperek a meglévő komponensek körül. Spec: `docs/superpowers/specs/2026-06-10-sprint3-conversion-design.md`.

---

### Task 1: ENGAGEMENT single source + szám-fix

**Files:** Modify: `src/data/projects.ts`, `src/components/ConnectForm.tsx` (SLA "2–4w" → ENGAGEMENT.sprintRange), `src/app/page.tsx` (STATS "14–30d" + §02 meter + colophon "Q3 · 2026" bekötés ahol egyszerű)

- [ ] `export const ENGAGEMENT = { sprintRange: "2–8w", launchRange: "14–30d", responseTime: "<24h", nextSlot: "Q3 · 2026", budgetRange: "5–50k EUR" } as const;`
- [ ] ConnectForm SLA tömb: `value: ENGAGEMENT.sprintRange` (a hibás "2–4w" megszűnik); page.tsx STATS/meter `14–30d` → `ENGAGEMENT.launchRange`.
- [ ] Commit.

### Task 2: caseStudy adat (CSAK verifikálható tény)

**Files:** Modify: `src/data/projects.ts`

- [ ] Típus: `caseStudy: { lead: string; briefing: string[]; execution: { title: string; body: string }[]; debrief: string[]; artifacts: string[] }` (kötelező mező mindhárom projekten — a slug-oldal generateStaticParams enélkül nem él).
- [ ] Tartalom-források (valós): F3XYKEE = Next.js 16 + Supabase (auth+RLS), poszting motor, operátor-profilok, jelzéslánc, superadmin, custom domain. MOLEKULAX = Vite+React, 4 tudásbázis-könyvtár, NCBI/PubMed-verifikációs saját tooling, HU/EN/PL i18n, 53 feldolgozott vial-fotó, Puppeteer render-smoke + CI kapuk. DONNA = Vite 5 + React + Tailwind 3, menü, foglalás-flow, Foodora, Google reviews, térkép+kontakt.
- [ ] Commit (Task 3-mal együtt mehet).

### Task 3: /work/[slug] Mission Debrief route

**Files:** Create: `src/app/work/[slug]/page.tsx`

- [ ] `generateStaticParams` a PROJECTS-ből; `generateMetadata` per projekt (title: `${name} — Mission Debrief`, description: caseStudy.lead, canonical `/work/${id}`).
- [ ] Layout (accent = p.color mindenhol): hero (MISSION DEBRIEF badge + óriás projektnév DecodeText-tel + year/client/role/stack meta-sor) → BRIEFING (§ D.01, lead + briefing bekezdések) → EXECUTION (§ D.02, cím+body blokkok data-reveal-lel) → DEBRIEF (§ D.03, tény-lista accent-markerekkel) → ARTIFACTS (§ D.04, BrowserPreview `asLink={true}` külső linkkel + stack-csempék) → CTA (→ CONNECT + vissza az archívumba).
- [ ] Ismeretlen slug → `notFound()`.
- [ ] Commit.

### Task 4: Archive átkötés

**Files:** Modify: `src/app/work/page.tsx`

- [ ] A kártya-wrapper `<a href={p.url} external>` → `<Link href={\`/work/${p.id}\`}>`; a `p.url` szöveg-sor felirata "→ MISSION DEBRIEF" jellegre vált (a külső link a debrief-oldalon él tovább). BrowserPreview `asLink` marad false (nested-anchor szabály).
- [ ] Commit.

### Task 5: /lab — EXPERIMENTS ARCHIVE

**Files:** Create: `src/app/lab/page.tsx` (server) + `src/components/LabDemos.tsx` (client: DecodeReplay, BootReplay gombok) · Modify: `src/components/Footer.tsx` (nav-link), `src/app/page.tsx` (colophon link), `src/app/sitemap.ts`

- [ ] Kártyák (EXP_001..005): DECODE (kattintásra újra-dekódol — DecodeText `key` remount), GOLIATH SET (összes szimbólum GoliathOrnament-tel), BOOT_SEQ (gomb: sessionStorage flag törlés + location.reload), AMBIENT/CURSOR (leírás — site-szerte élő), REVEAL (data-reveal demo-elemek). Mindegyik: monospec EXP-kód + 1 mondat technika-leírás + "0 dependency / CSS-only / rAF" címke.
- [ ] Metadata + canonical `/lab`; sitemap += `/lab` és a 3 slug.
- [ ] Commit.

### Task 6: TransmissionLog (rejtett testimonial)

**Files:** Create: `src/components/TransmissionLog.tsx` · Modify: `src/data/projects.ts` (`testimonial?: { quote, name, role }`), `src/app/page.tsx` (§04 index után)

- [ ] `const items = PROJECTS.filter(p => p.testimonial)` — üresnél `return null`. Terminál-stílusú idézetblokk: "▓ INCOMING TRANSMISSION · {client}" fejléc, idézet font-shorai, accent border-l, név+szerep monospec.
- [ ] Commit.

### Task 7: Operator skeleton (rejtett)

**Files:** Create: `src/data/operator.ts` (`OPERATOR = { name: "", role: "", bio: [], photo: null, now: "" }`), `src/components/Operator.tsx` · Modify: `src/app/page.tsx` (§04 után / TransmissionLog mellett)

- [ ] `if (!OPERATOR.name) return null;` — HUD-keretes layout (crosshair sarkok, OPERATOR·ID fejléc, scanline-overlay a fotón, NOW status-sor) készen áll, kitöltéskor azonnal él.
- [ ] A fájl tetején komment: pontosan mit kell kitölteni.
- [ ] Commit.

### Task 8: Gates + review + merge

- [ ] smoke ROUTES += `/lab`, `/work/f3xykee-terminal`; `npm run build` + `npm run smoke` PASS.
- [ ] Vizuális ellenőrzés: 1 slug-oldal + /lab screenshot.
- [ ] Code-review agent a diffen → Critical/Important fixek → merge main + push + Obsidian tükör.
