"use client";

import { useEffect, useState } from "react";
import { getAcquired, NODE_COUNT } from "@/lib/nodes";

/** Discreet footer progress – renders only after mount (hydration-safe)
    and only once the visitor found at least one node. */
export function NodesCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getAcquired().length);
    const onNode = (e: Event) =>
      setCount((e as CustomEvent).detail.count as number);
    window.addEventListener("ptrk:node", onNode);
    return () => window.removeEventListener("ptrk:node", onNode);
  }, []);

  if (!count) return null;

  return (
    <span
      className="inline-flex items-center gap-2 text-magenta/80"
      title="Rejtett node-ok a rendszerben"
    >
      <span className="w-1 h-1 bg-magenta" />
      NODES {count}/{NODE_COUNT}
    </span>
  );
}
