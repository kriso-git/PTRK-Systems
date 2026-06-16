"use client";

import dynamic from "next/dynamic";

// Client-only (drei <View> + window reads) — avoids SSR/hydration mismatch,
// matching HeroViewLazy. A Server Component (the Method page) can render this.
const MethodSignature = dynamic(
  () => import("./MethodSignature").then((m) => m.MethodSignature),
  { ssr: false }
);

export function MethodSignatureLazy() {
  return <MethodSignature />;
}
