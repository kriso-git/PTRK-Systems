"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { reducedMotion } from "@/lib/motion";

/**
 * ScrollJourney — a scroll-driven flight down a nebula-plasma tunnel.
 *
 * A tall (300vh) section supplies the scroll distance; a `fixed` WebGL canvas
 * pins to the viewport and a single fullscreen fragment shader renders a
 * domain-warped fbm tunnel in the site palette (lime / cyan / magenta) — the
 * SAME nebula language as the page background, so it reads as the base bg
 * pulled into a tunnel rather than a black box. Scroll advances the tunnel
 * depth (fly-forward); four station overlays cross-fade ENTER → STRATEGY →
 * BUILD → SHIP. The cursor parallaxes the vanishing point + lights a torch.
 *
 * Full cinematic takeover: the canvas + overlays are portaled to <body> at a
 * z ABOVE the live terminal aside + progress chips (root z-12 / z-30) but
 * BELOW the nav (z-40), so during the flight only the nav remains — no HUD
 * bleed over the tunnel. We use `fixed` + manual active-gating rather than
 * `position: sticky` because the Lenis smooth-scroll layer makes sticky
 * unreliable; the gate reads getBoundingClientRect (which Lenis's native
 * scroll updates) and fades the canvas at the edges so it never covers the
 * sections before / after the pin.
 *
 * Motion-gated: on reduce we drop the pin + portal and render one static
 * frame in a single-screen in-flow section with only the ENTER station.
 * DPR capped, pauses on hidden tab, full teardown.
 */

const STATIONS = [
  { center: 0.05, label: "§ 00 · ENTER", title: "PTRK.SYSTEMS", sub: "Design Engineering Unit · Budapest", c: "#c2fe0c" },
  { center: 0.37, label: "§ 01 · STRATEGY", title: "Stratégiától", sub: "kutatás · IA · design rendszerek", c: "#01ffff" },
  { center: 0.64, label: "§ 02 · BUILD", title: "a frontendig", sub: "production-grade kód · CI/CD", c: "#ea027e" },
  { center: 0.93, label: "§ 03 · SHIP", title: "élesben.", sub: "discovery → live deploy", c: "#ff8c42" },
];

const STATION_W = 0.17; // cross-fade half-width
const RAMP = 0.55; // edge crossfade as a fraction of viewport height (long = smooth dissolve)

