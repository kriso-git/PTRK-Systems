"use client";

import dynamic from "next/dynamic";

// three.js corridor — lazy + client-only so it stays off the critical bundle.
const ScrollJourney = dynamic(() => import("./ScrollJourney").then((m) => m.ScrollJourney), { ssr: false });

export function ScrollJourneyLazy() {
  return <ScrollJourney />;
}
