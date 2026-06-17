/**
 * Tiny pub/sub so anything in the app can push a line into the reactive right
 * console (e.g. a project row on hover). The console itself also generates its
 * own lines (load, scroll/section, route, clicks) + an idle deploy-story; this
 * bus is just the shared entry point so external emitters stay one-liners.
 */
export type ConsoleLine = { text: string; id: number };

let counter = 0;
const listeners = new Set<(l: ConsoleLine) => void>();

export function pushConsole(text: string): void {
  const line = { text, id: counter++ };
  listeners.forEach((fn) => fn(line));
}

export function subscribeConsole(fn: (l: ConsoleLine) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
