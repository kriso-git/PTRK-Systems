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
    desc: "Military-HUD közösségi adat-hálózat: saját tartalom-motor (szöveg, kép-karusszel, videó, hang), célzott közönség, XP-profilok, privát üzenetküldés, 9 nyelv és Twitch élő-integráció. Biztonságos bejelentkezés és jogosultság-kezelés, audit-napló, éles üzem a fexyke.hu-n.",
    stack: ["Egyedi fejlesztés", "Adatbázis + jogosultság", "Valós idejű funkciók", "Éles, saját domainen"],
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
          body: "Egyedi poszting-motor szöveghez, több-képes karusszelhez, videóhoz és hanghoz, automatikus kivonattal és tartalom-szűréssel. Nem készre vett sablonrendszer, hanem a platform igényeire méretezett, visszafelé kompatibilis adatfolyam.",
        },
        {
          icon: "business-product-target",
          title: "Célzott közönség",
          body: "Posztonként öt láthatósági mód (mindenki, belépett tagok, adminok, superadminok, kézzel kiválasztott névsor), újrahasználható, elnevezett csoportokkal. A láthatóság a szerveren ÉS a feed-lekérdezésben is érvényesül, így a rejtett tartalom nem szivárog ki.",
        },
        {
          icon: "interface-essential-trophy",
          title: "Operátor-profilok XP/szint rendszerrel",
          body: "Minden tag callsign-nal, avatarral, bióval és érdeklődési címkékkel. Az XP-t a rendszer automatikusan osztja (poszt, komment, reakció), és ebből számolja a szintet: a platform játékossá és visszatérővé válik.",
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
          body: "Az adat adatbázis-szintű jogosultságok mögött van, írni csak a szerver tud. Szigorú biztonsági fejlécek, feltöltés-szűrés és automatikus kép-újrakódolás véd. A séma 25 verziózott, biztonságos lépésben fejlődött.",
        },
        {
          icon: "internet-network-www",
          title: "Kilenc nyelv: felület és tartalom-fordítás",
          body: "A teljes felület szótár-alapú i18n rétegen fut kilenc nyelven, a felhasználói tartalom pedig futásidőben, automatikus forrásnyelv-felismeréssel fordítható: nemzetközi közönség a saját nyelvén olvashat.",
        },
        {
          icon: "interface-essential-wifi-feed",
          title: "Twitch élő-adás integráció",
          body: "Szerver-oldali Twitch-integráció gyors gyorsítótárazással: amikor a tulajdonos élőben streamel, a platform automatikusan kijelzi az ÉLŐ státuszt, a címet és a nézőszámot.",
        },
      ],
      debrief: [
        "Élesben fut a fexyke.hu saját domainen, éles üzemben.",
        "Séma, auth, jogosultság és felület egy kézben, modern alapokon: handoff-veszteség nélkül.",
        "25 verziózott adatbázis-migráció: a rendszer biztonságosan, éles adatbázison is továbbfejleszthető.",
        "Bővíthetőre tervezve: új modul a meglévő jogosultsági és vizuális alapokra csatlakozik.",
      ],
      artifacts: [
        "Egyedi, production-grade kódbázis",
        "Adatbázis-séma + jogosultsági szabályok (25 migráció)",
        "Superadmin vezérlőpult + audit-napló",
        "9-nyelvű felület + tartalom-fordítás",
        "Twitch élő-státusz integráció",
        "Saját domain + éles üzem",
      ],
    },
  },
  {
    id: "molekulax",
    name: "MOLEKULAX",
    client: "Independent",
    year: "2026",
    role: "DESIGN + FRONTEND",
    desc: "Háromnyelvű farmakológiai edukációs platform 191 hatóanyag-profillal, négy könyvtárban. PubMed-verifikált források gépi ellenőrző-kapuval, interaktív 3D kocka-navigáció, 3D-s adatháló háttér és telepíthető, offline app.",
    stack: ["Egyedi fejlesztés", "Többnyelvű tartalom", "3D / WebGL vizuál", "PWA, offline"],
    metric: "191",
    metricLabel: "Hatóanyag-profil",
    color: "cyan",
    url: "https://molekulax.hu",
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
          title: "PubMed forrás-verifikáció",
          body: "Saját, PubMed-alapú ellenőrző eszköz: minden idézett tanulmány azonosítóját lekérdezi a PubMed-ről, és cím-egyezés alapján rendben, eltérés vagy nem-található státuszra osztályozza. Garantálja, hogy a megjelenített hivatkozások valódiak, nem kitaláltak.",
        },
        {
          icon: "interface-essential-lock-shield",
          title: "Ötrétegű automata integritás-kapu",
          body: "A mentéstől az élesítésig öt egymásra épülő automata ellenőrzés: forrás- és nyelvi-konzisztencia ellenőrzés, adat-integritás vizsgálat, automata tesztek, és külön PubMed-hitelesítés. Hibás tartalom nem tud észrevétlenül élesbe kerülni.",
        },
        {
          icon: "interface-essential-view-eye",
          title: "Render-smoke kapu fehér-képernyő ellen",
          body: "Egy automata böngészős ellenőrzés betölti a kulcs-oldalakat minden kiadás előtt, és elbukik, ha az oldal nem renderel rendesen. Elkapja azokat az összeomlásokat, amiket a szokásos tesztek nem vesznek észre.",
        },
        {
          icon: "school-science-test-flask",
          title: "Lazy 3D DNS-adatháló háttér",
          body: "Saját 3D motor, DNS-kettőshélixekből álló, glóriázó adathálóval. Csak asztali gépen és sötét módban töltődik be (mobilon könnyű háttér lép a helyére), külön betöltve: prémium vizuál a mobil sebesség feláldozása nélkül.",
        },
        {
          icon: "photography-photo-image",
          title: "Termékfotó-pipeline",
          body: "Automatikus háttér-eltávolítás és többféle modern formátumú képoptimalizálás a teljes peptid-katalógusra: egységes, profi, gyorsan töltődő termékfotók kézi szerkesztés nélkül.",
        },
        {
          icon: "design-layer",
          title: "3D kocka-navigáció és kártya-vizuálok",
          body: "A négy könyvtár közti váltás egy interaktív 3D kockán történik, a kategóriáknak pedig előre renderelt, mozgó 3D vizuáljaik vannak: prémium, dinamikus felület futásidejű 3D-terhelés nélkül.",
        },
      ],
      debrief: [
        "Élő: molekulax.hu, három nyelven (HU / EN / PL).",
        "A hivatkozás-higiénia gépileg kikényszerített: a teljes katalógus hivatkozás-állománya élő PubMed-ellenőrzésen megy át minden változásnál.",
        "Ötrétegű automata ellenőrzés védi a tartalmat és a megjelenítést.",
        "Telepíthető, offline is használható app, gyors betöltéssel: a böngésző mindig csak az aktuális nyelv adatát tölti le.",
      ],
      artifacts: [
        "Egyedi kódbázis, 191 hatóanyag-profil",
        "PubMed-hitelesítő eszköz",
        "HU/EN/PL tartalmi réteg",
        "5-rétegű automata ellenőrző folyamat",
        "3D DNS-háttér + termékfotó-feldolgozás",
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
    a: "Amit garantálunk: minden hónapban megmérjük és megmutatjuk, mi történik az oldaladdal - gyors-e, megtalálható-e, friss-e, hányan jártak rajta. Garantált ügyfélszámot nem ígérünk, mert azt egy új oldalnál tisztességesen senki sem tudja; aki mégis ígér, az tippel. Mi mérünk és azon dolgozunk, hogy gyors, megtalálható és friss légy, a számokat pedig feketén-fehéren látod.",
  },
  {
    q: "Mennyibe kerül?",
    a: "Komoly weboldal és havi gondozás, nem pár tízezres sablon. Az ár az igényeidhez igazodik: az egyoldalas bemutatkozótól az egyedi, többoldalas megoldásig, plusz a havi Élő Gondozás. Mondd el egy rövid hívásban, mire van szükséged, és pontos, rád szabott árat adunk, kötelezettség nélkül.",
  },
  {
    q: "Miért veled dolgozzak, és ne egy ügynökséggel?",
    a: "Mert közvetlenül a döntéshozóval dolgozol, nem veszel el egy gépezetben, és nincs ügyfélszolgálati lánc. Gyorsabb, személyesebb, és pontosan azt kapod, amire szükséged van. Ráadásul egy 5-15 fős ügynökség rezsije és felárai nélkül a prémium minőség jóval kedvezőbb áron jön ki.",
  },
];
