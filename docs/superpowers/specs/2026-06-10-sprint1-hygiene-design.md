# PTRK Systems — Sprint 1: Higiénia quick-wins (Design Spec)

**Dátum:** 2026-06-10 · **Branch:** `feat/sprint1-hygiene` · **Jóváhagyva:** user (2026-06-10, chat)

## Háttér

6 szempontú audit (design / motion / konverzió / trendek / tech / mobil, 61 ötlet) alapján a user jóváhagyta az A–D fejlesztési csomagokat és a javasolt sorrendet:
1. **Sprint 1 — Higiénia** (ez a spec)
2. Sprint 2 — Wow-réteg (BOOT_SEQ, DecodeText, scroll-reveal, route-transition, ghost-tipó, lime kiáltvány-sáv, per-route accentek)
3. Sprint 3 — Konverzió (case study aloldalak, Operator szekció, social proof, /lab)

## Scope — Sprint 1

| # | Tétel | Indok |
|---|---|---|
| 1 | Élő URL-ek bekötése: MolekulaX → `https://molekulax.vercel.app`, Donna → `https://www.donnapizzakecskemet.eu` | A /work "SOON" badge-ek automatikusan LIVE-ra váltanak (`p.url` jelenlétből derivált) |
| 2 | 8 halott fájl törlése: `LandingTab`, `PortfolioTab`, `ProcessTab`, `ContactTab`, `DataStream`, `FloatingIcon`, `Glyph`, `SysLog` | Egyetlen route sem importálja őket (grep-verifikált 2026-06-10); kettős karbantartás veszélye |
| 3 | 6 nem hivatkozott kereskedelmi fontfájl törlése (`MSPGothic-*` ×3, `ShoraiSans-Medium`, `KHGroteskAlpha-*` ×2, ~8.8 MB) | `fonts.ts` 100% Google Fonts; csak a font-preview által használt 6 fájl marad |
| 4 | Next bump `15.5.18` → `15.5.19` | 2 moderate npm audit (vendored postcss GHSA-qx2v-qp2m-jg93) lezárása; TILOS `npm audit fix --force` |
| 5 | Text-shadow shield scope-fix | A globális readability-shield a `bg-lime`/`bg-cyan`/`bg-magenta` gombok fekete szövegét is maszatolja |
| 6 | Sitemap `lastModified` eltávolítása | Most minden build minden oldalt frissnek hazudik |
| 7 | Security headerek (`next.config.ts`): HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors | "Production-grade vagy semmi" claim mellé linkelhető bizonyíték |
| 8 | JSON-LD: `ProfessionalService` + `WebSite` schema | SEO entitás-jelenlét |
| 9 | Vercel Analytics + Speed Insights | Most nulla mérés van (vakrepülés) |
| 10 | `not-found.tsx` — "SIGNAL LOST" 404 HUD-stílusban | A default fehér Next-404 kiesik a karakterből |
| 11 | OG + Twitter kép (`opengraph-image.tsx`, next/og) HUD-esztétikával + `twitter.card` metadata | Megosztásnál most csupasz link |

## Kifejezetten NEM scope (user döntés, 2026-06-10)

- **Placeholder kontakt-csatornák** (+36 70 000 0000, discord/slack) — site még nem éles, pre-launch TODO
- **mailto → Resend form-pipeline** — pre-launch TODO
- Minden Sprint 2/3 tétel

## Verifikáció

Nincs teszt-harness a repóban (scripts: dev/build/start) — a kapu: `npm run build` PASS (TS strict típusellenőrzéssel) + `npm audit` 0 moderate + a 4 route és a /404 manuális render-ellenőrzése dev szerveren + code-quality review agent a teljes diffen.

## Design-döntések

- **404 oldal:** server component, 0 extra JS. Óriás "SIGNAL LOST" (Chakra Petch / `font-khinterference`), magenta glitch-accent, SysLog-stílusú fake hibalog (statikus, monospec), 3 nagy visszavezető link (/, /work, /connect) a meglévő link-nyelven. A root layout (háttér, terminal-aside, nav) automatikusan körbeöleli.
- **OG kép:** 1200×630, `#050508` void háttér, lime "PTRK." wordmark + "SYSTEMS" fehérben, (+) crosshair sarokmarkerek, monospace alsó sor: "DESIGN ENGINEERING UNIT · BUDAPEST · 47.4979°N 19.0402°E". Chakra Petch 600 fetch-elve Google Fonts-ról build-time (try/catch — fetch-hiba esetén default font, a build nem törhet el). `twitter-image.tsx` ugyanazt exportálja, `layout.tsx`-be `twitter: { card: "summary_large_image" }`.
