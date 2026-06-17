// A tiny signal that fires when the SystemBoot loader has finished (or was skipped
// for a returning / reduced-motion visitor). One-shot load animations (e.g. the
// hero telemetry count-ups) wait for it so they play WHEN THE USER SEES THEM,
// instead of running hidden behind the boot overlay.

let ready = false;
const listeners = new Set<() => void>();

export function isBootReady(): boolean {
  return ready;
}

/** Subscribe; fires immediately if already ready. Returns an unsubscribe. */
export function onBootReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function markBootReady(): void {
  if (ready) return;
  ready = true;
  listeners.forEach((f) => f());
  listeners.clear();
}
