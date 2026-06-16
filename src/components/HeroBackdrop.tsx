"use client";

import dynamic from "next/dynamic";

// Lazy: keep three.js off the critical path; the network only loads on the client.
const NetworkField = dynamic(() => import("./NetworkField").then((m) => m.NetworkField), {
  ssr: false,
});

export function HeroBackdrop() {
  return (
    <>
      <NetworkField />
      {/* left-dim wash so the hero copy stays high-contrast over the network */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,8,0.82)_0%,rgba(5,5,8,0.45)_44%,rgba(5,5,8,0.12)_74%,transparent_100%)]" />
    </>
  );
}
