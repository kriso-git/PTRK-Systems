/**
 * Shared command pool + color map for the live terminal-style decorations:
 *  - <LiveTerminalTypers /> (scattered random typers across the viewport)
 *  - The flowing right-edge data stream inside <MarathonBackground />
 *
 * Both consume the same pool and tag→color mapping so the two decorations
 * feel like instances of the same imagined dev session.
 */

export type SlotColor = "lime" | "cyan" | "magenta" | "orange";

export const COLOR_HEX: Record<SlotColor, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

export type LineTag = "$" | "▶" | "//" | "[OK]" | "[WARN]" | "[INFO]";

export const TAG_COLOR: Record<LineTag, SlotColor> = {
  $: "lime",
  "▶": "cyan",
  "//": "magenta",
  "[OK]": "lime",
  "[WARN]": "orange",
  "[INFO]": "cyan",
};

/**
 * Generic dev-session command pool used by the right-edge data stream.
 * 50+ commands across shell calls, status events, code comments, bracketed
 * statuses — flavoured to read like a real dev session monitoring a Marathon-
 * themed system.
 */
export const COMMAND_POOL: string[] = [
  // Shell
  "$ pnpm dev --turbopack",
  "$ pnpm test --coverage",
  "$ pnpm tsc --noEmit",
  "$ git status",
  "$ git fetch origin main",
  "$ git commit -m 'fix: log scroll'",
  "$ git push origin main",
  "$ tail -f /var/log/edge",
  "$ vercel logs --since 1h",
  "$ docker logs ptrk-prod",
  "$ rg --hidden 'TODO'",
  "$ curl -sI /api/health",
  "$ kubectl get pods -A",
  "$ ssh node@ptrk.systems",
  "$ uptime",
  // Status / events
  "▶ READY · 1.04s · turbopack",
  "▶ DEPLOY · vercel push · 200",
  "▶ TX·8AC9 · payload 2.4kb",
  "▶ MERGE · pr#42 → main",
  "▶ AUTH · session refreshed",
  "▶ NOD·0A20 · LIVE",
  "▶ LNK·EC1153 · ok",
  "▶ BUILD · turbopack ready",
  "▶ SHIP · canary 5% → 100%",
  "▶ RELAY·02 · 17ms",
  "▶ JEL.STREAM · sync",
  // Code edits / comments
  "// edit src/app/layout.tsx +2",
  "// edit src/data/projects.ts",
  "// const accent = '#c2fe0c'",
  "// runtime: edge · region: fra1",
  "// type Operator = single",
  "// useEffect: cleanup",
  "// step 03 · architecture",
  "// const tz = 'Europe/Budapest'",
  "// 0xC2FE0C // accent",
  // Bracketed status
  "[OK] handshake · 200",
  "[OK] type-check · 0 errors",
  "[OK] lighthouse · 98/100",
  "[OK] e2e · 24/24",
  "[OK] supabase row · 12ms",
  "[OK] migration 001_init",
  "[OK] hmr update / in 12ms",
  "[OK] cache hit · 12ms",
  "[OK] zero CLS · zero LCP",
  "[OK] mail delivered · 200",
  "[WARN] retry 1/3",
  "[WARN] slow query · 240ms",
  "[INFO] node count · 47",
  "[INFO] cold start · 18ms",
];

/**
 * Route-specific pools for the scattered <LiveTerminalTypers /> background
 * decoration. Each route gets a distinct flavour so the four tabs feel like
 * different rooms in the same imagined dev session — index, work archive,
 * method/process notes, and the comms desk. Each pool also defines its own
 * spawn bias so the typer scatter pattern visibly differs per tab.
 */
export type SpawnBias = "left-heavy" | "scattered" | "top-cluster" | "bottom-cluster";

export const ROUTE_POOLS: Record<
  string,
  { commands: string[]; bias: SpawnBias }
