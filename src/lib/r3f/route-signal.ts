// Route-transition signal — a module singleton pulsed on every client route
// change by <RouteSignalBridge/>. The veil canvas's <RouteVeil/> reads it each
// frame (no React re-render) and plays a single nebula-wash. Velocity is sampled
// from the scroll-signal at pulse time so a fast scroll into a nav-click washes
// slightly brighter. Dependency-free; safe to import on the server (guards).
import { readSignal } from "./scroll-signal";

const VEIL_MS = 700; // wash duration
const FIRST_LOAD_SUPPRESS_MS = 400; // do not wash on the very first mount

type RouteState = { startedAt: number; intensity: number; firstDone: boolean };

const state: RouteState = { startedAt: -1e9, intensity: 0, firstDone: false };

/** Pulse a transition. Called by the bridge on pathname change. The first call
 *  (initial mount) is suppressed so a hard refresh does not flash a veil. */
export function pulseRoute() {
  if (typeof window === "undefined") return;
  if (!state.firstDone) {
    state.firstDone = true;
    // suppress the mount pulse but record a baseline so timing math is sane
    state.startedAt = performance.now() - FIRST_LOAD_SUPPRESS_MS - VEIL_MS;
    return;
  }
  const v = Math.min(1, Math.abs(readSignal().velocity) * 14);
  state.intensity = 0.85 + v * 0.15; // 0.85..1.0
  state.startedAt = performance.now();
}

/** 0..1 wash progress for `now` (performance.now()). 0 when idle/finished. */
export function veilProgress(now: number): number {
  const t = (now - state.startedAt) / VEIL_MS;
  if (t <= 0 || t >= 1) return 0;
  // ease in-out, peak around the middle so the wash crests then clears
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return e;
}

export function veilIntensity(): number {
  return state.intensity;
}
