# PTRK Systems

Design engineering portfolio site — Next.js 15 + Tailwind v4 + TypeScript.

Marathon-inspired, crosshair-marked, lime-accented. Single-page SPA with 4 tabs:
**HOME / WORK / METHOD / CONNECT**.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4 (`@theme` tokens, no config file)
- TypeScript strict
- 8 self-hosted custom fonts via `next/font/local`

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

## Add a new project

Open `src/data/projects.ts` and append a new object to `PROJECTS`:

```ts
{
  id: "my-project",
  name: "MY PROJECT",
  client: "Client Name",
  year: "2026",
  role: "ROLE TAGLINE",
  desc: "One paragraph description in Hungarian.",
  stack: ["Tech", "Tech", "Tech"],
  metric: "1.2k",
  metricLabel: "Some Metric",
  color: "lime",          // lime | cyan | magenta | orange
  url: "https://...",     // optional
}
```

The project will appear in the portfolio selector + detail view automatically.

## Design tokens

- void `#050508` background, surface `#0A0E1A`
- lime `#c2fe0c` primary, cyan `#01FFFF`, magenta `#EA027E`, orange `#FF8C42`
- 0px radius universally (sharp Marathon DNA)
- 8 fonts rotated by component (Goliath display, Sequel/KH Grotesk/MS PGothic/Fraktion in tabs, MonoSpec for protocol meta, Shorai for body lead)

## Folder map

```
src/
├── app/
│   ├── layout.tsx       # font vars, metadata, lang="hu"
│   ├── page.tsx         # mounts <AppShell />
│   └── globals.css      # @theme tokens + keyframes
├── components/
│   ├── AppShell.tsx     # tab state + hash routing
│   ├── Navigation.tsx
│   ├── LandingTab.tsx
│   ├── PortfolioTab.tsx
│   ├── ProcessTab.tsx
│   ├── ContactTab.tsx
│   ├── Crosshair.tsx    # signature corner marker
│   ├── DataStream.tsx   # animated binary background
│   ├── FloatingIcon.tsx # mouse-repel hover
│   └── Footer.tsx
├── data/projects.ts     # ← extend here
└── lib/
    ├── fonts.ts         # next/font/local declarations
    └── colors.ts        # accent color → tailwind class map
```

## Custom fonts

Bundled in `public/fonts/`. Marathon-game theme fonts — check usage rights before deploying under a third-party domain.
