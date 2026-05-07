# Font License Audit

> ⚠️ **MIND A 8 BETŰTÍPUS LICENSZ-PROBLÉMÁS** self-hosted webfont-ként egy nyilvános domainen. A jelenlegi setup működik dev-ben és helyi build-ben, de **éles deploy ELŐTT** cseréld le őket.

## Kockázati kategóriák

### 🔴 CRITICAL — Microsoft proprietary (NEM redistributable)

| Font | Forrás | Probléma |
|---|---|---|
| `MSPGothic-Regular.otf` | Microsoft (Windows-bundled) | Csak Windows OS részeként licencelt. Webfont embed = EULA megsértés. |
| `MSPGothic-Book.otf` | Microsoft | Ugyanaz. |
| `MSPGothic-Black.otf` | Microsoft | Ugyanaz. |

### 🔴 CRITICAL — Commercial foundry, paid webfont license required

| Font | Foundry | Webfont licenc |
|---|---|---|
| `PPFraktionMono-Regular.ttf` | Pangram Pangram Foundry | ~$200/site, vagy desktop license $50+ |
| `Sequel100Wide-65.ttf` | Fontfabric | ~$50–250 webfont license |
| `MonoSpec-Regular.otf` | Studio Triple (valószínűleg) | ~€90 desktop / külön webfont license |
| `ShoraiSans-Medium.ttf` | Adobe Fonts (Morisawa) | **Csak Adobe CC előfizetés** + Adobe Fonts CDN. Self-host TILOS. |

### 🟠 HIGH — Game IP (Bungie / Marathon)

| Font | Forrás | Probléma |
|---|---|---|
| `Goliath.otf` | Bungie / Marathon (community-extracted) | Bungie szellemi tulajdon. Fan-extracted, nem licencelt. |
| `KHInterference-Light.ttf` | Marathon community | Nem hivatalos terjesztés. |
| `KHInterference-Regular.ttf` | Marathon community | Ugyanaz. |
| `KHGroteskAlpha-CompressedLight.ttf` | Marathon community | Ugyanaz. |
| `KHGroteskAlpha-CompressedRegular.ttf` | Marathon community | Ugyanaz. |

## Ingyenes csere-javaslatok (matching look)

| Eredeti | Ingyenes alternatíva | Hol szerezd |
|---|---|---|
| Goliath (heavy display) | **Bricolage Grotesque 800** | Google Fonts |
| Goliath (alt) | **Anton** | Google Fonts |
| KH Interference (terminal mono) | **Geist Mono** | Google Fonts / Vercel |
| KH Interference (alt) | **JetBrains Mono** | Google Fonts |
| KH Grotesk Compressed | **Bricolage Grotesque** (Condensed weight) | Google Fonts |
| MS PGothic | **Noto Sans JP** | Google Fonts |
| MonoSpec | **IBM Plex Mono** | Google Fonts / IBM |
| PP Fraktion Mono | **Space Mono** | Google Fonts |
| Sequel 100 Wide | **Bricolage Grotesque** (Wide weight) | Google Fonts |
| Shorai Sans (body lead) | **Onest** vagy **Inter** | Google Fonts |

## Csere recept (5 perc)

1. Töröld a `public/fonts/` mappa tartalmát:
   ```bash
   rm public/fonts/*
   ```

2. Frissítsd `src/lib/fonts.ts`-t — cseréld a `localFont` hívásokat `next/font/google`-re:
   ```ts
   import { Bricolage_Grotesque, Geist_Mono, Space_Mono, IBM_Plex_Mono, Noto_Sans_JP, Onest } from "next/font/google";

   export const goliath = Bricolage_Grotesque({ subsets: ["latin"], weight: "800", variable: "--font-goliath", display: "swap" });
   export const khInterference = Geist_Mono({ subsets: ["latin"], variable: "--font-khinterference", display: "swap" });
   export const khGrotesk = Bricolage_Grotesque({ subsets: ["latin"], weight: ["300","700"], variable: "--font-khgrotesk", display: "swap" });
   export const msPGothic = Noto_Sans_JP({ subsets: ["latin"], weight: ["400","500","900"], variable: "--font-msgothic", display: "swap" });
   export const monoSpec = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-monospec", display: "swap" });
   export const fraktion = Space_Mono({ subsets: ["latin"], weight: "400", variable: "--font-fraktion", display: "swap" });
   export const sequel = Bricolage_Grotesque({ subsets: ["latin"], weight: "700", variable: "--font-sequel", display: "swap" });
   export const shorai = Onest({ subsets: ["latin"], weight: "500", variable: "--font-shorai", display: "swap" });
   ```

3. `npm run build` — ellenőrizd, hogy a layout nem omlik szét. A `font-goliath` súlyok és tracking lehet hogy fine-tuningot kérnek.

## Ha mégis a Marathon esztétikát akarod megtartani

- **Vásárolj webfont licenszet** a 4 commercial fontra: PP Fraktion Mono ($), Sequel 100 Wide ($), Shorai Sans (Adobe CC), MonoSpec (€).
- **Cseréld le** az MS PGothic-ot Noto Sans JP-re (Google) — ez 100% ingyenes és vizuálisan közel azonos.
- **Maradj távol** a Goliath/KH Interference/KH Grotesk fanyloboltól ha a kliens jogi auditra megy. Cseréld Bricolage Grotesque + Geist Mono párosra.

A Marathon-stílus 80%-a a tokenekben (lime, void, crosshair, sharp 0px radius), nem a betűtípusokban — a látvány attól még működik.
