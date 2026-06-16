// Per-project 3D signature mapping. Source of truth for kind + accent is the
// REAL project list (src/data/projects.ts) — there are exactly three projects,
// no 4th, no `orange` project. Each gets a distinct signature object so the
// /work cases and the home index read as a family, not a repeat.

export type SignatureKind = "wire" | "distort" | "knot";

const KIND_BY_ID: Record<string, SignatureKind> = {
  "f3xykee-terminal": "wire", // military-HUD lattice -> wireframe icosahedron
  molekulax: "distort", // peptide / molecule -> distorted sphere
  "donna-pizza": "knot", // warm flourish -> glossy metallic torus knot
};

// The four brand accents, hex (mirrors BrowserPreview's ACCENT_HEX).
export const ACCENT_HEX: Record<string, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

export function signatureKind(id: string): SignatureKind {
  return KIND_BY_ID[id] ?? "wire";
}

export function accentHex(color: string): string {
  return ACCENT_HEX[color] ?? ACCENT_HEX.lime;
}
