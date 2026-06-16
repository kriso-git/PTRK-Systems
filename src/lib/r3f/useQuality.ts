// Device-derived quality tier for the R3F Stage. Decided ONCE at mount.
// "full"  = desktop / fine pointer / large viewport -> the full WebGL experience
//           (nebula bg + per-card <View> signatures + Bloom).
// "lite"  = touch / small viewport / reduced-motion -> the light variant
//           (one cheap nebula context, static signatures, no heavy View stack).
// This is also the re-skin / quality hook for future client demos.
import { useState } from "react";
import { reducedMotion } from "@/lib/motion";

export type Quality = "full" | "lite";

export function getQuality(): Quality {
  if (typeof window === "undefined") return "full";
  if (reducedMotion()) return "lite";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 820;
  return coarse || small ? "lite" : "full";
}

export function useQuality(): Quality {
  const [q] = useState<Quality>(() => getQuality());
  return q;
}
