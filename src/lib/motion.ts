/**
 * Central motion gate. We honor the OS prefers-reduced-motion signal by
 * default, but the visitor can explicitly FORCE motion on via the MOT
 * tray chip (localStorage "ptrk-motion" = "force") — a user-controlled
 * override is a11y-acceptable, an ignored OS signal is not.
 *
 * Every JS-side motion check goes through reducedMotion(); the CSS-side
 * gates (scroll-reveal, kill-switch) read the html[data-motion="force"]
 * attribute applied by applyMotionAttr().
 */

const KEY = "ptrk-motion";

export function motionForced(): boolean {
  try {
    return localStorage.getItem(KEY) === "force";
  } catch {
    return false;
  }
}

export function osReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** The single source of truth for "should we animate?" (JS side). */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  if (motionForced()) return false;
  return osReducedMotion();
}

export function setMotionForce(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "force");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  applyMotionAttr();
}

/** Idempotent — mirror the stored override onto <html> for the CSS gates. */
export function applyMotionAttr() {
  if (typeof document === "undefined") return;
  document.documentElement.toggleAttribute("data-motion-force", motionForced());
}
