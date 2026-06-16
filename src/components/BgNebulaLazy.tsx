"use client";

import dynamic from "next/dynamic";

// Lazy — keep three.js off the critical bundle; the nebula backdrop loads after paint.
const BgNebula = dynamic(() => import("./BgNebula").then((m) => m.BgNebula), {
  ssr: false,
});

export function BgNebulaLazy() {
  return <BgNebula />;
}
