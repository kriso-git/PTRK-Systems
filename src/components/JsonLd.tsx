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
      address: {
        "@type": "PostalAddress",
        addressLocality: "Budapest",
        addressCountry: "HU",
      },
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
