"use client";

import dynamic from "next/dynamic";

// Heavy (opentype + SVGLoader + RoomEnvironment) — lazy, off the critical path.
const Text3D = dynamic(() => import("./Text3D").then((m) => m.Text3D), { ssr: false });

export function Text3DLazy({ word, color }: { word: string; color?: string }) {
  return <Text3D word={word} color={color} />;
}
