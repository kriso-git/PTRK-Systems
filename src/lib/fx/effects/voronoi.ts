import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { NOISE_GLSL } from '../lib';

// Animated cellular / Voronoi field on a single fullscreen triangle.
// Feature points drift with time, glowing lime cell edges on void, cyan accents,
// soft vignette. The mouse warps the field locally (uMouse). perf: light.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

` + NOISE_GLSL + `

// Voronoi: returns x = distance to nearest feature point (F1),
//          y = distance to 2nd nearest (F2), z = a per-cell random id.
vec3 voronoi(vec2 p){
  vec2 ip = floor(p);
  vec2 fp = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++){
    for (int i = -1; i <= 1; i++){
      vec2 g = vec2(float(i), float(j));
      vec2 h = hash2(ip + g);
      // animate the feature point inside its cell so cells slowly drift
      vec2 o = 0.5 + 0.5 * sin(uTime * 0.55 + 6.2831 * h);
      vec2 r = g + o - fp;
      float d = dot(r, r);
      if (d < f1){
        f2 = f1;
        f1 = d;
        id = h.x;
      } else if (d < f2){
        f2 = d;
      }
    }
  }
  return vec3(sqrt(f1), sqrt(f2), id);
}

void main(){
  // aspect-correct centered coords
  vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;

  // mouse position in the same centered space
  vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0) * 0.5;

  // local field warp around the mouse: push the lattice outward radially,
  // plus a gentle fbm domain warp for organic drift
  vec2 p = uv * 3.2;
  vec2 toM = p - m * 3.2;
  float md = length(toM);
  float warp = 0.9 * exp(-md * md * 0.55);
  p += normalize(toM + 1e-4) * warp;
  p += 0.18 * vec2(fbm(uv * 1.5 + uTime * 0.05), fbm(uv * 1.5 - uTime * 0.04 + 7.3));

  vec3 v = voronoi(p);
  float f1 = v.x;
  float f2 = v.y;
  float cellId = v.z;

  // edge = where F2 and F1 are close (border between two cells)
  float edge = f2 - f1;
  float line = 1.0 - smoothstep(0.0, 0.085, edge);
  float glow = 0.045 / (0.02 + edge);   // soft bloom around the seams

  vec3 lime = vec3(0.760, 0.996, 0.047);
  vec3 cyan = vec3(0.004, 1.0, 1.0);
  vec3 voidCol = vec3(0.020, 0.020, 0.031);

  // per-cell tint flicker: mostly lime, occasional cyan accent cells
  float accent = step(0.78, fract(cellId * 7.0 + uTime * 0.07));
  vec3 edgeCol = mix(lime, cyan, accent);

  // faint inner fill so cells read as panels, brightest near their core
  float core = smoothstep(0.55, 0.0, f1);
  vec3 fill = mix(voidCol, edgeCol * 0.10, core * (0.4 + 0.6 * cellId));

  // pulse traveling along the seams
  float pulse = 0.6 + 0.4 * sin(uTime * 1.6 + cellId * 18.0);

  vec3 col = voidCol;
  col += fill;
  col += edgeCol * line * 1.4 * pulse;
  col += edgeCol * glow * 0.5;

  // mouse highlight ring
  col += cyan * 0.5 * exp(-md * md * 1.6) * (0.5 + 0.5 * sin(uTime * 3.0));

  // tonemap + scanline + soft vignette
  col = 1.0 - exp(-col * 1.25);
  col *= 0.9 + 0.1 * sin(gl_FragCoord.y * 1.4);
  float vig = smoothstep(1.4, 0.2, length(uv));
  col *= 0.35 + 0.65 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function voronoi(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.Camera;
  let mat: THREE.ShaderMaterial;
  let mesh: THREE.Mesh;

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      cam = new THREE.Camera();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
      );
      mat = new THREE.ShaderMaterial({
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(ctx.width, ctx.height) },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: FRAG,
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
      const dpr = ctx.renderer.getPixelRatio();
      mat.uniforms.uRes.value.set(ctx.width * dpr, ctx.height * dpr);
    },
    frame(t) {
      mat.uniforms.uTime.value = t;
      // smoothly chase the live pointer for a fluid local warp
      mat.uniforms.uMouse.value.lerp(ctx.pointer, 0.08);
      ctx.renderer.render(scene, cam);
    },
    resize(w, h) {
      const dpr = ctx.renderer.getPixelRatio();
      mat.uniforms.uRes.value.set(w * dpr, h * dpr);
    },
    dispose() {
      mesh.geometry.dispose();
      mat.dispose();
    },
  };
}
