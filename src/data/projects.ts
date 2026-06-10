export type AccentColor = "lime" | "cyan" | "magenta" | "orange";

/** Single source of truth for engagement terms — NEVER hardcode these
    numbers in components; the 2–4w/2–8w/14–30d drift came from exactly that. */
export const ENGAGEMENT = {
  sprintRange: "2–8w",
  launchRange: "14–30d",
  responseTime: "<24h",
  nextSlot: "Q3 · 2026",
  budgetRange: "5–50k EUR",
} as const;

/** Mission Debrief content — VERIFIABLE FACTS ONLY (stack, shipped
    features, live URLs, scope). No invented metrics, no unprovable claims. */
export type CaseStudy = {
  lead: string;
  briefing: string[];
  execution: { title: string; body: string }[];
  debrief: string[];
  artifacts: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

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
  caseStudy: CaseStudy;
  /** Real client quote — section stays hidden until one exists. */
  testimonial?: Testimonial;
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
    caseStudy: {
      lead: "Military-HUD adat-hálózat platform a nulláról: saját poszting motor, operátor-profilok és jogosultság-szigorú adatréteg — élesben a fexyke.hu domainen.",
      briefing: [
        "A megrendelő egy zárt, karakteres adat-megosztó platformot akart — nem közösségi sablonklónt, hanem saját vizuális nyelvű, terminál-esztétikájú rendszert, ahol a tartalom-áramlás és a jogosultság-kezelés is testreszabott.",
        "A scope a teljes lánc volt: brand-irány, UI-rendszer, frontend, adatbázis-séma, autentikáció és éles deploy custom domainen.",
      ],
      execution: [
        {
          title: "HUD design-rendszer",
          body: "Neon-zöld military-HUD vizuális nyelv, tudatos 60/30/10 rétegzéssel: HUD-keretek, terminál-elemek és modern UI-felületek aránya rögzített design-döntés, nem utólagos dísz.",
        },
        {
          title: "Poszting motor + jelzéslánc",
          body: "Saját tartalom-publikáló motor operátor-profilokkal, jelzéslánccal és superadmin irányítással — nem készre vett CMS, hanem a platform igényeire méretezett adatfolyam.",
        },
        {
          title: "Auth + RLS adatréteg",
          body: "Supabase PostgreSQL Row Level Security policy-kkal: a jogosultság az adatbázis-rétegben kényszerített, nem csak a UI-ban — a kliens megkerülésével sem szivárog adat.",
        },
      ],
      debrief: [
        "Élesben fut a fexyke.hu custom domainen, Vercel deploy-jal.",
        "Next.js 16 + TypeScript + Supabase stack — séma, auth és UI egy kézben készült, handoff-veszteség nélkül.",
        "A jogosultság-rendszer és a vizuális nyelv bővíthetőre tervezett: új modul a meglévő alapokra csatlakozik.",
      ],
      artifacts: [
        "Production Next.js 16 kódbázis",
        "Supabase séma + RLS policy-k",
        "Superadmin irányítópult",
        "Custom domain + Vercel deploy",
      ],
    },
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
    url: "https://molekulax.vercel.app",
    caseStudy: {
      lead: "Farmakológiai edukációs tudásbázis négy könyvtárral, három nyelven — minden tanulmány-hivatkozás saját fejlesztésű PubMed-verifikációs kapun megy át, mielőtt élesbe kerül.",
      briefing: [
        "Edukációs platform peptidekről és társterületekről: a cél fókuszált, forrás-hű információ — csoportok és zaj nélkül, közvetlen szakértői kontakttal.",
        "A legnagyobb kockázat a tartalom-integritás volt: tartalom-pipeline-oknál a hivatkozás-fabrikáció valós veszély, ezért a hivatkozás-ellenőrzés build-kapuvá vált, nem utólagos átnézéssé.",
      ],
      execution: [
        {
          title: "Négy tudásbázis-könyvtár",
          body: "Peptid, nootropikum, performance és pharma könyvtár közös entry-architektúrán, route-tudatos adat-adapterrel és HU/EN/PL nyelvi rétegekkel.",
        },
        {
          title: "PubMed-verifikációs tooling",
          body: "Saját NCBI eutils-alapú ellenőrző CLI: minden PMID-hivatkozás cím-egyezés alapján validálódik; commit-hook, offline drift-check és CI-kapu védi a katalógust.",
        },
        {
          title: "Render-smoke kapu",
          body: "Puppeteer-alapú render-ellenőrzés minden release előtt — a build-en és teszteken átcsúszó blank-page osztályú hibákat a render-szintű kapu fogja meg.",
        },
        {
          title: "Termékfotó-pipeline",
          body: "53 vial-fotó egységesített feldolgozása (háttér-eltávolítás, normalizálás) a teljes peptid-katalógusra.",
        },
      ],
      debrief: [
        "Élő: molekulax.vercel.app, három nyelven (HU / EN / PL).",
        "A hivatkozás-higiénia automatizált: a teljes katalógus PMID-állománya ellenőrzésen megy át minden változásnál.",
        "Négyrétegű integritás-kapu (commit-hook, drift-check, CI, render-smoke) védi a tartalmat és a renderelést.",
      ],
      artifacts: [
        "Vite + React kódbázis",
        "PMID-verifikációs CLI tooling",
        "HU/EN/PL tartalmi réteg",
        "CI + render-smoke pipeline",
      ],
    },
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
    url: "https://www.donnapizzakecskemet.eu",
    caseStudy: {
      lead: "Étterem-landing Kecskemétről: menü, foglalás-flow, Foodora-integráció és valódi Google-vélemények — egy oldal, ami a foglalás és a rendelés felé van hangolva.",
      briefing: [
        "A Donna Pizza & Gasztro Bárnak olyan webes jelenlét kellett, ami a vendéget néhány kattintáson belül asztalfoglalásig vagy rendelésig viszi.",
        "Branding-irány és landing egy kézben: vizuális nyelv, tartalmi struktúra és implementáció közös kontextusban készült.",
      ],
      execution: [
        {
          title: "Konverzió-fókuszú szekció-sor",
          body: "Hero, menü, foglalás, Foodora-rendelés, vélemények, kontakt + térkép — a teljes oldal a foglalás/rendelés felé tereli a látogatót, nem csak bemutat.",
        },
        {
          title: "Foodora + Google reviews integráció",
          body: "Közvetlen rendelés-link és kiemelt valódi vendég-vélemények — a bizonyíték a vendégektől jön, nem a marketing-copy-ból.",
        },
        {
          title: "Strukturált tartalom",
          body: "Menü és információk adatként élnek a kódbázisban — gyors módosítás, konzisztens render minden szekcióban.",
        },
      ],
      debrief: [
        "Élő: donnapizzakecskemet.eu.",
        "Vite 5 + React + Tailwind 3 stack — könnyű, gyors landing.",
        "A foglalási és rendelési út a látogató felől tervezett: minden szekcióból elérhető a következő lépés.",
      ],
      artifacts: [
        "Vite 5 + React kódbázis",
        "Menü- és tartalom-adatstruktúra",
        "Foodora rendelés-integráció",
        "Térkép + kontakt blokk",
      ],
    },
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
