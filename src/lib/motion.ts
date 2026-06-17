/**
 * Central motion gate. The signature effects (decode, scroll-reveal, boot,
 * ascii field, sweeps) run for everyone BY DEFAULT, the brand layer is the
 * product here. Two explicit opt-outs disable them:
 *   1. OS-level `prefers-reduced-motion: reduce`, the standard a11y signal,
 *      honored by reducedMotion() and a CSS @media kill-switch in globals.css.
 *   2. localStorage "ptrk-motion" = "off", mirrored onto html[data-motion-reduce].
 */

const KEY = "ptrk-motion";

export function motionOff(): boolean {
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}

/** The single source of truth for "should we animate?" (JS side). */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  if (motionOff()) return true;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function setMotionOff(off: boolean) {
  try {
    if (off) localStorage.setItem(KEY, "off");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  applyMotionAttr();
}

/** Idempotent – mirror the stored preference onto <html> for CSS gates. */
export function applyMotionAttr() {
  if (typeof document === "undefined") return;
  document.documentElement.toggleAttribute("data-motion-reduce", motionOff());
}
