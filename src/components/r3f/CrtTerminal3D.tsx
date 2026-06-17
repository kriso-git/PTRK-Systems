"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COMMAND_POOL } from "@/lib/terminal-pool";
import { reducedMotion } from "@/lib/motion";

/**
 * CrtTerminal3D — the right console as an old CRT terminal. The log lines are
 * drawn to a 2D canvas where they TYPE OUT character by character (tail -f feel),
 * and a Three.js CRT shader wraps that screen in barrel curvature, scanlines,
 * an aperture-grille mask, chromatic aberration, vignette, phosphor glow + a
 * flicker. Lime phosphor (= the brand accent). Dedicated transparent canvas; the
 * curved screen's corners let the page show through. DOM terminal is the
 * zero-GPU fallback (wired in MarathonBackground).
 */

const VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// NOTE: no backticks inside this GLSL string (would break the JS template literal).
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uRes;
uniform float uReduced;

vec2 curve(vec2 uv){
  uv = uv * 2.0 - 1.0;
  vec2 o = abs(uv.yx) / vec2(6.0, 4.4);
  uv = uv + uv * o * o;
  return uv * 0.5 + 0.5;
}
float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 uv = curve(vUv);
  // outside the curved tube -> transparent, so the screen reads as rounded glass
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0); return; }

  // chromatic aberration: split the channels of the lime phosphor at the edges
  float ca = 0.0008 + 0.0012 * length(uv - 0.5);
  vec3 col;
  col.r = texture2D(uTex, vec2(uv.x + ca, uv.y)).r;
  col.g = texture2D(uTex, uv).g;
  col.b = texture2D(uTex, vec2(uv.x - ca, uv.y)).b;

  // boost the phosphor text so it pops, then floor with a powered-screen base
  col *= 1.5;
  col = max(col, vec3(0.02, 0.05, 0.015));

  // rolling scanlines (gentle)
  float scan = 0.84 + 0.16 * sin(uv.y * uRes.y * 1.55 - uTime * 9.0);
  col *= scan;
  // aperture-grille vertical mask (gentle)
  col *= 0.9 + 0.1 * sin(uv.x * uRes.x * 3.14159);
  // vignette (soft)
  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.72;
  col *= clamp(vig, 0.0, 1.0);
  // flicker + grain
  float fl = uReduced > 0.5 ? 1.0 : 0.95 + 0.05 * sin(uTime * 55.0);
  col *= fl;
  col += rand(uv * uRes + fract(uTime)) * 0.045 - 0.022;
  // a faint bright bloom band that sweeps down occasionally (CRT refresh)
  float sweep = smoothstep(0.0, 0.06, abs(fract(uv.y - uTime * 0.08) - 0.0));
  col += (1.0 - sweep) * vec3(0.06, 0.09, 0.03);

  gl_FragColor = vec4(col, 1.0);
}
`;

const FONT = "'SFMono-Regular','Menlo','Consolas','Liberation Mono',monospace";
const PHOSPHOR = "#c2fe0c";

function CrtQuad({ texture, reduced }: { texture: THREE.Texture; reduced: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTex: { value: texture },
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(230, 860) },
          uReduced: { value: reduced ? 1 : 0 },
        },
      }),
    [texture, reduced]
  );
  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uRes.value.set(state.size.width, state.size.height);
  });
  return (
    <mesh material={mat}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export function CrtTerminal3D() {
  const reduced = reducedMotion();

  // The screen canvas + its texture, created once (client only — this component
  // is dynamically imported with ssr:false).
  const tex = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 340;
    cv.height = 1240;
    const t = new THREE.CanvasTexture(cv);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  // Typing scheduler: types each line char-by-char, gaps, spawns the next, and
  // redraws the screen canvas whenever the picture changes (or the cursor blinks).
  useEffect(() => {
    const cv = tex.image as HTMLCanvasElement;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const FS = 34, LH = 52, PAD = 22;
    const MAX = Math.ceil(H / LH) + 1;

    let idx = 0;
    const pick = () => { const t = COMMAND_POOL[(idx * 37) % COMMAND_POOL.length]; idx += 1; return t; };
    type L = { text: string; typed: number; done: boolean };
    // Pre-fill the screen with settled lines so it never reads as mostly-empty,
    // then keep typing fresh lines at the bottom (they push the column up).
    const lines: L[] = [];
    const seed = Math.max(4, MAX - 3);
    for (let s = 0; s < seed; s++) { const t = pick(); lines.push({ text: t, typed: t.length, done: true }); }
    lines.push({ text: pick(), typed: 0, done: false });
    let phase: "type" | "gap" = "type";
    let nextAt = performance.now() + 90;
    let gapUntil = 0;
    let lastBlink = -1;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${FS}px ${FONT}`;
      ctx.textBaseline = "alphabetic";
      for (let i = lines.length - 1; i >= 0; i--) {
        const fromBottom = lines.length - 1 - i;
        const y = H - PAD - fromBottom * LH;
        if (y < -LH) break;
        const ln = lines[i];
        const isNew = i === lines.length - 1;
        ctx.globalAlpha = isNew ? 1 : Math.max(0.1, 1 - fromBottom * 0.055);
        ctx.fillStyle = PHOSPHOR;
        ctx.shadowColor = PHOSPHOR;
        ctx.shadowBlur = 4;
        const shown = ln.text.slice(0, ln.typed);
        ctx.fillText(shown, PAD, y);
        if (isNew) {
          const w = ctx.measureText(shown).width;
          const blinkOn = reduced || !ln.done || Math.floor(performance.now() / 420) % 2 === 0;
          if (blinkOn) ctx.fillRect(PAD + w + 3, y - FS + 4, FS * 0.55, FS * 0.92);
        }
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      tex.needsUpdate = true;
    };

    if (reduced) {
      // static screen: pre-fill a column of settled lines, no animation
      while (lines.length < MAX) lines.push({ text: pick(), typed: 0, done: true });
      lines.forEach((l) => { l.typed = l.text.length; l.done = true; });
      draw();
      return;
    }

    draw();
    const hb = setInterval(() => {
      const now = performance.now();
      let changed = false;
      if (phase === "type") {
        if (now >= nextAt) {
          const last = lines[lines.length - 1];
          last.typed = Math.min(last.typed + 1, last.text.length);
          changed = true;
          if (last.typed >= last.text.length) {
            last.done = true;
            phase = "gap";
            gapUntil = now + 360 + Math.random() * 720;
          } else {
            nextAt = now + 40 + Math.random() * 48;
          }
        }
      } else if (now >= gapUntil) {
        lines.push({ text: pick(), typed: 0, done: false });
        while (lines.length > MAX) lines.shift();
        phase = "type";
        nextAt = now + 70;
        changed = true;
      }
      // also redraw on cursor-blink edges so the caret pulses without full-rate uploads
      const blink = Math.floor(now / 420) % 2;
      if (changed || blink !== lastBlink) {
        lastBlink = blink;
        draw();
      }
    }, 30);
    return () => clearInterval(hb);
  }, [tex, reduced]);

  return (
    <Canvas
      className="!absolute !inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.setClearAlpha(0); }}
      orthographic
      camera={{ position: [0, 0, 1] }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden
    >
      <CrtQuad texture={tex} reduced={reduced} />
    </Canvas>
  );
}
