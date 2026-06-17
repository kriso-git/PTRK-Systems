"use client";

import { useEffect } from "react";
import { acquireNode } from "@/lib/nodes";

/** Acquires a hidden lore node when a page is discovered (e.g. the 404 page). */
export function AcquireOnMount({ id }: { id: string }) {
  useEffect(() => {
    acquireNode(id);
  }, [id]);
  return null;
}
