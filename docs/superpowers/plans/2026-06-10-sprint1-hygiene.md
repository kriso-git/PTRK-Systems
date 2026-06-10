# Sprint 1: Higiénia Quick-Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A jóváhagyott Sprint 1 higiénia-csomag leszállítása: élő URL-ek, halott kód + árva fontok törlése, Next bump, shield-fix, security headerek, JSON-LD, analytics, SIGNAL LOST 404, OG-kép.

**Architecture:** Statikus Next.js 15 App Router site — minden változás vagy adat (`src/data/projects.ts`), vagy konfiguráció (`next.config.ts`), vagy önálló új fájl (`not-found.tsx`, `opengraph-image.tsx`, `JsonLd.tsx`). Nincs teszt-harness; a kapu a `npm run build` (TS strict) + dev-render-ellenőrzés + diff-review.

**Tech Stack:** Next.js 15.5.19 · React 19 · Tailwind v4 · next/og · @vercel/analytics + @vercel/speed-insights

**Spec:** `docs/superpowers/specs/2026-06-10-sprint1-hygiene-design.md`

---

### Task 1: Élő URL-ek bekötése

**Files:** Modify: `src/data/projects.ts:44,57`

- [ ] **Step 1:** A `molekulax` objektumban a `// url: live URL TBD — set this when deployed` kommentet cseréld erre: `url: "https://molekulax.vercel.app",`
- [ ] **Step 2:** A `donna-pizza` objektumban ugyanazt a kommentet cseréld erre: `url: "https://www.donnapizzakecskemet.eu",`
- [ ] **Step 3:** Commit: `git commit -m "feat(work): add live URLs for MolekulaX and Donna — SOON badges flip to LIVE"`

### Task 2: Halott komponensek törlése (8 fájl)

**Files:** Delete: `src/components/{LandingTab,PortfolioTab,ProcessTab,ContactTab,DataStream,FloatingIcon,Glyph,SysLog}.tsx`

Grep-verifikált (2026-06-10): egyik fájlt sem importálja route vagy élő komponens; csak egymást hivatkozzák.

- [ ] **Step 1:** `git rm src/components/LandingTab.tsx src/components/PortfolioTab.tsx src/components/ProcessTab.tsx src/components/ContactTab.tsx src/components/DataStream.tsx src/components/FloatingIcon.tsx src/components/Glyph.tsx src/components/SysLog.tsx`
- [ ] **Step 2:** Verifikáció: `npx tsc --noEmit` vagy `npm run build` — nem lehet unresolved import.
- [ ] **Step 3:** Commit: `git commit -m "chore: delete dead Tab components + exclusive deps (no route imports them)"`

### Task 3: Árva kereskedelmi fontok törlése (~8.8 MB)

**Files:** Delete: `public/fonts/{MSPGothic-Black,MSPGothic-Book,MSPGothic-Regular}.otf`, `public/fonts/ShoraiSans-Medium.ttf`, `public/fonts/{KHGroteskAlpha-CompressedLight,KHGroteskAlpha-CompressedRegular}.ttf`

Marad (font-preview hivatkozza): `Goliath.otf`, `KHInterference-Light.ttf`, `KHInterference-Regular.ttf`, `MonoSpec-Regular.otf`, `PPFraktionMono-Regular.ttf`, `Sequel100Wide-65.ttf`.

- [ ] **Step 1:** `git rm` a 6 fájlra.
- [ ] **Step 2:** Verifikáció: `npm run build` PASS és a `/font-preview` route továbbra is buildel.
- [ ] **Step 3:** Commit: `git commit -m "chore(fonts): remove 8.8 MB unreferenced commercial fonts from public/"`

### Task 4: Next bump 15.5.18 → 15.5.19 (postcss vuln)

**Files:** Modify: `package.json`, `package-lock.json`

- [ ] **Step 1:** `npm install next@15.5.19`
- [ ] **Step 2:** `npm audit` — elvárás: 0 moderate (a GHSA-qx2v-qp2m-jg93 vendored postcss lezárva). Ha nem nulla, dokumentáld és NE futtass `npm audit fix --force`-ot.
- [ ] **Step 3:** `npm run build` PASS.
- [ ] **Step 4:** Commit: `git commit -m "chore(deps): bump next to 15.5.19 (vendored postcss advisory)"`

### Task 5: Text-shadow shield scope-fix

**Files:** Modify: `src/app/globals.css` (a shield-blokk után, ~71. sor)

- [ ] **Step 1:** Illeszd be a shield-szabály UTÁN:

```css
/* Solid accent surfaces (lime CTAs etc.) render dark text on a light
   background — the dark halo shield would smear them. Kill it there. */
.bg-lime, .bg-lime *,
.bg-cyan, .bg-cyan *,
.bg-magenta, .bg-magenta *,
.bg-orange, .bg-orange * {
  text-shadow: none;
}
```

