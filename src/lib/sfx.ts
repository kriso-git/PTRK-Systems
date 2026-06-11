/**
 * Synthesized HUD sounds — pure WebAudio oscillators, ZERO audio assets.
 * The AudioContext is created lazily on the first enable (user gesture,
 * satisfies autoplay policy). Default OFF; <HudSystem /> owns the toggle.
 */

let ctx: AudioContext | null = null;
let enabled = false;
let lastTick = 0;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function setSfxEnabled(on: boolean) {
  enabled = on;
  if (on) ensureCtx();
}

export function isSfxEnabled() {
  return enabled;
}

/** ~6ms square tick for hover — quiet, high, percussive. */
export function tick() {
  if (!enabled) return;
  const now = performance.now();
  if (now - lastTick < 80) return; // throttle hover storms
  lastTick = now;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = 1240;
  gain.gain.setValueAtTime(0.04, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.012);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.014);
}

/** Short rising sweep for route changes. */
export function blip() {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(920, ac.currentTime + 0.07);
  gain.gain.setValueAtTime(0.05, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.1);
}
