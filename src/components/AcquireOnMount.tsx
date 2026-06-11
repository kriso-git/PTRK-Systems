"use client";

import { useEffect } from "react";
import { acquireNode } from "@/lib/nodes";

/** Acquires a node when a page is discovered (e.g. 404, /font-preview). */
export function AcquireOnMount({ id }: { id: string }) {
  useEffect(() => {
    acquireNode(id);
  }, [id]);
  return null;
}