- [ ] **Step 2:** Megjegyzés (review-korrekció): a production route-okon jelenleg NINCS szöveges solid-accent felület (a "VIEW PROJECTS" gomb a halott LandingTab-ban élt) — a szabály a /font-preview PICK badge-eken ellenőrizhető, élesben pedig a Sprint 2 lime kiáltvány-sáv lesz az első fogyasztója.
- [ ] **Step 3:** Commit: `git commit -m "fix(css): exempt solid accent surfaces from the text-shadow readability shield"`

### Task 6: Sitemap lastModified eltávolítása

**Files:** Modify: `src/app/sitemap.ts`

- [ ] **Step 1:** Teljes új tartalom:

```ts
import type { MetadataRoute } from "next";

const BASE = "https://ptrksystems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/method`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/connect`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
```

- [ ] **Step 2:** Commit (összevonható Task 7-tel).

### Task 7: Security headerek

**Files:** Modify: `next.config.ts` — teljes új tartalom:

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
```

- [ ] **Step 1:** Írd a fenti tartalmat.
- [ ] **Step 2:** `npm run build` PASS.
- [ ] **Step 3:** Commit: `git commit -m "feat(infra): security headers + drop dishonest sitemap lastModified"`

### Task 8: JSON-LD strukturált adat

**Files:** Create: `src/components/JsonLd.tsx` · Modify: `src/app/layout.tsx` (mount a `<body>` elejére)

- [ ] **Step 1:** `src/components/JsonLd.tsx`:

```tsx
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://ptrksystems.com/#org",
      name: "PTRK Systems",
      description:
        "Design engineering unit Budapesten. Termék-felületek, design rendszerek és frontend architektúra.",
      url: "https://ptrksystems.com",
      email: "hello@ptrksystems.com",
      areaServed: { "@type": "Country", name: "Hungary" },
      address: { "@type": "PostalAddress", addressLocality: "Budapest", addressCountry: "HU" },
      knowsAbout: [
        "design engineering",
        "frontend architektúra",
        "design rendszerek",
        "Next.js",
        "TypeScript",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://ptrksystems.com/#website",
      url: "https://ptrksystems.com",
      name: "PTRK Systems",
      inLanguage: "hu",
      publisher: { "@id": "https://ptrksystems.com/#org" },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  );
}
```

- [ ] **Step 2:** `layout.tsx`: import + `<JsonLd />` a `<body>` első gyermekeként.
- [ ] **Step 3:** Commit: `git commit -m "feat(seo): JSON-LD ProfessionalService + WebSite schema"`

### Task 9: Vercel Analytics + Speed Insights

**Files:** Modify: `package.json`, `src/app/layout.tsx`

- [ ] **Step 1:** `npm install @vercel/analytics @vercel/speed-insights`
- [ ] **Step 2:** `layout.tsx`: `import { Analytics } from "@vercel/analytics/react";` + `import { SpeedInsights } from "@vercel/speed-insights/next";`, mindkettő a `<body>` végére: `<Analytics /> <SpeedInsights />`
- [ ] **Step 3:** `npm run build` PASS. Commit: `git commit -m "feat(infra): Vercel Analytics + Speed Insights"`

### Task 10: SIGNAL LOST — not-found.tsx

**Files:** Create: `src/app/not-found.tsx` (server component, 0 client JS)

- [ ] **Step 1:** Teljes tartalom:

```tsx
import Link from "next/link";
import { Crosshair } from "@/components/Crosshair";

const ERROR_LOG = [
  { t: "00:00.041", code: "RTE·404", msg: "route not resolved in nav graph" },
  { t: "00:00.087", code: "SCN·RUN", msg: "rescanning sector map … 0 hits" },
  { t: "00:00.112", code: "LNK·ERR", msg: "uplink target unreachable" },
  { t: "00:00.140", code: "SYS·REC", msg: "rerouting to known nodes ↓" },
];

const EXITS = [
  { href: "/", label: "Főoldal", code: "§ 00 · HOME" },
  { href: "/work", label: "Portfólió", code: "§ 02 · INDEX" },
  { href: "/connect", label: "Kontakt", code: "§ 06 · COMMS" },
];

