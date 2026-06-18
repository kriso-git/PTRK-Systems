/**
 * Central motion gate — OWNER POLICY: the signature effects (decode,
 * scroll-reveal, boot, ascii field, sweeps, nebula, smooth scroll) run for
 * EVERYONE by default, and the OS `prefers-reduced-motion` signal does NOT
 * disable them. A large share of Windows machines report "reduce" purely from
 * performance presets, and the brand layer IS the product here.
 *
 * ⚠️ Honoring OS reduce was tried (94eb404) and REVERTED — it blanked all
 * motion on the owner's own Windows machine. Do not re-add a prefers-reduced-
 * motion gate here or in globals.css without an explicit owner decision.
 *
 * The only opt-out is the explicit localStorage "ptrk-motion" = "off"
 * (set via setMotionOff(); mirrored onto html[data-motion-reduce]).
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
