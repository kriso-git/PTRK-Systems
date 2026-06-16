"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";

/**
 * Hero backdrop: a slowly rotating 3D node-network ("design engineering /
 * rendszerek" data-constellation). Themed to the portfolio palette — lime
 * nodes with cyan/magenta/orange "hot" nodes — with data PULSES travelling
 * the edges. Transparent renderer so it blends onto the existing background.
 *
 * Conventions match AsciiField: client canvas, central motion gate (a frozen
 * frame on reduce, not nothing — a static constellation reads as intentional),
 * DPR capped, pauses when offscreen/hidden, full teardown on unmount.
 */

// portfolio palette (linear-ish RGB triples)
const LIME: [number, number, number] = [0.761, 0.996, 0.047];
const CYAN: [number, number, number] = [0.004, 1.0, 1.0];
const MAGENTA: [number, number, number] = [0.918, 0.008, 0.494];
const ORANGE: [number, number, number] = [1.0, 0.549, 0.259];

const NODE_VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uDpr;
  varying vec3 vColor;
  varying float vGlow;
  void main(){
    vColor = aColor;
    float pulse = 0.72 + 0.28 * sin(uTime * 1.5 + aSeed * 6.283);
    vGlow = pulse;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * pulse * uDpr * (90.0 / max(-mv.z, 0.1));
    gl_Position = projectionMatrix * mv;
  }
`;
const NODE_FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vGlow;
  uniform float uFade;
  void main(){
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float d = dot(c, c);
    if (d > 1.0) discard;
    float a = smoothstep(1.0, 0.0, d);
    gl_FragColor = vec4(vColor * (0.55 + vGlow), a * uFade);
  }
`;

