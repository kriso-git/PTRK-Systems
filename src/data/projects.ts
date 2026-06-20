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
    desc: "Háromnyelvű (HU/EN/PL) farmakológiai edukációs platform 191 hatóanyag-profillal, négy könyvtárban. Mozgalmas 3D vizuálok, alkalmazás-érzetű böngészés, hatóanyag-szintű beszerzés kuponokkal és gépi forrás-hitelesítés. Telepíthető, gyors app.",
    stack: ["Egyedi fejlesztés", "Háromnyelvű tartalom", "3D vizuálok", "Telepíthető app"],
    metric: "191",
    metricLabel: "Hatóanyag-profil",
    color: "cyan",
    url: "https://molekulax.hu",
    caseStudy: {
      lead: "Farmakológiai edukációs tudásbázis négy könyvtárral és 191 hatóanyag-profillal, három nyelven. Mozgalmas 3D vizuálok, alkalmazás-érzetű böngészés és hatóanyag-szintű beszerzés - minden tudományos hivatkozás pedig gépi hitelesség-kapun megy át, mielőtt élesbe kerül.",
      briefing: [
        "Edukációs platform peptidekről és társterületekről: a cél fókuszált, forrás-hű információ, zaj és csoportok nélkül, közvetlen szakértői kontakttal.",
        "A legnagyobb kockázat a tartalom-integritás volt: ahol tudományos hivatkozások szerepelnek, ott a forrás-hitelesség bizalmi alapkérdés, ezért a hivatkozás-ellenőrzés gépi kapuvá vált, nem utólagos átnézéssé.",
      ],
      execution: [
        {
          icon: "content-files-book-library",
          title: "Négy tudásbázis-könyvtár, 191 profillal",
          body: "Peptid (53), nootropikum (48), teljesítmény (68) és gyógyszer (22) könyvtár közös architektúrán, kutatási-szint besorolással és hatásterület-csempékkel. Minden könyvtár adata csak akkor töltődik le, amikor a látogató odanavigál, így villámgyors marad.",
        },
        {
          icon: "internet-network-www",
          title: "Háromnyelvű (HU/EN/PL) felület és tartalom",
          body: "Minden hatóanyag-profil három nyelven létezik (összesen 573 profil-fájl), a felület szövegei külön nyelvi szótárakban, nyelvváltóval. Egy oldal, három piac: a látogató a saját nyelvén olvas.",
        },
        {
          icon: "school-science-test-flask",
          title: "3D vizuális réteg: élő háttér és forgó molekulák",
          body: "Glóriázó, DNS-spirálokból álló élő 3D háttér, plusz 44 forgó 3D molekulaszerkezet-loop a profiloknál és 18 mozgó kategória-motívum. A nehéz 3D csak asztali nézeten töltődik le, a loopok pedig előre renderelt videók: prémium látvány a mobil sebesség feláldozása nélkül.",
        },
        {
          icon: "design-layer",
          title: "3D könyvtárváltó, mobil-swipe-pal",
          body: "A négy könyvtár közti váltás sima, akadásmentes 3D-szerű animációval; telefonon érintéssel (swipe) is lapozható, lapozó-nyilakkal. Modern, alkalmazás-érzetű böngészés, ami gördülékeny mobilon is.",
        },
        {
          icon: "shopping-shipping-discount-coupon",
          title: "Beszerzési rendszer kuponokkal, hatóanyag-szinten",
          body: "Dedikált beszerzési szekció több partnerrel, egységes kedvezmény-kuponnal, plusz minden profilnál közvetlen vásárlási gombok - a több-formás hatóanyagoknál variánsonként külön bolti linkkel. A látogató egy kattintással eljut a megbízható vásárlási helyhez.",
        },
        {
          icon: "interface-essential-settings-toggle-horizontal",
          title: "Variáns-kapcsoló a több-formás hatóanyagokhoz",
          body: "Ahol egy hatóanyag több formában létezik (eltérő észterek, beadási módok), a profil egyetlen kapcsolóval váltható, és minden adat (adagolás, biztonság, kép, bolti link) az adott formához igazodik. Pontos, félreértés-mentes információ.",
        },
        {
          icon: "coding-apps-websites-shield-lock",
          title: "Per-hatóanyag biztonsági és vérkép-panelek",
          body: "Minden profilnál külön Biztonság-panel (mellékhatások, kontraindikációk), és ahol releváns, laborvizsgálati protokoll, harm-reduction szemlélettel. Felelős, hiteles tartalom, ami bizalmat épít.",
        },
        {
          icon: "interface-essential-search-check",
          title: "PubMed forrás-verifikáció",
          body: "Saját, PubMed-alapú ellenőrző eszköz: minden idézett tanulmány azonosítóját lekérdezi a PubMed-ről, és cím-egyezés alapján rendben, eltérés vagy nem-található státuszra osztályozza. Garantálja, hogy a megjelenített hivatkozások valódiak, nem kitaláltak.",
        },
        {
          icon: "interface-essential-view-eye",
          title: "Négyrétegű automata minőség-kapu",
          body: "Minden változtatás előtt fut a teszt-készlet, a háromnyelvű konzisztencia-ellenőrzés, egy böngészős render-ellenőrzés (fehér-képernyő ellen) és a forrás-hitelesítés. A hibák a látogató elé jutás előtt kiszűrődnek.",
        },
        {
          icon: "photography-photo-image",
          title: "Hiteles termékfotók és telepíthető, gyors app",
          body: "Hatóanyagonként optimalizált, modern formátumú termékfotók (a peptideknél valódi injekciósüveg-képek). Az oldal telepíthető alkalmazásként, offline is működik, és csak az épp szükséges adatot tölti le, gyors első betöltéssel.",
        },
      ],
      debrief: [
        "Élő: molekulax.hu, három nyelven (HU / EN / PL), 191 hatóanyag-profillal (573 profil-fájl).",
        "A nehéz 3D vizuálok perf-biztosak: az élő háttér csak asztali nézeten töltődik le, a forgó loopok pedig előre renderelt videók, nem futásidejű terhelés.",
        "A forrás-higiénia gépileg kikényszerített: a teljes katalógus hivatkozás-állománya élő ellenőrzésen megy át minden változásnál.",
        "Négyrétegű automata minőség-kapu (tesztek, háromnyelvű konzisztencia, render-ellenőrzés, forrás-hitelesítés) védi a tartalmat és a megjelenítést.",
        "Telepíthető, offline is használható app, gyors betöltéssel: a böngésző mindig csak az aktuális nyelv adatát tölti le.",
      ],
      artifacts: [
        "Egyedi kódbázis, 191 hatóanyag-profil (4 könyvtár, 3 nyelv)",
        "3D vizuális réteg: élő háttér + 44 molekula- és 18 kategória-loop",
        "Hatóanyag-szintű beszerzési rendszer kuponokkal",
        "Forrás-hitelesítő eszköz + négyrétegű minőség-kapu",
        "Telepíthető, offline app + HU/EN/PL tartalmi réteg",
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
