// A tiny, dependency-free signal that bridges native scroll + cursor into the
// R3F Stage. Lenis drives NATIVE scroll, so window.scrollY is already smoothed –
// no need to expose the Lenis instance. Read synchronously inside useFrame.
type Signal = { progress: number; velocity: number; mx: number; my: number };

const signal: Signal = { progress: 0, velocity: 0, mx: 0.5, my: 0.5 };
let prev = 0;
let bound = 0;

export function readSignal(): Readonly<Signal> {
  return signal;
}

/** Wire passive scroll + mousemove listeners. Returns an unbind fn. Ref-counted
 *  so multiple mounts are safe. */
export function bindSignals(): () => void {
  if (typeof window === "undefined") return () => {};
  bound += 1;
  if (bound === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    onScroll();
  }
  return () => {
    bound -= 1;
    if (bound === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    }
  };
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  signal.velocity = p - prev;
  prev = p;
  signal.progress = p;
}

function onMove(e: MouseEvent) {
  signal.mx = e.clientX / window.innerWidth;
  signal.my = 1 - e.clientY / window.innerHeight;
}
