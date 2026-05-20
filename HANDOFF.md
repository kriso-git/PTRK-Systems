# PTRK Systems — Session Handoff

## Projekt
Next.js 15 + Tailwind v4 portfólió oldal  
Repo: `kriso-git/PTRK-Systems`  
Deploy: Vercel (auto deploy main branchről)  
URL: `ptrksystems.com`  
Lokális: `e:\Website Biz\ptrk-systems\`

---

## Ebben a sessionben elvégzett munkák

### 1. Font csere (jogilag tiszta stack)
Eltávolítva: Bungie/Marathon IP és kereskedelmi fontok.  
Helyettesítve Google Fonts (OFL) alapúakra:

| Régi | Új | CSS var |
|---|---|---|
| KH Interference | Chakra Petch 600 (SemiBold) | `--font-khinterference` |
| MonoSpec | Geist Mono | `--font-monospec` |
| PP Fraktion Mono | DM Mono | `--font-fraktion` |
| Sequel 100 Wide | Roboto Flex (wdth+wght axes) | `--font-sequel` |
| Goliath | SVG szimbólum szett (`<GoliathOrnament>`) | nincs font, saját SVG |

Változatlan (már korábban lecserélt):
- `shorai` → Onest (`--font-shorai`)
- `msPGothic` → Manrope (`--font-msgothic`)
- `khGrotesk` → törölve (soha nem volt használva)

**Élő font stack**: `src/lib/fonts.ts` — csak `next/font/google` import, `next/font/local` NINCS.  
**CSS override-ok**: `src/app/globals.css` — `.font-khinterference { font-weight: 600; }` és `.font-sequel { font-weight: 900; font-stretch: 151%; }`

### 2. GoliathOrnament SVG szimbólumszett
Fájl: `src/components/GoliathSymbols.tsx`  
28 glyph, Marathon paletta (lime/cyan/magenta/orange).  
FNV-1a hash alapú determinisztikus SSR/CSR-stabil seed.

Watermark helyek (ahol a régi `font-goliath` volt):
- `src/app/page.tsx` — 3 helyen (`·26·`, `2026`, `SYS·`)
- `src/components/ConnectForm.tsx` — 1 hely (`HELLO`)
- `src/app/method/page.tsx` — 1 hely (`METHOD`, cyan tónus)

### 3. Font Preview archív oldal
Route: `/font-preview` (noindex/nofollow, csak URL-en elérhető)  
- `src/app/font-preview/layout.tsx` — betölti az archív local fontokat (`--font-pv-archive-*`) + 27 Google Font preview-ra
- `src/app/font-preview/page.tsx` — összehasonlító grid, ARCHIVED chip, GoliathShowcase

### 4. Kurzor trail fix
Fájl: `src/components/CustomCursor.tsx`  
**Probléma**: `destination-out` 0.88 fade → állandó zöld csík maradt a kurzor után  
**Megoldás**: `clearRect` minden frame-ben → csak az élő N-pontos trail buffer látszik, nincs maradandó nyom

### 5. FHD monitor layout fix
**Probléma**: `RightDataStream` (fixed, right-0, 230px + 8px margin = 246px) alá csúszott a tartalom FHD-n  
**Megoldás**:
- `<main className="md:pr-[260px]">` — jobb oldali 260px rezerváció a terminálnak
- `<footer className="md:pl-10 md:pr-[260px]">` — ugyanez a footernél
- `max-w-[1700px]` → `max-w-[1500px]` minden élő szekcióban — FHD-n `mx-auto` aktiválódhat a szűkebb content boxban

### 6. Egyéb korábbi változások (session elején)
- Custom cursor: összefüggő trail vonal (nem pontok), tiny 2px dot + 18px aura
- Code rain canvas (faint, `requestAnimationFrame`)
- WarpMesh: quadratic bezier görbülés a kurzor alatt
- Mobile: Lissajous auto-pan coarse pointer detektálással
- RightDataStream: teljes magasság, fade-out felső sorokon, per-line opacity
- Navigation: fixed 2-row bar, 4 grid-cols tab gomb (hamburger helyett)
- Connect overlap: SLA grid `grid-cols-1 sm:grid-cols-3`
- Footer: GitHub link eltávolítva

---

## Aktuális git állapot (legutóbbi commitok)

```
e30b28f fix(layout): reduce section max-width 1700→1500 for FHD centering
686d797 fix(layout): reserve 260px right gutter for terminal aside (FHD overlap)
4c40f02 fix(cursor): clear trail canvas each frame so cursor leaves no residue
f42080f Live-site font swap — full Google Fonts stack + SVG ornaments + archived preview
```

---

## Függőben lévő döntések

### Font-preview archív jogi helyzete
A `/font-preview` route **még tartalmazza** az eredeti Marathon IP és kereskedelmi fontokat:
- `src/app/font-preview/layout.tsx` → `localFont()` tölti őket (csak ezen az URL-en)
- `public/fonts/` mappa tartalmazza a .ttf/.otf fájlokat (Vercel publikusan kiszolgálja)

**Opciók**:
1. Töröljük a teljes `/font-preview` route-ot + `public/fonts/*` IP-s fájlokat → teljes jogi nullázás
2. Megtartjuk az archívot → kis kockázat, de vizuális referencia megmarad

---

## Kritikus fájlok

| Fájl | Tartalom |
|---|---|
| `src/lib/fonts.ts` | Élő font stack (csak Google Fonts) |
| `src/app/globals.css` | @theme tokenek, font weight override-ok |
| `src/app/layout.tsx` | Root layout, fontVars injection, main pr-260 |
| `src/components/CustomCursor.tsx` | Kurzor trail canvas |
| `src/components/GoliathSymbols.tsx` | SVG ornament szimbólumszett |
| `src/components/MarathonBackground.tsx` | CodeRain, WarpMesh, RightDataStream |
| `src/app/font-preview/layout.tsx` | Archív preview fontok (localFont) |
| `FONTS-LICENSE.md` | Audit doc (frissíteni szükséges a swap után) |

---

## Tech stack gyorsnézet

- **Framework**: Next.js 15, App Router, Turbopack
- **Styling**: Tailwind v4 (`@theme` blokk CSS változókkal)
- **Fonts**: 6 Google Font (`next/font/google`), nincs local font az élő site-on
- **Animáció**: Canvas `requestAnimationFrame`, nincs framer-motion
- **Palette**: lime `#c2fe0c`, cyan `#01ffff`, magenta `#ea027e`, orange `#ff8c42`, void `#050508`
- **Breakpoints**: md=768 (terminal megjelenik), max-w-1500 szekciók, pr-260 main
- **Deploy**: Vercel auto (GitHub main push → deploy)

---

## Folytatáshoz hasznos promptok

```
Tekintsd meg a src/lib/fonts.ts fájlt és ellenőrizd hogy nincs-e már next/font/local import az élő site-on.

Ellenőrizd a FONTS-LICENSE.md-t és frissítsd a font swap státuszokat DONE-ra.

Töröld a public/fonts/ mappából a jogilag problémás fájlokat és a /font-preview route-ot.

A RightDataStream terminál 230px + 8px margin (246px összesen), fixed right-0. A main md:pr-[260px]-t tart neki. Ha bármi layout bugot látsz terminál ütközéssel, ezt nézd meg először.

A GoliathOrnament komponens a src/components/GoliathSymbols.tsx-ben van. Seed prop alapján determinisztikusan generálja a glypheket.
```
