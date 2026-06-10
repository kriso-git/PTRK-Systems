# PTRK Systems — Sprint 3: Konverzió-réteg (Design Spec)

**Dátum:** 2026-06-10 · **Branch:** `feat/sprint3-conversion` · **Jóváhagyva:** user (chat, 3 döntéssel)

## User-döntések

1. **Operator szekció:** skeleton most, data-vezérelt — amíg nincs valódi név/bio kitöltve, NEM renderelődik (zéró kamu placeholder élesben).
2. **Kanonikus számok:** 2–8 hetes sprint + 14–30 nap launch; egyetlen forrásból (`ENGAGEMENT`).
3. **Testimonial:** rejtett struktúra — `testimonial` mező + "INCOMING TRANSMISSION" szekció, csak valódi idézet megléte esetén renderel.

## Tartalom-szabály (nem alku tárgya)

A case study aloldalakon **kizárólag verifikálható tény** szerepelhet: stack, leszállított feature-lista, élő URL, scope-leírás. Semmi kitalált metrika, semmi nem-mérhető állítás. (A teljes audit fő kritikája a bizonyíték nélküli claimek voltak.)

## Scope

| # | Tétel | Fájlok |
|---|---|---|
| 1 | **ENGAGEMENT single source**: sprint/launch/válaszidő/slot/budget egy helyről; ConnectForm SLA "2–4w"→"2–8w" fix + landing/colophon bekötés | projects.ts, ConnectForm.tsx, page.tsx |
| 2 | **caseStudy adat** a 3 projekthez (briefing / execution[] / debrief[] / artifacts) — valós tények a tényleges projektekből | projects.ts |
| 3 | **`/work/[slug]` Mission Debrief route**: generateStaticParams + generateMetadata, accent-takeover, szekciók: BRIEFING → EXECUTION → DEBRIEF → ARTIFACTS (BrowserPreview külső linkkel) → CTA | új work/[slug]/page.tsx |
| 4 | **Archive átkötés**: a /work kártyák a slug-oldalra linkelnek (belső), a külső VISIT a debrief-oldalra költözik | work/page.tsx |
| 5 | **/lab — EXPERIMENTS ARCHIVE**: a megépített craft-komponensek kiállítva (DECODE replay, GOLIATH set, BOOT_SEQ replay, CURSOR/AMBIENT leírás, REVEAL demo); Footer-navból + colophonból linkelve, a 4-tab fő-nav NEM bővül | új lab/page.tsx (+ kis client demók), Footer.tsx |
| 6 | **TransmissionLog** (testimonial szekció, landing §04 után) — üres adatnál null | új TransmissionLog.tsx, page.tsx |
| 7 | **Operator szekció skeleton** — `src/data/operator.ts` (name üres → null render), HUD-keretes layout készen | új Operator.tsx + data/operator.ts, page.tsx |
| 8 | **Sitemap + smoke bővítés**: /lab + 3 slug route a sitemap-be; smoke ROUTES += /lab, /work/f3xykee-terminal | sitemap.ts, scripts/smoke.mjs |

## Verifikáció

`npm run build` PASS + `npm run smoke` PASS (7 route) + computed-style/vizuális ellenőrzés az új oldalakra + code-review agent + merge.
