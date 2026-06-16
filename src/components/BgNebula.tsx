"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";

/**
 * BgNebula — full-viewport volumetric nebula / plasma backdrop.
 *
 * A single fullscreen fragment shader on void (#050508). Domain-warped fbm
 * (fbm of fbm) builds soft, slowly drifting cloud wisps tinted lime / cyan /
 * magenta. Kept deliberately DARK + SUBTLE: peak wisp brightness ~0.30 and a
 * heavy vignette, so body text stays readable over it. The cursor lazily
 * parallaxes + warps the cloud; a slow uTime drift keeps it alive on touch /
 * without a pointer. Conventions match NetworkField: client canvas, central
 * motion gate (one static frame on reduce), DPR capped at 1.75, pauses when
 * the tab is hidden, full teardown on unmount.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;

  // portfolio palette
  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);

  // -- value noise (hash + bilerp) ------------------------------------
  float hash(vec2 p){
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  // -- fbm: 5 octaves -------------------------------------------------
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++){
      v += amp * vnoise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv0 = (vUv * uRes - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.075; // more fluid flow

    // stronger mouse parallax + warp = more responsive
    vec2 m = (uMouse - 0.5) * 2.0;
    vec2 uv = uv0 + m * 0.30;

    vec2 q = vec2(
      fbm(uv * 1.6 + vec2(0.0, t)),
      fbm(uv * 1.6 + vec2(5.2, -t * 0.8))
    );
    vec2 r = vec2(
      fbm(uv * 1.6 + 3.4 * q + vec2(1.7 - t * 0.5, 9.2) + m * 0.6),
      fbm(uv * 1.6 + 3.4 * q + vec2(8.3, 2.8 + t * 0.6) + m * 0.9)
    );
    float cloud = fbm(uv * 1.6 + 4.0 * r + vec2(t * 0.45, -t * 0.35));
    cloud = smoothstep(0.32, 0.95, cloud);
    cloud = pow(cloud, 1.4);

    // cursor TORCH: the nebula is DARK; the pointer lights it up like a flashlight
    vec2 mAC = (uMouse * uRes - 0.5 * uRes) / uRes.y;
    float md = length(uv0 - mAC);
    float torch = exp(-md * md * 1.8); // wide, strong light pool

    // hue biased to the SITE palette: mostly lime <-> cyan, only a whisper of magenta
    float hue = clamp(0.5 + 0.5 * (q.x - r.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.45);

    // DARK base; wisps barely there in ambient, REVEALED + lit by the torch
    vec3 col = vec3(0.011, 0.012, 0.017);
    col += tint * cloud * 0.10;                      // faint ambient wisps (dark)
    col += tint * cloud * torch * 1.05;              // the torch reveals + lights the cloud
    col += tint * torch * 0.10;                      // soft halo at the pointer
    col += CYAN * pow(cloud, 3.0) * torch * 0.28;    // crisp lit rim near the torch

    float vig = smoothstep(1.3, 0.2, length(uv));
    col *= 0.5 + 0.5 * vig;
    col *= 0.92;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function BgNebula() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (typeof window === "undefined") return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL — leave the void backdrop as-is
    }
    renderer.setClearColor(0x050508, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
        3
      )
    );

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // smoothed pointer in 0..1 — target set on move, eased toward each frame
    const target = new THREE.Vector2(0.5, 0.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };

    const onMove = (e: MouseEvent) => {
      target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    const reduced = reducedMotion();
    const start = performance.now();
    let raf = 0;

    const renderFrame = (now: number) => {
      uniforms.uTime.value = (now - start) / 1000;
      // ease the smoothed mouse toward the latest target (snappier = more responsive)
      uniforms.uMouse.value.lerp(target, 0.14);
      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // one static frame — a frozen nebula reads as intentional
      renderFrame(start + 4200); // offset so the static frame has formed wisps
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (raf === 0) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
