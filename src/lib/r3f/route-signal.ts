// Route-transition signal – a module singleton pulsed on every client route
// change by <RouteSignalBridge/>. The veil canvas's <RouteVeil/> subscribes via
// onPulse() to drive a short on-demand render burst, and reads veilProgress()
// for the 0..1 wash envelope. Dependency-free; safe to import on the server.

const VEIL_MS = 700; // wash duration
const FIRST_LOAD_SUPPRESS_MS = 400; // ignore pulses this close to module init

type RouteState = { startedAt: number; intensity: number };

const state: RouteState = { startedAt: -1e9, intensity: 0 };
const listeners = new Set<() => void>();

// Captured at client module init. Any pulse within FIRST_LOAD_SUPPRESS_MS of it
// is treated as the initial mount (this covers React Strict Mode's dev
// double-invoke too, which a one-shot boolean latch did NOT) and suppressed, so a
// fresh page load never flashes a veil.
const initAt = typeof window === "undefined" ? 0 : performance.now();

/** Subscribe to genuine route pulses. Returns an unsubscribe. The veil uses this
 *  to kick an on-demand render burst so its canvas can idle at 0 fps otherwise. */
export function onPulse(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Pulse a transition. Called by the bridge on pathname change. Pulses inside the
 *  initial-mount window are suppressed (no wash, no notify). */
export function pulseRoute() {
  if (typeof window === "undefined") return;
  const now = performance.now();
  if (now - initAt < FIRST_LOAD_SUPPRESS_MS) {
    // backdate so veilProgress/isWashing both read "finished" immediately
    state.startedAt = now - FIRST_LOAD_SUPPRESS_MS - VEIL_MS;
    return;
  }
  state.intensity = 0.95;
  state.startedAt = now;
  listeners.forEach((fn) => fn());
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

/** True while a wash is still playing – drives the veil's on-demand render burst. */
export function isWashing(now: number): boolean {
  return now - state.startedAt < VEIL_MS;
}
