"use client";

// THROWAWAY full-chain validation prototype v2 (council "validate first" step).
// v1 found: a fullscreen nebula mesh in the SAME canvas as the drei <View>s +
// Bloom flickers + bleeds (scissor fight), and per-view <Environment> (8x) tanks
// mobile FPS. v2 fixes: (1) nebula on its OWN dedicated bg canvas; (2) a SECOND
// transparent canvas hosts ONLY the views + Bloom (the pattern Concept 3 proved
// clean); (3) NO per-view Environment (lights only); (4) views lazy-mount via
// IntersectionObserver so offscreen cards cost nothing (scales as work is added).
// Open on a REAL phone: watch the FPS panel + flicker. Delete after the decision.

import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { View, Float, MeshDistortMaterial, MeshTransmissionMaterial, Stats } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const PALETTE = { void: "#050508", lime: "#c2fe0c", cyan: "#01ffff", magenta: "#ea027e", orange: "#ff8c42" } as const;
type Accent = "#c2fe0c" | "#01ffff" | "#ea027e" | "#ff8c42";
type ProjectKind = "distort" | "glass" | "wire" | "cubes";
interface Project { name: string; role: string; accent: Accent; kind: ProjectKind }

const BASE_PROJECTS: Project[] = [
  { name: "F3XYKEE", role: "Real-time military-HUD data network", accent: PALETTE.cyan, kind: "glass" },
  { name: "MolekulaX", role: "Pharmacology education platform", accent: PALETTE.lime, kind: "distort" },
  { name: "Donna Pizza", role: "Cinematic restaurant landing page", accent: PALETTE.orange, kind: "cubes" },
  { name: "PTRK Systems", role: "Design engineering unit", accent: PALETTE.magenta, kind: "wire" },
];
const PROJECTS: Project[] = [...BASE_PROJECTS, ...BASE_PROJECTS.map((p) => ({ ...p, name: p.name + " II" }))];

/* ---------------- scroll + cursor signal ---------------- */
const sig = { mx: 0.5, my: 0.5 };
function bindSignal() {
  const onMove = (e: MouseEvent) => { sig.mx = e.clientX / window.innerWidth; sig.my = 1 - e.clientY / window.innerHeight; };
  window.addEventListener("mousemove", onMove, { passive: true });
  return () => window.removeEventListener("mousemove", onMove);
}

/* ---------------- nebula background (its OWN dedicated canvas) ---------------- */
const NEBULA_VERT = `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const NEBULA_FRAG = `
  precision highp float; varying vec2 vUv; uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;
  const vec3 LIME=vec3(0.761,0.996,0.047); const vec3 CYAN=vec3(0.004,1.0,1.0); const vec3 MAGENTA=vec3(0.918,0.008,0.494);
  float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; mat2 r=mat2(0.8,0.6,-0.6,0.8);
    for(int i=0;i<5;i++){ v+=a*vnoise(p); p=r*p*2.02; a*=0.5; } return v; }
  void main(){
    vec2 uv0=(vUv*uRes-0.5*uRes)/uRes.y; float t=uTime*0.075; vec2 m=(uMouse-0.5)*2.0; vec2 uv=uv0+m*0.30;
    vec2 q=vec2(fbm(uv*1.6+vec2(0.0,t)),fbm(uv*1.6+vec2(5.2,-t*0.8)));
    vec2 r=vec2(fbm(uv*1.6+3.4*q+vec2(1.7-t*0.5,9.2)+m*0.6),fbm(uv*1.6+3.4*q+vec2(8.3,2.8+t*0.6)+m*0.9));
    float cloud=fbm(uv*1.6+4.0*r+vec2(t*0.45,-t*0.35)); cloud=smoothstep(0.32,0.95,cloud); cloud=pow(cloud,1.4);
    vec2 mAC=(uMouse*uRes-0.5*uRes)/uRes.y; float md=length(uv0-mAC); float torch=exp(-md*md*1.8);
    float hue=clamp(0.5+0.5*(q.x-r.y),0.0,1.0); vec3 tint=mix(LIME,CYAN,smoothstep(0.0,0.7,hue));
    tint=mix(tint,MAGENTA,smoothstep(0.85,1.0,hue)*0.45);
    vec3 col=vec3(0.011,0.012,0.017);
    col+=tint*cloud*0.10; col+=tint*cloud*torch*1.05; col+=tint*torch*0.10; col+=CYAN*pow(cloud,3.0)*torch*0.28;
    float vig=smoothstep(1.3,0.2,length(uv)); col*=0.5+0.5*vig; col*=0.92; gl_FragColor=vec4(col,1.0);
  }
