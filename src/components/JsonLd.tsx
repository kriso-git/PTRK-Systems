const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://ptrksystems.hu/#org",
      name: "PTRK-Systems",
      description:
        "Prémium, modern weboldalak magyar vállalkozásoknak, havi Élő Gondozással: karbantartás, figyelés, forgalom-mérés és igény szerinti fejlesztés. Weboldal-stúdió, közvetlen kapcsolat.",
      url: "https://ptrksystems.hu",
      email: "hello@ptrksystems.hu",
      areaServed: { "@type": "Country", name: "Hungary" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Budapest",
        addressCountry: "HU",
      },
      knowsAbout: [
        "weboldal készítés",
        "weboldal karbantartás",
        "weboldal gondozás",
        "weboldal üzemeltetés",
        "weboldal felújítás",
        "céges weboldal",
        "SEO",
        "Next.js",
      ],
      logo: {
        "@type": "ImageObject",
        "@id": "https://ptrksystems.hu/#logo",
        url: "https://ptrksystems.hu/logo-full.png",
        caption: "PTRK-Systems",
      },
      image: { "@id": "https://ptrksystems.hu/#logo" },
    },
    {
      "@type": "WebSite",
      "@id": "https://ptrksystems.hu/#website",
      url: "https://ptrksystems.hu",
      name: "PTRK Systems",
      inLanguage: "hu",
      publisher: { "@id": "https://ptrksystems.hu/#org" },
    },
    {
      "@type": "Service",
      "@id": "https://ptrksystems.hu/#elo-gondozas",
      serviceType: "Weboldal gondozás és karbantartás",
      name: "Élő Gondozás",
      description:
        "Havi előfizetéses weboldal-gondozás: karbantartás, figyelés, forgalom-mérés és igény szerinti fejlesztés, hogy az oldalad gyors, megtalálható és friss maradjon.",
      provider: { "@id": "https://ptrksystems.hu/#org" },
      areaServed: { "@type": "Country", name: "Hungary" },
      inLanguage: "hu",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Élő Gondozás csomagok",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Élő Gondozás",
              description:
                "Karbantartás és figyelés (domain, hosting, SSL, biztonsági frissítés, uptime, mentés); modern, biztonságos, Google-safe megoldások; havi 1 ingyenes módosítás; közvetlen kapcsolat; forgalom-mérés a háttérben.",
            },
            category: "Csomag I",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Élő Gondozás Max",
              description:
                "Minden az Alap csomagból, plusz havi 2-3 módosítás prioritással és havi Láthatósági Jelentés (automatikus PDF a hó végén).",
            },
            category: "Csomag II",
          },
        ],
      },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(SCHEMA).replace(/</g, "\\u003c"),
      }}
    />
  );
}
