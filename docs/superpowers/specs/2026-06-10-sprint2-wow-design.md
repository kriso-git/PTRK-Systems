# PTRK Systems — Sprint 2: Wow-réteg (Design Spec)

**Dátum:** 2026-06-10 · **Branch:** `feat/sprint2-wow` · **Jóváhagyva:** user (chat, 4 ízlés-döntéssel)

## User-döntések (2026-06-10)

1. **Kiáltvány copy:** „STRATÉGIÁTÓL LIVE DEPLOYIG." + alsó sor „EGY KÉZBEN." → CONNECT gomb
2. **Elhelyezés:** csak a landingen (a §03 Alapkövek után — a vertikális-egység érvelés lezárása)
3. **Per-route accentek:** teljes verzió — `/` lime, `/work` magenta, `/method` cyan, `/connect` orange (header-identitás + nav-aktív állapot). **Szabály:** a lime globálisan az AKCIÓ-szín marad (CTA-k nem színeződnek át).
4. **BOOT_SEQ:** session-önként egyszer (`sessionStorage`), bármely input skippeli, reduced-motion = teljes skip.

## Scope — 7 feature + 1 enabler

| # | Tétel | Fájlok |
|---|---|---|
| 0 | **Smoke script** (enabler, review-ajánlás): Puppeteer console-error check 5 route-ra, `npm run smoke` | `scripts/smoke.mjs`, package.json |
| 1 | **Ghost-tipográfia**: `.text-ghost` utility (stroke=currentColor) + óriás háttér-szavak (§02 ACCESS, §05 PROCESS) + Footer-finálé túlméretes outline „PTRK SYSTEMS" wordmark alul kifutva | globals.css, page.tsx, Footer.tsx |
| 2 | **ManifestoBand**: full-bleed lime sáv fekete display-szöveggel, inverz crosshair, fekete keretes → CONNECT | új ManifestoBand.tsx, page.tsx (§03 után) |
| 3 | **DecodeText**: hex-scramble címsor-animáció (SSR = kész szöveg, mount után ~700ms egyszeri rAF, settle után leáll) — landing hero 2 sora + 3 route-hero fő szavai | új DecodeText.tsx, page.tsx, work/method/connect |
| 4 | **Scroll-reveal**: 1 megosztott IntersectionObserver `[data-reveal]`-re; CSS clip-path wipe csak `prefers-reduced-motion: no-preference` ÉS `html[data-js]` alatt (no-JS = minden látható); stagger inline transitionDelay-jel | új RevealObserver.tsx, globals.css, layout.tsx (+inline data-js script), landing/method/work attribútumok |
| 5 | **RouteTransition**: pathname-váltáskor 380ms lime scanline-sweep overlay (compositor-only), első mountnál nem fut | új RouteTransition.tsx, layout.tsx, globals.css |
| 6 | **BootSequence**: session-önként egyszer, 4 sor gépelődő boot-log (~1,3s) + scanline wipe-out; mounted-state-gate (SSR semmit nem renderel → nincs hydration-mismatch, LCP védve) | új BootSequence.tsx, layout.tsx |
| 7 | **Per-route accentek**: Navigation aktív állapot route-accent szerint (desktop+mobil, statikus class-map), /work hero → magenta, /connect hero → orange (a /method már cyan) | Navigation.tsx, work/page.tsx, connect ConnectForm.tsx hero |

## Vezérelvek

- **Mindenhol:** `prefers-reduced-motion: reduce` → animáció skip, statikus végállapot; SSR/no-JS mindig a kész tartalmat adja (SEO + progressive enhancement).
- **Perf:** csak compositor-barát propok (transform/opacity/clip-path); a DecodeText/BootSequence rAF-jai settle után megszűnnek; 0 új runtime dependency (Puppeteer devDep).
- **Design DNS:** 0px radius, monospec címkék, crosshair-nyelv, em-dash editorial — minden új elem a meglévő nyelvet erősíti.

## Verifikáció

`npm run build` PASS + `npm run smoke` 0 console-error (5 route) + vizuális ellenőrzés dev-szerveren + code-review agent a teljes diffen.