> = {
  "/": {
    bias: "left-heavy",
    commands: [
      "$ pnpm dev --turbopack",
      "▶ READY · 1.04s · turbopack",
      "▶ INDEX · LANE·A · sync",
      "// root layout · render",
      "// const accent = '#c2fe0c'",
      "// welcome operator",
      "[OK] hmr update / in 12ms",
      "[OK] cold start · 18ms",
      "[OK] handshake · 200",
      "$ cat /etc/ptrk.cfg",
      "$ ssh node@ptrk.systems",
      "▶ NOD·0A20 · LIVE",
      "▶ JEL.STREAM · sync",
      "// tz: Europe/Budapest",
      "// runtime: edge · fra1",
      "[INFO] live nodes · 47",
      "[INFO] index ready",
      "▶ AUTH · session refreshed",
      "// 0xC2FE0C // accent",
      "$ uptime",
    ],
  },
  "/work": {
    bias: "scattered",
    commands: [
      "$ git log --oneline",
      "$ git push origin main",
      "$ git fetch origin",
      "$ pnpm build",
      "$ vercel logs --since 1h",
      "$ docker logs ptrk-prod",
      "▶ DEPLOY · vercel push · 200",
      "▶ MERGE · pr#42 → main",
      "▶ SHIP · canary 5% → 100%",
      "▶ BUILD · turbopack ready",
      "▶ TX·8AC9 · payload 2.4kb",
      "// edit src/data/projects.ts",
      "// type Project = {...}",
      "// case study · v2",
      "// commit · ship · review",
      "[OK] e2e · 24/24",
      "[OK] lighthouse · 98/100",
      "[OK] migration 002_projects",
      "[INFO] artifacts · 12 mb",
      "[INFO] commits · 247",
    ],
  },
  "/method": {
    bias: "top-cluster",
    commands: [
      "// step 01 · discovery",
      "// step 02 · architecture",
      "// step 03 · prototype",
      "// step 04 · build",
      "// step 05 · ship",
      "// step 06 · review",
      "// sprint goal · ship",
      "// pair session · 14:00",
      "// critique loop · running",
      "$ figma export --frames",
      "$ pnpm tsc --noEmit",
      "$ rg 'TODO' --hidden",
      "▶ AUDIT · contrast · pass",
      "▶ AUDIT · perf · 96/100",
      "▶ FIG·SYNC · 12 frames",
      "[OK] design tokens · v3",
      "[OK] tokens migrated",
      "[OK] type-check · 0 errors",
      "[INFO] discovery · 4 days",
      "[INFO] build · 2 weeks",
    ],
  },
  "/connect": {
    bias: "bottom-cluster",
    commands: [
      "$ mail send --to ops",
      "$ cal next-availability",
      "$ resend send --tpl onboarding",
      "$ curl -X POST /api/intake",
      "$ ssh node@ptrk.systems",
      "▶ INBOX · 02 unread",
      "▶ SLOT · 2026-05-14 14:00",
      "▶ HUB·CONNECT · idle",
      "▶ DM · channel#ops",
      "// form: name, email, msg",
      "// 24h response · committed",
      "// signup → first call",
      "// tz: Europe/Budapest",
      "[OK] mail delivered · 200",
      "[OK] webhook · ping 12ms",
      "[OK] captcha · pass",
      "[INFO] reply window · 24h",
      "[INFO] active threads · 03",
      "[WARN] retry 1/3",
      "▶ AUTH · session refreshed",
    ],
  },
};

/**
 * Resolve the pool config for the current route. Falls back to landing if
 * the pathname is unknown (e.g. dynamic routes).
 */
export function poolForRoute(pathname: string): {
  commands: string[];
  bias: SpawnBias;
} {
  return ROUTE_POOLS[pathname] ?? ROUTE_POOLS["/"];
}

/**
 * Detect which tag a command starts with so the flowing data stream can
 * colorize the tag prefix. Returns null if no tag prefix matches.
 */
export function detectTag(cmd: string): LineTag | null {
  if (cmd.startsWith("[OK]")) return "[OK]";
  if (cmd.startsWith("[WARN]")) return "[WARN]";
  if (cmd.startsWith("[INFO]")) return "[INFO]";
  if (cmd.startsWith("$")) return "$";
  if (cmd.startsWith("▶")) return "▶";
  if (cmd.startsWith("//")) return "//";
  return null;
}