export default function NotFound() {
  return (
    <section className="min-h-svh flex items-center px-6 md:px-10 py-32 tab-enter">
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="font-monospec text-[11px] text-magenta bg-magenta/10 border border-magenta/30 px-3 py-1.5 tracking-[0.25em]">
            ▓▒ TRANSMISSION ERROR
          </span>
          <span className="font-monospec text-[10px] text-secondary tracking-[0.3em]">
            ERR·0x194 / NOD·0A20070A
          </span>
        </div>

        <h1 className="font-khinterference uppercase leading-[0.95] tracking-[0.02em] mb-4">
          <span className="block text-[clamp(56px,11vw,160px)] text-primary">Signal</span>
          <span className="block text-[clamp(56px,11vw,160px)] text-magenta">Lost.</span>
        </h1>
        <p className="font-sequel text-[clamp(28px,4vw,48px)] text-secondary/60 tracking-[-0.01em] mb-14">
          404 — a keresett szektor nem létezik.
        </p>

        <div className="relative bg-surface/80 border border-magenta/20 mb-14 max-w-[640px]">
          <Crosshair position="tr" color="magenta" />
          <div className="border-b border-magenta/20 px-5 py-3 font-monospec text-[10px] tracking-[0.3em] text-magenta/70">
            SYS.LOG · ERROR TRACE
          </div>
          {ERROR_LOG.map((row) => (
            <div
              key={row.t}
              className="grid grid-cols-[auto_auto_1fr] items-baseline gap-4 px-5 py-2.5 font-monospec text-[11px] tracking-[0.12em]"
            >
              <span className="text-secondary/50">{row.t}</span>
              <span className="text-magenta">{row.code}</span>
              <span className="text-secondary">{row.msg}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {EXITS.map((exit) => (
            <Link key={exit.href} href={exit.href} className="group flex flex-wrap items-baseline gap-4">
              <span className="font-monospec text-[10px] tracking-[0.3em] text-cyan/60 group-hover:text-cyan transition-colors">
                {exit.code}
              </span>
              <span className="font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 group-hover:text-lime transition-colors">
                {exit.label} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Dev-szerveren `http://localhost:3000/nincs-ilyen` → SIGNAL LOST renderel a teljes HUD-kerettel.
- [ ] **Step 3:** Commit: `git commit -m "feat(404): SIGNAL LOST not-found page in HUD language"`

### Task 11: OG + Twitter kép (next/og)

**Files:** Create: `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` · Modify: `src/app/layout.tsx` (twitter card metadata)

- [ ] **Step 1:** `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const alt = "PTRK Systems — Design Engineering Unit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadChakraPetch(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600",
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

const corner = (pos: Record<string, number>, color: string) => (
  <div
    style={{
      position: "absolute",
      width: 56,
      height: 56,
      borderColor: color,
      borderStyle: "solid",
      borderWidth: 0,
      ...pos,
    }}
  />
);

export default async function OgImage() {
  const chakra = await loadChakraPetch();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#050508",
          fontFamily: chakra ? "Chakra Petch" : "sans-serif",
          position: "relative",
        }}
      >
        {corner({ top: 32, left: 32, borderTopWidth: 4, borderLeftWidth: 4 }, "#c2fe0c")}
        {corner({ top: 32, right: 32, borderTopWidth: 4, borderRightWidth: 4 }, "#01ffff")}
        {corner({ bottom: 32, left: 32, borderBottomWidth: 4, borderLeftWidth: 4 }, "#ea027e")}
        {corner({ bottom: 32, right: 32, borderBottomWidth: 4, borderRightWidth: 4 }, "#ff8c42")}
        <div
          style={{
            fontSize: 28,
            letterSpacing: 12,
            color: "#01ffff",
            marginBottom: 24,
          }}
        >
          ◢ DESIGN.ENGINEERING.UNIT ◣
        </div>
        <div style={{ display: "flex", fontSize: 160, lineHeight: 1 }}>
          <span style={{ color: "#f8fafc" }}>PTRK</span>
          <span style={{ color: "#c2fe0c" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 64, color: "#c2fe0c", letterSpacing: 8 }}>
          SYSTEMS
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            fontSize: 22,
            letterSpacing: 6,
            color: "#94a3b8",
          }}
        >
          BUDAPEST · CET · 47.4979°N 19.0402°E
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 80,
            fontSize: 22,
            letterSpacing: 6,
            color: "#c2fe0c",
          }}
        >
          SYS_ONLINE ■
        </div>
      </div>
    ),
    {
      ...size,
      fonts: chakra
        ? [{ name: "Chakra Petch", data: chakra, weight: 600 as const }]
        : undefined,
    },
  );
}
```

- [ ] **Step 2:** `src/app/twitter-image.tsx`:

```tsx
export { default, alt, size, contentType } from "./opengraph-image";
```

(Ha a re-export nem működne a Next image-konvencióval, duplikáld a fájl tartalmát.)

- [ ] **Step 3:** `layout.tsx` metadata bővítés: `twitter: { card: "summary_large_image", title: "PTRK Systems — Design Engineering", description: "Termék-felületek, design rendszerek és frontend architektúra Budapestről." }`
- [ ] **Step 4:** `npm run build` PASS; dev-szerveren `http://localhost:3000/opengraph-image` ad vissza PNG-t.
- [ ] **Step 5:** Commit: `git commit -m "feat(seo): HUD-style OG + twitter image via next/og"`

### Task 12: Záró verifikáció + review + merge

- [ ] **Step 1:** `npm run build` PASS, `npm audit` tiszta.
- [ ] **Step 2:** Dev-render check: `/`, `/work` (2 új LIVE link!), `/method`, `/connect`, `/nemletezik` (404), `/opengraph-image`.
- [ ] **Step 3:** Code-quality review agent a teljes `git diff main...feat/sprint1-hygiene` diffen.
- [ ] **Step 4:** Findingok javítása, majd `git checkout main && git merge --no-ff feat/sprint1-hygiene && git push origin main`.
