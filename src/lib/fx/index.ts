import type { Effect } from "./lib";
import { raymarch } from "./effects/raymarch";
import { hologram } from "./effects/hologram";
import { voronoi } from "./effects/voronoi";
import { grid } from "./effects/grid";
import { galaxy } from "./effects/galaxy";
import { matrixrain } from "./effects/matrixrain";
import { tunnel } from "./effects/tunnel";
import { starfield } from "./effects/starfield";

// Addon-free effects ported from the capability probe, runnable in small in-view canvases.
export const FX: Record<string, () => Effect> = {
  raymarch,
  hologram,
  voronoi,
  grid,
  galaxy,
  matrixrain,
  tunnel,
  starfield,
};
