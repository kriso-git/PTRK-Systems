import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C, NOISE_GLSL } from '../lib';

// Instanced dot-matrix HUD surface: thousands of cubes wave with fbm noise; the mouse
// sends a ripple through the grid. Displacement runs per-instance in the vertex shader.
const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
varying float vH;
${NOISE_GLSL}
void main(){
  vec4 ip = instanceMatrix * vec4(position, 1.0);
  float bx = instanceMatrix[3][0];
  float bz = instanceMatrix[3][2];
  float h = fbm(vec2(bx * 0.16, bz * 0.16 + uTime * 0.45)) * 2.4;
  float md = distance(vec2(bx, bz), uMouse);
  h += sin(md * 1.6 - uTime * 3.5) * exp(-md * 0.35) * 1.1;
  ip.y += h;
  vH = h;
  gl_Position = projectionMatrix * modelViewMatrix * ip;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying float vH;
uniform vec3 uLime;
uniform vec3 uCyan;
void main(){
  float k = clamp(vH * 0.35 + 0.2, 0.0, 1.0);
  gl_FragColor = vec4(mix(uCyan, uLime, k), 1.0);
}
`;

export function grid(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let inst: THREE.InstancedMesh;
  let mat: THREE.ShaderMaterial;
  const mouse = new THREE.Vector2(0, 0);
  const tmp = new THREE.Vector3();

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      cam.position.set(0, 6.5, 11);

      const G = 56;
      const span = 24;
      const geo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uMouse: { value: mouse }, uLime: { value: C.lime }, uCyan: { value: C.cyan } },
        vertexShader: VERT,
        fragmentShader: FRAG,
      });
      inst = new THREE.InstancedMesh(geo, mat, G * G);
      const m = new THREE.Matrix4();
      let i = 0;
      for (let x = 0; x < G; x++) {
        for (let z = 0; z < G; z++) {
          const px = (x / (G - 1) - 0.5) * span;
          const pz = (z / (G - 1) - 0.5) * span;
          m.makeTranslation(px, 0, pz);
          inst.setMatrixAt(i++, m);
        }
      }
      inst.instanceMatrix.needsUpdate = true;
      scene.add(inst);
    },
    frame(t) {
      mat.uniforms.uTime.value = t;
      tmp.set(ctx.pointer.x, ctx.pointer.y, 0.5).unproject(cam).sub(cam.position).normalize();
      const md = -cam.position.y / tmp.y; // intersect y=0 plane
      mouse.set(cam.position.x + tmp.x * md, cam.position.z + tmp.z * md);
      cam.position.x += (ctx.pointer.x * 2.0 - cam.position.x) * 0.03;
      cam.lookAt(0, 0.5, 0);
      ctx.renderer.render(scene, cam);
    },
    resize(w, h) {
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    },
    dispose() {
      inst.geometry.dispose();
      mat.dispose();
    },
  };
}
