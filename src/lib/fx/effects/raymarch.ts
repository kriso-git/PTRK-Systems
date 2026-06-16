import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';

// Volumetric glow raymarch of an animated gyroid shell. Neon lime/cyan, scanline + vignette.
// "Wow per byte": one fullscreen triangle, no geometry, scales by lowering the loop count.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float gyroid(vec3 p){ return dot(sin(p), cos(p.yzx)); }

float map(vec3 p){
  p.xz *= rot(uTime * 0.08 + uMouse.x * 0.7);
  p.xy *= rot(uTime * 0.05 + uMouse.y * 0.5);
  float g1 = gyroid(p * 1.4);
  float g2 = gyroid(p * 3.1) * 0.22;
  return (abs(g1 + g2) - 0.04) * 0.55;
}

void main(){
  vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, -3.2);
  vec3 rd = normalize(vec3(uv, 1.4));

  vec3 lime = vec3(0.760, 0.996, 0.047);
  vec3 cyan = vec3(0.004, 1.0, 1.0);
  vec3 col = vec3(0.0);
  float t = 0.0;

  for (int i = 0; i < 90; i++){
    vec3 p = ro + rd * t;
    float d = map(p);
    float glow = 0.013 / (0.012 + abs(d));
    vec3 tint = mix(lime, cyan, 0.5 + 0.5 * sin(t * 0.55 + uTime * 0.3));
    col += tint * glow * 0.055;
    t += max(0.02, abs(d) * 0.9);
    if (t > 9.0) break;
  }

  col = 1.0 - exp(-col * 1.15);
  col *= 0.86 + 0.14 * sin(gl_FragCoord.y * 1.5); // scanline
  float vig = smoothstep(1.35, 0.25, length(uv));
  col *= 0.45 + 0.55 * vig;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function raymarch(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.Camera;
  let mat: THREE.ShaderMaterial;
  let mesh: THREE.Mesh;

  return {
    init(c) {
      ctx = c;
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
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: FRAG,
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);
    },
    frame(t) {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.lerp(ctx.pointer, 0.06);
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
