/**
 * NODES – hidden lore-hunt layer. 7 acquirable nodes scattered across the
 * site; progress lives in localStorage, acquisitions fire a `ptrk:node`
 * CustomEvent consumed by <NodeToast /> and <NodesCounter />.
 */

export const NODES: Record<string, string> = {
  "nod-code": "NOD·0A20070A megfejtve",
  konami: "Legacy protokoll elfogadva",
  whoami: "Operátor azonosítva",
  "font-preview": "Rejtett archívum felfedezve",
  "signal-lost": "Jelvesztés túlélve",
  blueprint: "Tervrajz-hozzáférés",
  "decode-replay": "Dekóder újraindítva",
};

export const NODE_COUNT = Object.keys(NODES).length;

const KEY = "ptrk-nodes";

export function getAcquired(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((id) => id in NODES) : [];
  } catch {
    return [];
  }
}

export function acquireNode(id: string) {
  if (!(id in NODES)) return;
  try {
    const acquired = getAcquired();
    if (acquired.includes(id)) return;
    acquired.push(id);
    localStorage.setItem(KEY, JSON.stringify(acquired));
    window.dispatchEvent(
      new CustomEvent("ptrk:node", {
        detail: { id, label: NODES[id], count: acquired.length },
      }),
    );
  } catch {
    /* storage blocked – the hunt silently doesn't track */
  }
}