// RawShaderMaterial — used verbatim (no Three prefix injection), so it renders
// byte-for-byte like a hand-written WebGL program. Hence the explicit precision
// + attribute declarations here.
const VERT = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  varying vec2 vUv;
  void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uProgress;   // 0..1 scroll → fly forward
  uniform float uTime;       // seconds → slow drift / life
  uniform vec2  uRes;
  uniform vec2  uMouse;      // smoothed, -1..1 centered

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);
  const float PI = 3.14159265;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++){ v += a * vnoise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }

  // Nebula tunnel — same visual theme as the site background (BgNebula): a
  // dark base with domain-warped lime/cyan wisps (whisper of magenta) revealed
  // by the cursor torch, only pulled into a 1/r tunnel perspective. The angular
  // basis is the closed-loop unit vector dir = p/r (= cos/sin), so the wall
  // wraps with NO atan branch-cut seam. flow = A/r + depth advances OUTWARD as
  // you scroll down (flying FORWARD into the tunnel). The vanishing point is
  // kept dim so the centered headline stays readable.
  void main(){
    vec2 p = (vUv * uRes - 0.5 * uRes) / uRes.y;   // aspect-correct, centered
    vec2 m = uMouse;
    p -= m * 0.12;                                 // cursor parallaxes the vanishing point
    float r = length(p) + 1e-4;
    vec2 dir = p / r;                              // closed-loop angular basis (= cos,sin) — seamless
    float depth = uProgress * 4.0 + uTime * 0.06;
    float flow = 0.42 / r + depth;                 // forward: features rush OUTWARD on scroll-down

    // BgNebula-style domain-warped fbm, but on (seamless angular, forward depth)
    vec2 cb = dir * 1.7;
    vec2 q  = vec2(fbm(cb + vec2(0.0, flow)), fbm(cb + vec2(5.2, flow * 0.8)));
    vec2 rr = vec2(fbm(cb + 3.4 * q + vec2(1.7, flow * 0.5) + m * 0.5),
                   fbm(cb + 3.4 * q + vec2(8.3, flow * 0.6) + m * 0.8));
    float cloud = fbm(cb + 4.0 * rr + vec2(flow * 0.45, -flow * 0.35));
    cloud = smoothstep(0.30, 0.95, cloud);
    cloud = pow(cloud, 1.3);

    // cursor torch — the reveal light, same as BgNebula
    vec2 cur = m * vec2(uRes.x / uRes.y, 1.0) * 0.5;
    float md = length(p - cur);
    float torch = exp(-md * md * 1.7);

    // palette biased to the site (BgNebula): lime <-> cyan, whisper of magenta
    float hue = clamp(0.5 + 0.5 * (q.x - rr.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.45);

    vec3 col = vec3(0.011, 0.012, 0.017);          // dark base (matches BgNebula)
    col += tint * cloud * 0.42;                     // primary: rich always-visible plasma walls
    col += CYAN * pow(cloud, 3.0) * 0.12;           // self-lit crisp cores
    col += tint * cloud * torch * 0.5;              // cursor torch enhances toward the pointer
    col += tint * torch * 0.08;                     // soft pointer halo

    float ribs = smoothstep(0.92, 1.0, sin(flow * PI)); // faint forward-motion ribs
    col += tint * ribs * 0.12;

    float centerDark = smoothstep(0.0, 0.45, r);   // keep the vanishing point dim (scrim handles text)
    col *= mix(0.55, 1.0, centerDark);

    float vig = smoothstep(1.4, 0.18, r);           // tunnel-mouth vignette
    col *= 0.5 + 0.5 * vig;
    col = col / (col + 0.85);                        // soft rolloff → no blowout

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function ScrollJourney() {
  const [reduced] = useState(() => (typeof window === "undefined" ? false : reducedMotion()));
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return; // animated canvas is portaled — waits for mounted

    // Plain raw WebGL — this is a single fullscreen fragment-shader pass, so a
    // hand-written program is lighter and clearer than wiring up a three.js
    // scene/camera/material just to draw one triangle.
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) return; // no WebGL — the section just shows its bg + station text

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("ScrollJourney shader:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("ScrollJourney link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const uProgress = gl.getUniformLocation(prog, "uProgress");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    let tx = 0, ty = 0; // raw pointer target, -1..1
    let mx = 0, my = 0; // eased pointer
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const start = performance.now();
    resize();
    window.addEventListener("resize", resize);

    const drawFrame = (progressV: number, timeV: number) => {
      gl.uniform1f(uProgress, progressV);
      gl.uniform1f(uTime, timeV);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const disposeGL = () => {
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };

    // ---------------------------------------------------------------- reduced
    if (reduced) {
      drawFrame(0.12, 4.0);
      const s0 = stationRefs.current[0];
      if (s0) s0.style.opacity = "1";
      return () => {
        window.removeEventListener("resize", resize);
        disposeGL();
      };
    }

    // ---------------------------------------------------------------- animated
    window.addEventListener("mousemove", onMove, { passive: true });

    let progress = 0;
    let vis = 0;
    const readScroll = () => {
      const vh = window.innerHeight;
      // long crossfade (over ~half a screen) so the tube DISSOLVES in/out of the
      // page instead of snapping — fixes the abrupt "jump into the tube" feel.
      const ramp = vh * RAMP;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - vh;
      progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (rect.top > 0) vis = 1 - Math.min(1, rect.top / ramp);
      else if (rect.bottom < vh) vis = Math.max(0, (rect.bottom - (vh - ramp)) / ramp);
      else vis = 1;
      vis = Math.min(1, Math.max(0, vis));
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      canvas.style.opacity = String(vis);
      // Stations track the (Lenis-smoothed) scroll directly — no extra easing,
      // which would lag the cross-fade and ghost two stations at once.
      for (let i = 0; i < STATIONS.length; i++) {
        const el = stationRefs.current[i];
        if (el) el.style.opacity = String(vis * Math.max(0, 1 - Math.abs(progress - STATIONS[i].center) / STATION_W));
      }
      if (hintRef.current) hintRef.current.style.opacity = String(vis * Math.max(0, 1 - progress / 0.12));
      if (vis <= 0.001) return; // off-screen — skip only the expensive draw
      mx += (tx - mx) * 0.08; // eased parallax (cursor only)
      my += (ty - my) * 0.08;
      drawFrame(progress, (now - start) / 1000);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (raf === 0) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      disposeGL();
    };
  }, [reduced, mounted]);

  const station = (s: (typeof STATIONS)[number], i: number, z: string) => (
    <div
      key={i}
      ref={(el) => { stationRefs.current[i] = el; }}
      className={`pointer-events-none fixed inset-0 ${z}`}
      style={{ opacity: 0 }}
    >
      {/* soft dark scrim so the title stays legible over bright plasma */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 54% 42% at 50% 52%, rgba(5,5,8,0.82), rgba(5,5,8,0.35) 55%, transparent 78%)" }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 font-monospec text-xs uppercase tracking-[0.4em]" style={{ color: s.c }}>{s.label}</div>
        <h2 className="font-khinterference text-[clamp(48px,9vw,150px)] font-extrabold uppercase leading-[0.85] tracking-tight text-primary">
          {s.title}
        </h2>
        <div className="mt-6 font-monospec text-sm uppercase tracking-[0.3em] text-secondary">{s.sub}</div>
      </div>
    </div>
  );

  // --- reduced: one calm static screen, in-flow (no pin, no portal) -------
  if (reduced) {
    return (
      <section
        ref={wrapRef}
        data-section="§ 00→"
        data-label="Stratégiától élesig"
        className="relative h-screen w-full overflow-hidden bg-[#050508]"
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden />
        <div
          ref={(el) => { stationRefs.current[0] = el; }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
          style={{ opacity: 1 }}
        >
          <div className="mb-5 font-monospec text-xs uppercase tracking-[0.4em]" style={{ color: STATIONS[0].c }}>{STATIONS[0].label}</div>
          <h2 className="font-khinterference text-[clamp(48px,9vw,150px)] font-extrabold uppercase leading-[0.85] tracking-tight text-primary">
            {STATIONS[0].title}
          </h2>
          <div className="mt-6 font-monospec text-sm uppercase tracking-[0.3em] text-secondary">{STATIONS[0].sub}</div>
        </div>
      </section>
    );
  }

  // --- animated: 300vh scroll-spacer + portaled full-takeover overlay -----
  return (
    <>
      <section
        ref={wrapRef}
        data-section="§ 00→"
        data-label="Stratégiától élesig"
        className="relative h-[300vh] w-full"
      />
      {mounted &&
        createPortal(
          <>
            {/* z-[35]: above the live terminal aside (z-12) + progress chips
                (z-30), below the nav (z-40) — full takeover, nav stays usable */}
            <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[35] h-full w-full" style={{ opacity: 0 }} aria-hidden />
            {STATIONS.map((s, i) => station(s, i, "z-[36]"))}
            <div
              ref={hintRef}
              className="pointer-events-none fixed bottom-6 left-1/2 z-[36] -translate-x-1/2 font-monospec text-[11px] uppercase tracking-[0.3em] text-secondary/50"
              style={{ opacity: 0 }}
            >
              ↓ görgess
            </div>
          </>,
          document.body
        )}
    </>
  );
}