export function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const N = 210;
    const THRESH = 2.25;
    const EDGE_CAP = 1500;
    const PULSES = 30;
    const reduced = reducedMotion();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL -> leave the (transparent) canvas, other bg layers carry the hero
    }
    renderer.setClearColor(0x000000, 0);
    const dprCap = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dprCap);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.045);
    const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    cam.position.set(0, 0, 15);

    const group = new THREE.Group();
    group.position.x = 1.2; // nudge the cluster right, away from the hero text
    scene.add(group);

    // ---- nodes ----
    const node = new Float32Array(N * 3);
    const nodeColor = new Float32Array(N * 3);
    const nodeSize = new Float32Array(N);
    const nodeSeed = new Float32Array(N);
    const v = (i: number) => new THREE.Vector3(node[i * 3], node[i * 3 + 1], node[i * 3 + 2]);
    for (let i = 0; i < N; i++) {
      const r = 2.5 + Math.pow(Math.random(), 0.7) * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      node[i * 3] = r * Math.sin(ph) * Math.cos(th);
      node[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
      node[i * 3 + 2] = r * Math.cos(ph);
      nodeSeed[i] = Math.random();
      // ~84% lime, with cyan/magenta/orange "hot" accents (bigger)
      const roll = Math.random();
      const [col, hot] =
        roll > 0.96 ? [ORANGE, true] : roll > 0.92 ? [MAGENTA, true] : roll > 0.84 ? [CYAN, true] : [LIME, false];
      nodeColor.set(col, i * 3);
      nodeSize[i] = hot ? 2.0 + Math.random() * 0.9 : 0.95 + Math.random() * 0.6;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(node, 3));
    nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(nodeColor, 3));
    nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(nodeSize, 1));
    nodeGeo.setAttribute("aSeed", new THREE.BufferAttribute(nodeSeed, 1));
    const nodeMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uDpr: { value: dprCap }, uFade: { value: 1 } },
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // ---- edges (near neighbours, fixed topology) ----
    const edges: [number, number][] = [];
    const eLine: number[] = [];
    for (let i = 0; i < N && edges.length < EDGE_CAP; i++) {
      for (let j = i + 1; j < N && edges.length < EDGE_CAP; j++) {
        if (v(i).distanceTo(v(j)) < THRESH) {
          edges.push([i, j]);
          eLine.push(node[i * 3], node[i * 3 + 1], node[i * 3 + 2], node[j * 3], node[j * 3 + 1], node[j * 3 + 2]);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(eLine), 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(CYAN[0], CYAN[1], CYAN[2]),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ---- data pulses travelling along edges ----
    const pPos = new Float32Array(PULSES * 3);
    const pColor = new Float32Array(PULSES * 3);
    const pSize = new Float32Array(PULSES);
    const pSeed = new Float32Array(PULSES);
    const pEdge = new Int32Array(PULSES);
    const pT = new Float32Array(PULSES);
    const pSpeed = new Float32Array(PULSES);
    const respawn = (k: number) => {
      pEdge[k] = (Math.random() * edges.length) | 0;
      pT[k] = 0;
      pSpeed[k] = 0.35 + Math.random() * 0.8;
      const bright = Math.random() > 0.5 ? LIME : CYAN;
      pColor.set(bright, k * 3);
      pSize[k] = 1.7 + Math.random() * 1.1;
      pSeed[k] = Math.random();
    };
    for (let k = 0; k < PULSES; k++) respawn(k);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pulseGeo.setAttribute("aColor", new THREE.BufferAttribute(pColor, 3));
    pulseGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
    pulseGeo.setAttribute("aSeed", new THREE.BufferAttribute(pSeed, 1));
    group.add(new THREE.Points(pulseGeo, nodeMat));

    // ---- interactivity / loop state ----
    const pointer = new THREE.Vector2(0, 0);
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };

    const renderOnce = () => {
      nodeMat.uniforms.uTime.value = 1.5;
      const pa = pulseGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < PULSES; k++) {
        const [a, b] = edges[pEdge[k]];
        const t = pSeed[k];
        pPos[k * 3] = node[a * 3] + (node[b * 3] - node[a * 3]) * t;
        pPos[k * 3 + 1] = node[a * 3 + 1] + (node[b * 3 + 1] - node[a * 3 + 1]) * t;
        pPos[k * 3 + 2] = node[a * 3 + 2] + (node[b * 3 + 2] - node[a * 3 + 2]) * t;
      }
      pa.needsUpdate = true;
      group.rotation.set(0.2, 0.5, 0);
      renderer.render(scene, cam);
    };

    resize();

    if (reduced || edges.length === 0) {
      renderOnce();
      const onResizeStatic = () => {
        resize();
        renderOnce();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => {
        window.removeEventListener("resize", onResizeStatic);
        nodeGeo.dispose();
        edgeGeo.dispose();
        pulseGeo.dispose();
        nodeMat.dispose();
        edgeMat.dispose();
        renderer.dispose();
      };
    }

    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        visible = inView && document.visibilityState === "visible";
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVis = () => {
      visible = document.visibilityState === "visible" && inView;
    };

    const pulseAttr = pulseGeo.getAttribute("position") as THREE.BufferAttribute;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const t = now / 1000;
      nodeMat.uniforms.uTime.value = t;

      // advance pulses along their edges
      for (let k = 0; k < PULSES; k++) {
        pT[k] += dt * pSpeed[k];
        if (pT[k] >= 1) respawn(k);
        const [a, b] = edges[pEdge[k]];
        const tt = pT[k];
        pPos[k * 3] = node[a * 3] + (node[b * 3] - node[a * 3]) * tt;
        pPos[k * 3 + 1] = node[a * 3 + 1] + (node[b * 3 + 1] - node[a * 3 + 1]) * tt;
        pPos[k * 3 + 2] = node[a * 3 + 2] + (node[b * 3 + 2] - node[a * 3 + 2]) * tt;
      }
      pulseAttr.needsUpdate = true;

      // scroll journey: the network blooms outward, the camera recedes, and it dissolves
      const sp = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 1.15)));
      nodeMat.uniforms.uFade.value += (1 - sp * 0.95 - nodeMat.uniforms.uFade.value) * 0.1;
      edgeMat.opacity = 0.22 * nodeMat.uniforms.uFade.value;
      cam.position.z += (15 + sp * 11 - cam.position.z) * 0.06;
      group.scale.setScalar(1 + sp * 0.85);

      group.rotation.y += dt * 0.06;
      group.rotation.x = Math.sin(t * 0.12) * 0.12 + 0.12;
      // pointer parallax
      cam.position.x += (pointer.x * 2.4 - cam.position.x) * 0.03;
      cam.position.y += (pointer.y * 1.6 - cam.position.y) * 0.03;
      cam.lookAt(group.position.x * 0.4, 0, 0);

      renderer.render(scene, cam);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      nodeGeo.dispose();
      edgeGeo.dispose();
      pulseGeo.dispose();
      nodeMat.dispose();
      edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" aria-hidden />;
}