`;
function NebulaMesh() {
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)); return g; }, []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) } }), []);
  const target = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  useFrame((state) => { uniforms.uTime.value = state.clock.elapsedTime; uniforms.uRes.value.set(state.size.width, state.size.height); target.set(sig.mx, sig.my); uniforms.uMouse.value.lerp(target, 0.14); });
  return (<mesh geometry={geo} frustumCulled={false}><shaderMaterial vertexShader={NEBULA_VERT} fragmentShader={NEBULA_FRAG} uniforms={uniforms} depthTest={false} depthWrite={false} /></mesh>);
}

/* ---------------- signature objects (NO per-view Environment, lights only) ---------------- */
interface ObjProps { accent: Accent; active: boolean }
function DistortBlob({ accent, active }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null); const sc = useRef(1);
  useFrame((_, d) => { const m = mesh.current; if (!m) return; const s = active ? 0.9 : 0.28; m.rotation.y += d * s; m.rotation.x += d * s * 0.45; sc.current = THREE.MathUtils.damp(sc.current, active ? 1.12 : 1, 6, d); m.scale.setScalar(sc.current); });
  return (<mesh ref={mesh}><sphereGeometry args={[1, 48, 48]} /><MeshDistortMaterial color={accent} emissive={accent} emissiveIntensity={0.6} roughness={0.2} metalness={0.2} distort={active ? 0.42 : 0.3} speed={active ? 2.4 : 1.3} /></mesh>);
}
function GlassKnot({ accent, active }: ObjProps) {
  const mesh = useRef<THREE.Mesh>(null); const sc = useRef(1);
  useFrame((_, d) => { const m = mesh.current; if (!m) return; const s = active ? 0.85 : 0.25; m.rotation.x += d * s; m.rotation.y += d * s * 0.6; sc.current = THREE.MathUtils.damp(sc.current, active ? 1.12 : 1, 6, d); m.scale.setScalar(sc.current); });
  // transmission needs an env to refract; without one it reads dark, so this card
  // uses an emissive-tinted physical material instead (cheap, no env, still glassy-ish)
  return (<mesh ref={mesh}><torusKnotGeometry args={[0.72, 0.26, 140, 20]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} roughness={0.08} metalness={0.85} /></mesh>);
}
function WireIco({ accent, active }: ObjProps) {
  const group = useRef<THREE.Group>(null); const sc = useRef(1);
  useFrame((_, d) => { const g = group.current; if (!g) return; const s = active ? 0.95 : 0.3; g.rotation.y += d * s; g.rotation.x += d * s * 0.5; sc.current = THREE.MathUtils.damp(sc.current, active ? 1.14 : 1, 6, d); g.scale.setScalar(sc.current); });
  return (<group ref={group}><mesh scale={0.62}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} roughness={0.4} metalness={0.1} /></mesh><mesh><icosahedronGeometry args={[1.15, 1]} /><meshBasicMaterial color={accent} wireframe transparent opacity={0.55} /></mesh></group>);
}
function CubeCluster({ accent, active }: ObjProps) {
  const inst = useRef<THREE.InstancedMesh>(null); const group = useRef<THREE.Group>(null); const sc = useRef(1); const dummy = useMemo(() => new THREE.Object3D(), []);
  const cubes = useMemo(() => { const out: { pos: THREE.Vector3; s: number; spin: number }[] = []; const count = 26; for (let i = 0; i < count; i++) { const phi = Math.acos(1 - (2 * (i + 0.5)) / count); const theta = Math.PI * (1 + Math.sqrt(5)) * i; const r = 0.92 + ((i * 13) % 7) / 40; out.push({ pos: new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)), s: 0.16 + ((i * 7) % 5) / 50, spin: ((i % 4) + 1) * 0.4 }); } return out; }, []);
  useFrame((state, d) => { const im = inst.current, g = group.current; if (!g || !im) return; const s = active ? 0.9 : 0.28; g.rotation.y += d * s; g.rotation.x += d * s * 0.4; sc.current = THREE.MathUtils.damp(sc.current, active ? 1.12 : 1, 6, d); g.scale.setScalar(sc.current); const t = state.clock.elapsedTime; const breathe = active ? 1.06 : 1; for (let i = 0; i < cubes.length; i++) { const c = cubes[i]; dummy.position.copy(c.pos).multiplyScalar(breathe); dummy.rotation.set(t * c.spin, t * c.spin * 0.7, 0); dummy.scale.setScalar(c.s); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); } im.instanceMatrix.needsUpdate = true; });
  return (<group ref={group}><instancedMesh ref={inst} args={[undefined, undefined, cubes.length]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} roughness={0.3} metalness={0.4} /></instancedMesh></group>);
}
function Signature({ kind, accent, active }: { kind: ProjectKind } & ObjProps) {
  const obj = kind === "distort" ? <DistortBlob accent={accent} active={active} /> : kind === "glass" ? <GlassKnot accent={accent} active={active} /> : kind === "wire" ? <WireIco accent={accent} active={active} /> : <CubeCluster accent={accent} active={active} />;
  return (<><Float speed={active ? 2.2 : 1.1} rotationIntensity={0.4} floatIntensity={active ? 0.9 : 0.5}>{obj}</Float><ambientLight intensity={0.55} /><directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" /><pointLight position={[-3, -2, -2]} intensity={1.6} color={accent} /></>);
}
function HeroOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (mesh.current) { mesh.current.rotation.y += d * 0.12; mesh.current.rotation.z += d * 0.05; } });
  return (<><Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.6}><mesh ref={mesh}><icosahedronGeometry args={[1.4, 1]} /><meshStandardMaterial color={PALETTE.lime} emissive={PALETTE.lime} emissiveIntensity={0.5} roughness={0.2} metalness={0.6} wireframe /></mesh></Float><mesh><icosahedronGeometry args={[0.55, 0]} /><meshStandardMaterial color={PALETTE.cyan} emissive={PALETTE.cyan} emissiveIntensity={1.6} roughness={0.3} /></mesh><ambientLight intensity={0.5} /><pointLight position={[4, 3, 4]} intensity={2.4} color={PALETTE.cyan} /><pointLight position={[-4, -3, -2]} intensity={1.8} color={PALETTE.magenta} /></>);
}

/* ---------------- lazy-mounted card: <View> renders only when near viewport ---------------- */
function ProjectCard({ project }: { project: Project }) {
  const trackRef = useRef<HTMLDivElement>(null!);
  const [hover, setHover] = useState(false);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setNear(es[0].isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur-[2px] transition-all duration-300 hover:border-white/20"
      style={{ boxShadow: hover ? `0 0 0 1px ${project.accent}22, 0 24px 60px -28px ${project.accent}55` : "0 16px 40px -32px rgba(0,0,0,0.8)" }}>
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
        <span style={{ color: project.accent }}>● live</span><span>2024 / 2026</span>
      </div>
      <div ref={trackRef} className="relative mb-4 h-[200px] w-full overflow-hidden rounded-lg border border-white/5"
        style={{ background: `radial-gradient(circle at 50% 45%, ${project.accent}14, rgba(5,5,8,0.72) 72%)` }}>
        {near && (
          <View track={trackRef as RefObject<HTMLElement>} className="h-full w-full">
            <Signature kind={project.kind} accent={project.accent} active={hover} />
          </View>
        )}
      </div>
      <h3 className="font-sans text-xl font-semibold tracking-tight" style={{ color: project.accent }}>{project.name}</h3>
      <p className="mt-1 font-mono text-[12px] leading-relaxed text-white/45">{project.role}</p>
    </div>
  );
}

export default function R3FValidate() {
  const eventRef = useRef<HTMLDivElement>(null);
  const heroTrack = useRef<HTMLDivElement>(null!);

  useEffect(() => bindSignal(), []);
  useEffect(() => {
    const main = document.querySelector("main");
    const restore: Array<[HTMLElement, string]> = [];
    const hide = (el: Element | null) => { if (el instanceof HTMLElement) { restore.push([el, el.style.display]); el.style.display = "none"; } };
    for (const el of Array.from(document.body.children)) if (!el.contains(main)) hide(el);
    if (main?.parentElement) for (const el of Array.from(main.parentElement.children)) if (el !== main) hide(el);
    return () => restore.forEach(([el, d]) => (el.style.display = d));
  }, []);

  return (
    <div ref={eventRef} className="relative min-h-screen w-full font-sans text-[#f4f4f5]" style={{ background: PALETTE.void, cursor: "auto" }}>
      {/* layer 0: dedicated nebula background canvas (no views, no scissor fight) */}
      <Canvas className="!fixed !inset-0" style={{ zIndex: 0, pointerEvents: "none" }} dpr={[1, 1.5]} gl={{ antialias: false }} frameloop="always">
        <NebulaMesh />
      </Canvas>

      <div className="pointer-events-none fixed left-4 top-4 z-50 font-mono text-[11px] text-white/55">
        R3F VALIDATE v2 · külön bg + lazy View + Bloom · nézd az FPS-t fent
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-10">
        <header className="relative mb-20 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: PALETTE.lime }} /> Available for select work
            </div>
            <h1 className="font-mono text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl">
              <span style={{ color: PALETTE.lime }}>PTRK</span><span className="text-white/30">.</span><span className="text-white/90">SYSTEMS</span>
            </h1>
            <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-[#a1a1aa]">Design Engineering Unit · Budapest</p>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/65">Validációs prototípus v2: külön háttér-canvas, lazy-mount View-k, nincs per-view environment. A háttérnek most végig látszania kell, flicker nélkül. Figyeld az FPS-t.</p>
          </div>
          <div ref={heroTrack} className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-white/10 lg:h-[320px]"
            style={{ background: "rgba(1,255,255,0.04)" }}>
            <View track={heroTrack as RefObject<HTMLElement>} className="h-full w-full"><HeroOrb /></View>
            <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">core_unit</span>
          </div>
        </header>

        <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-white/45">Selected_Work</h2>
          <span className="font-mono text-[11px] text-white/25">{PROJECTS.length} kártya · lazy</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (<ProjectCard key={p.name + i} project={p} />))}
        </div>

        <footer className="mt-20 border-t border-white/10 pt-8 font-mono text-[11px] text-white/30">PTRK.SYSTEMS · validációs prototípus v2 · töröld a döntés után</footer>
      </div>

      {/* layer 1: transparent canvas — ONLY the views + Bloom (Concept 3 pattern) */}
      <Canvas
        eventSource={eventRef as RefObject<HTMLElement>}
        className="!fixed !inset-0"
        style={{ zIndex: 20, pointerEvents: "none" }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 40 }}
      >
        <View.Port />
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.3} mipmapBlur />
        </EffectComposer>
        <Stats />
      </Canvas>
    </div>
  );
}
