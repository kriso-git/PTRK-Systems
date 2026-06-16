"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pulseRoute } from "@/lib/r3f/route-signal";

/** Pulses the route-transition signal on every client navigation. Renders
 *  nothing. The first run (initial mount) is suppressed inside pulseRoute() so a
 *  fresh page load does not flash a veil. */
export function RouteSignalBridge() {
  const pathname = usePathname();
  useEffect(() => {
    pulseRoute();
  }, [pathname]);
  return null;
}
