"use client";

import dynamic from "next/dynamic";

// Keep three.js off /lab's initial bundle — the effect runners load after paint.
const LabEffect = dynamic(() => import("./LabEffect").then((m) => m.LabEffect), {
  ssr: false,
});

export function LabEffectLazy({ fx }: { fx: string }) {
  return <LabEffect fx={fx} />;
}
