"use client";

import { useEffect } from "react";
import { bindSignals } from "@/lib/r3f/scroll-signal";

/** Renders nothing; owns the scroll/cursor listeners for the app lifetime.
 *  Mounted once in the root layout. */
export function ScrollSignalBridge() {
  useEffect(() => bindSignals(), []);
  return null;
}
