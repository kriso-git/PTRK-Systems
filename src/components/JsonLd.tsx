const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://ptrksystems.com/#org",
      name: "PTRK-Systems",
      description:
        "Prémium, modern weboldalak magyar vállalkozásoknak, havi Élő Gondozással: karbantartás, figyelés, forgalom-mérés és igény szerinti fejlesztés. Weboldal-stúdió, közvetlen kapcsolat.",
      url: "https://ptrksystems.com",
      email: "hello@ptrksystems.com",
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
        "céges weboldal",
        "SEO",
        "Next.js",
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(SCHEMA).replace(/</g, "\\u003c"),
      }}
    />
  );
}
