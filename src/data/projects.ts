export type AccentColor = "lime" | "cyan" | "magenta" | "orange";

export type Project = {
  id: string;
  name: string;
  client: string;
  year: string;
  role: string;
  desc: string;
  stack: string[];
  metric: string;
  metricLabel: string;
  color: AccentColor;
  url?: string;
  /** SVG path data for the 3D wave clip-path mock. Defaults if omitted. */
  waveClip?: { base: string; accent: string };
};

export const PROJECTS: Project[] = [
  {
    id: "f3xykee-terminal",
    name: "F3XYKEE",
    client: "fexyke.hu",
    year: "2026",
    role: "FULL-STACK · DESIGN + ENG",
    desc: "Military-HUD adat-hálózat platform. Saját poszting motor, operátor profilok, jelzéslánc, superadmin irányítás. Auth + RLS, custom domain, prod deploy.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    metric: "60/30/10",
    metricLabel: "HUD · Term · Modern",
    color: "lime",
    url: "https://fexyke.hu",
  },
  {
    id: "molekulax",
    name: "MOLEKULAX",
    client: "Independent",
    year: "2026",
    role: "DESIGN + FRONTEND",
    desc: "Edukációs platform peptidekről. Tudásbázis, peer-reviewed PubMed tanulmányok, közvetlen szakértői kontakt — nincs csoport, csak fókuszált információ.",
    stack: ["Vite", "React", "Tailwind", "Corporea"],
    metric: "04",
    metricLabel: "PubMed Studies",
    color: "cyan",
    // url: live URL TBD — set this when deployed
  },
  {
    id: "donna-pizza",
    name: "DONNA",
    client: "Donna Pizza & Gasztro Bár",
    year: "2026",
    role: "BRANDING + LANDING",
    desc: "Étterem landing page Kecskemétről. Menü, asztalfoglalás flow, Foodora integráció, Google reviews kiemelés, kontakt form + térkép.",
    stack: ["Vite 5", "React", "Tailwind 3", "Lucide"],
    metric: "9",
    metricLabel: "Sections Live",
    color: "magenta",
    // url: live URL TBD — set this when deployed
  },
];

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Kutatás & Stratégia",
    desc: "Felhasználói interjúk, piacelemzés, versenytárs audit. Meghatározzuk a core problémákat és a siker metrikákat.",
  },
  {
    number: "02",
    title: "Információs Architektúra",
    desc: "Tartalmi struktúra, user flow-k, wireframe-ek. Biztosítjuk, hogy az UX logikus és skálázható legyen.",
  },
  {
    number: "03",
    title: "Vizuális Design",
    desc: "Hi-fi mockupok, design rendszer, komponens library. Minden elem pixel-perfect és brand-aligned.",
  },
  {
    number: "04",
    title: "Frontend Fejlesztés",
    desc: "React/TypeScript alapú implementáció. Reszponzív, akadálymentes, performant. Minden sor kód auditált.",
  },
  {
    number: "05",
    title: "Tesztelés & Iteráció",
    desc: "Usability testing, A/B tesztek, teljesítmény mérés. Folyamatos finomhangolás az éles indítás előtt.",
  },
  {
    number: "06",
    title: "Launch & Support",
    desc: "Éles indítás, dokumentáció, knowledge transfer. Post-launch support és folyamatos optimalizálás.",
  },
];

export const TECH_STACK = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind v4", category: "Styling" },
  { name: "Vite 5", category: "Bundler" },
  { name: "Supabase", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Drizzle ORM", category: "ORM" },
  { name: "Vercel", category: "Hosting" },
  { name: "Resend", category: "Email" },
  { name: "Lenis", category: "Motion" },
  { name: "Figma", category: "Design" },
] as const;

export const FAQ = [
  {
    q: "Miért egy csapat, és nem egy ügynökség?",
    a: "Vertikális egység — design, frontend és deploy egy kézben. Nincs szilo, nincs handoff-veszteség, gyorsabb iteráció.",
  },
  {
    q: "Milyen projektméret optimális?",
    a: "2–8 hetes szprintek 5–50k EUR között. Hosszabb retainer szerződésekre is van kapacitás (Q3 2026 nyit).",
  },
  {
    q: "Készen kapunk valamit, vagy közösen építjük?",
    a: "Mindkettőre van process. Discovery + szállítás vagy heti szprintek + élő demo — a projekt érettsége dönt.",
  },
  {
    q: "Mit kapunk a végén?",
    a: "Production-ready Next.js / Vite kódbázis, Figma forrásfájlok, deploy konfiguráció, dokumentáció és 30 napos hyper-care.",
  },
];
