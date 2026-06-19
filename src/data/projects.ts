export type AccentColor = "lime" | "cyan" | "magenta" | "orange";

/** Single source of truth for engagement terms – NEVER hardcode these
    numbers in components; the 2–4w/2–8w/14–30d drift came from exactly that. */
export const ENGAGEMENT = {
  sprintRange: "2–8w",
  launchRange: "14–30d",
  responseTime: "<24h",
  nextSlot: "Q3 · 2026",
  nextSlotCompact: "Q3.26",
} as const;

/** Mission Debrief content – VERIFIABLE FACTS ONLY (stack, shipped
    features, live URLs, scope). No invented metrics, no unprovable claims. */
export type CaseStudy = {
  lead: string;
  briefing: string[];
  execution: { title: string; body: string; icon?: string }[];
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
  /** Real client quote – section stays hidden until one exists. */
  testimonial?: Testimonial;
};

export const PROJECTS: Project[] = [
  {
    id: "f3xykee-terminal",
    name: "F3XYKEE",
    client: "fexyke.hu",
    year: "2026",
    role: "FULL-STACK · DESIGN + ENG",
    desc: "Military-HUD közösségi adat-hálózat: saját tartalom-motor (szöveg, kép-karusszel, videó, hang), célzott közönség, XP-profilok, privát üzenetküldés, 9 nyelv és Twitch élő-integráció. Auth + RLS, audit-napló, prod deploy a fexyke.hu-n.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    metric: "60/30/10",
    metricLabel: "HUD · Term · Modern",
    color: "lime",
    url: "https://fexyke.hu",
    caseStudy: {
      lead: "Military-HUD közösségi adat-hálózat a nulláról: saját tartalom-motor, célzott közönség-kezelés, XP-alapú operátor-profilok és jogosultság-szigorú adatréteg, kilenc nyelven, élesben a fexyke.hu domainen.",
      briefing: [
        "A megrendelő egy zárt, karakteres adat-megosztó platformot akart: nem közösségi sablonklónt, hanem saját vizuális nyelvű, terminál-esztétikájú rendszert, ahol a tartalom-áramlás és a jogosultság-kezelés is testreszabott.",
        "A scope a teljes lánc volt: brand-irány, UI-rendszer, frontend, adatbázis-séma, autentikáció, jogosultság-rendszer és éles deploy custom domainen.",
      ],
      execution: [
        {
          icon: "interface-essential-pencil-edit-1",
          title: "Saját tartalom-motor",
          body: "Server Action alapú poszting-motor szöveghez, több-képes karusszelhez, videóhoz és hanghoz, automatikus kivonattal és HTML-sanitizálással. Nem készre vett CMS, hanem a platform igényeire méretezett, visszafelé kompatibilis adatfolyam.",
        },
        {
          icon: "business-product-target",
          title: "Célzott közönség",
          body: "Posztonként öt láthatósági mód (mindenki, belépett tagok, adminok, superadminok, kézzel kiválasztott névsor), újrahasználható, elnevezett csoportokkal. A láthatóság a szerveren ÉS a feed-lekérdezésben is érvényesül, így a rejtett tartalom nem szivárog ki.",
        },
        {
          icon: "interface-essential-trophy",
          title: "Operátor-profilok XP/szint rendszerrel",
          body: "Minden tag callsign-nal, avatarral, bióval és érdeklődési címkékkel. Az XP-t adatbázis-triggerek osztják automatikusan (poszt, komment, reakció), a szintet Postgres-függvény számolja: a platform játékossá és visszatérővé válik.",
        },
        {
          icon: "interface-essential-message",
          title: "Közösségi réteg: jelzéslánc, üzenetek, jelenlét",
          body: "Beágyazott komment-láncok és emoji-reakciók posztra, kommentre és profilra; privát üzenetküldés kölcsönös ismerős-rendszerrel; online/offline jelenlét és magától frissülő chat. Minden interakció több-szintű anti-spam védelemmel.",
        },
        {
          icon: "interface-essential-key-login",
          title: "Auth, jogosultság és superadmin-kontroll",
          body: "Callsign- és email-alapú belépés, email-verifikáció, jelszó-visszaállítás és email-csere. Három jogosultsági szint és külön superadmin vezérlőpult, ahol az érzékeny műveletek kötelező jelszó-újramegadáshoz (re-auth) kötöttek és audit-naplóba kerülnek.",
        },
        {
          icon: "coding-apps-websites-firewall",
          title: "Defense-in-depth adatbiztonság",
          body: "Minden tábla Row Level Security mögött, az írás kizárólag szerver-oldalon. Szigorú CSP, HSTS, X-Frame-Options és Permissions-Policy, feltöltés-whitelist és sharp-os kép-újrakódolás. A séma 25 verziózott, idempotens migrációban fejlődik.",
        },
        {
          icon: "internet-network-www",
          title: "Kilenc nyelv: felület és tartalom-fordítás",
          body: "A teljes felület szótár-alapú i18n rétegen fut kilenc nyelven, a felhasználói tartalom pedig futásidőben, automatikus forrásnyelv-felismeréssel fordítható: nemzetközi közönség a saját nyelvén olvashat.",
        },
        {
          icon: "interface-essential-wifi-feed",
          title: "Twitch élő-adás integráció",
          body: "Szerver-oldali Twitch Helix integráció edge-cache-eléssel: amikor a tulajdonos élőben streamel, a platform automatikusan kijelzi az ÉLŐ státuszt, a címet és a nézőszámot.",
        },
      ],
      debrief: [
        "Élesben fut a fexyke.hu custom domainen, Vercel deploy-jal.",
        "Next.js 16 + React 19 + TypeScript + Supabase: séma, auth, jogosultság és UI egy kézben készült, handoff-veszteség nélkül.",
        "25 verziózott adatbázis-migráció: a rendszer biztonságosan, éles adatbázison is továbbfejleszthető.",
        "Bővíthetőre tervezve: új modul a meglévő jogosultsági és vizuális alapokra csatlakozik.",
      ],
      artifacts: [
        "Production Next.js 16 kódbázis (Server Actions)",
        "Supabase séma + RLS policy-k (25 migráció)",
        "Superadmin vezérlőpult + audit-napló",
        "9-nyelvű i18n + tartalom-fordítás",
        "Twitch élő-státusz integráció",
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
    desc: "Háromnyelvű farmakológiai edukációs platform 191 hatóanyag-profillal, négy könyvtárban. PubMed-verifikált források gépi ellenőrző-kapuval, lazy 3D Three.js háttér, dózis-kalkulátorok és PWA offline-támogatás.",
    stack: ["Vite 6", "React 19", "Three.js", "Tailwind", "PWA"],
    metric: "191",
    metricLabel: "Hatóanyag-profil",
    color: "cyan",
    url: "https://molekulax.vercel.app",
    caseStudy: {
      lead: "Farmakológiai edukációs tudásbázis négy könyvtárral és 191 hatóanyag-profillal, három nyelven: minden tudományos hivatkozás saját fejlesztésű PubMed-verifikációs kapun megy át, mielőtt élesbe kerül.",
      briefing: [
        "Edukációs platform peptidekről és társterületekről: a cél fókuszált, forrás-hű információ, zaj és csoportok nélkül, közvetlen szakértői kontakttal.",
        "A legnagyobb kockázat a tartalom-integritás volt: ahol tudományos hivatkozások szerepelnek, ott a forrás-hitelesség bizalmi alapkérdés, ezért a hivatkozás-ellenőrzés gépi build-kapuvá vált, nem utólagos átnézéssé.",
      ],
      execution: [
        {
          icon: "content-files-book-library",
          title: "Négy tudásbázis-könyvtár, 191 profillal",
          body: "Peptid, nootropikum, teljesítmény és gyógyszer könyvtár közös entry-architektúrán, kutatási-szint besorolással és hatásterület-csempékkel. Egyetlen domain-modell, így minden könyvtár ugyanazokat a galéria- és részletnézet-komponenseket használja.",
        },
        {
          icon: "internet-network-www",
          title: "Háromnyelvű (HU/EN/PL) felület és tartalom",
          body: "Külön UI-szótárak, és minden hatóanyag-mező három nyelven tárolva. Egyetlen kódbázis három piacot szolgál ki: a látogató anyanyelvén olvashatja mind a felületet, mind a szakmai tartalmat.",
        },
        {
          icon: "interface-essential-search-check",
          title: "PubMed forrás-verifikációs tooling",
          body: "Saját NCBI eutils-alapú CLI: minden idézett tanulmány PMID-jét lekérdezi a PubMed-ről, és cím-egyezés alapján OK, eltérés vagy nem-található státuszra osztályozza. Garantálja, hogy a megjelenített hivatkozások valódiak, nem kitaláltak.",
        },
        {
          icon: "interface-essential-lock-shield",
          title: "Ötrétegű automata integritás-kapu",
          body: "Commit-tól deploy-ig öt egymásra épülő kapu: pre-commit PMID- és nyelvi-drift ellenőrzés, offline konzisztencia-guard, build-idői meta-validáció, CI build + tesztek, és külön PMID-gate NCBI-ellenőrzéssel. Hibás tartalom nem tud észrevétlenül élesbe kerülni.",
        },
        {
          icon: "interface-essential-view-eye",
          title: "Render-smoke kapu fehér-képernyő ellen",
          body: "Puppeteer headless Chrome-ban tölti be a kulcs-oldalakat minden release előtt, és elbukik, ha a React nem mountol vagy hiba renderel. Elkapja azokat az összeomlásokat, amiket a sima build és a tesztek nem vesznek észre.",
        },
        {
          icon: "school-science-test-flask",
          title: "Lazy 3D Three.js DNS-adatháló háttér",
          body: "Saját WebGL2 renderer DNS-kettőshélixekből álló, glóriázó adathálóval. Csak desktop és dark módban töltődik le és mountol (mobilon CSS-backdrop), külön chunkban, teljes teardownnal: prémium vizuál a mobil sebesség feláldozása nélkül.",
        },
        {
          icon: "photography-photo-image",
          title: "Termékfotó-pipeline",
          body: "Automatikus háttér-eltávolítás (rembg) és három formátumú képoptimalizálás (PNG, WebP, AVIF) a teljes peptid-katalógusra: egységes, profi, gyorsan töltődő termékfotók kézi szerkesztés nélkül.",
        },
        {
          icon: "money-payments-accounting-calculator",
          title: "Interaktív dózis-kalkulátorok",
          body: "Könyvtáranként saját kalkulátor (peptid-rekonstitúció, teljesítmény- és gyógyszer-dózis): a látogató nemcsak olvas, hanem azonnal kiszámolja a számára releváns értékeket.",
        },
      ],
      debrief: [
        "Élő: molekulax.vercel.app, három nyelven (HU / EN / PL).",
        "A hivatkozás-higiénia gépileg kikényszerített: a teljes katalógus PMID-állománya élő NCBI-ellenőrzésen megy át minden változásnál.",
        "Ötrétegű integritás-kapu (commit-hook, drift-check, meta-validáció, CI, render-smoke) védi a tartalmat és a renderelést.",
        "PWA: telepíthető és offline is használható, finomhangolt cache-stratégiákkal és nyelvenként lazy-betöltött, kód-szétdarabolt adatréteggel.",
      ],
      artifacts: [
        "Vite + React kódbázis, 191 hatóanyag-profil",
        "PMID-verifikációs CLI tooling (NCBI eutils)",
        "HU/EN/PL tartalmi réteg",
        "5-rétegű CI + render-smoke pipeline",
        "Three.js DNS-háttér + termékfotó-pipeline",
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
    title: "Indulás & Élő Gondozás",
    desc: "Élesítés, a domain a te nevedre, átadás. Innentől a havi Élő Gondozás visz tovább: karbantartás, figyelés, forgalom-mérés, igény szerinti fejlesztés, és mindig friss, biztonságos oldal.",
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
  { name: "Three.js", category: "WebGL" },
  { name: "Figma", category: "Design" },
] as const;

export const FAQ = [
  {
    q: "Kié lesz a weboldal?",
    a: "A tiéd, az első naptól. A domain a te nevedre kerül, írásos tulajdonjogi garanciát adunk, és ha bármikor továbblépnél, 48 órán belül átadunk mindent. A havidíj a gondozásért van, nem azért, hogy fogva tartsunk.",
  },
  {
    q: "Mi történik a weboldal elkészülte után?",
    a: "Itt kezdődik a lényeg. A havi Élő Gondozásban karbantartjuk, figyeljük és mérjük az oldalt, igény szerint fejlesztjük, és mindig frissen, biztonságosan, a versenytársaid felett tartjuk. A felső szinten havi láthatósági jelentést is kapsz a teljesítményről.",
  },
  {
    q: "Garantáljátok, hogy több ügyfelem lesz?",
    a: "Nem ígérünk garantált számokat, mert azt egy új oldalnál tisztességesen nem lehet. Amit adunk: mérés és átláthatóság. Havonta megmutatjuk, mi történik az oldaladdal, és gondoskodunk róla, hogy gyors, megtalálható és friss legyen.",
  },
  {
    q: "Mennyibe kerül?",
    a: "Attól függ, mekkora oldal kell: egyoldalas bemutatkozótól az egyedi, többoldalas megoldásig, plusz a havi Élő Gondozás. AAM-ben dolgozunk, így nálad nincs 27% ÁFA a tetején. A pontos árat egy rövid hívásban, a te igényeidre szabva mondjuk meg.",
  },
  {
    q: "Miért veled dolgozzak, és ne egy ügynökséggel?",
    a: "Mert közvetlenül a döntéshozóval dolgozol, nem veszel el egy gépezetben, és nincs ügyfélszolgálati lánc. Gyorsabb, személyesebb, és pontosan azt kapod, amire szükséged van. Ráadásul egy 5-15 fős ügynökség rezsije és felárai nélkül a prémium minőség jóval kedvezőbb áron jön ki.",
  },
];
