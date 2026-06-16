"use client";

// Left-dim wash so the hero copy keeps a high-contrast left edge while the live
// scroll-reactive nebula (StageBackground, behind) reads across the full width.
//
// The hero NO LONGER hosts a drei <View>: that View's scissor region rendered
// OPAQUE BLACK on real GPUs (transparent only under headless swiftshader), which
// punched a full-width black rectangle over the nebula on the owner's machine.
// The reactive nebula is the hero's visual now, so the hero is just this wash.
const WASH =
  "absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,8,0.66)_0%,rgba(5,5,8,0.32)_46%,rgba(5,5,8,0.06)_76%,transparent_100%)]";

export function HeroView() {
  return <div aria-hidden className={WASH} />;
}
