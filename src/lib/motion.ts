/**
 * Central motion gate – OWNER POLICY: the signature effects (decode,
 * scroll-reveal, boot, ascii field, sweeps) run for EVERYONE by default,
 * regardless of the OS prefers-reduced-motion signal. A large share of
 * Windows machines report "reduce" purely from performance presets, and
 * the brand layer IS the product here.
 *
 * Accessibility escape hatch: the always-visible MOT tray chip stores an
 * explicit "off" preference (localStorage "ptrk-motion"), which both the
 * JS gate (reducedMotion()) and the CSS gates (html[data-motion-reduce])
 * honor everywhere.
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
  return motionOff();
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
