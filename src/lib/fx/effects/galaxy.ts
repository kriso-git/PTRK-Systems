import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C } from '../lib';

// Spiral galaxy of points: lime core fading to cyan/magenta arms, slow rotation, mouse parallax.
export function galaxy(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let pts: THREE.Points;
  let geo: THREE.BufferGeometry;
  let mat: THREE.PointsMaterial;

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      cam.position.set(0, 3.2, 5.5);

      const N = 16000;
      const R = 5;
      const BRANCHES = 4;
      const SPIN = 1.1;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const inC = C.lime.clone();
      const midC = C.cyan.clone();
      const outC = C.magenta.clone();
      const tmp = new THREE.Color();
      for (let i = 0; i < N; i++) {
        const r = Math.pow(Math.random(), 1.4) * R;
        const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
        const spin = r * SPIN;
        const rand = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.35 + r * 0.12);
        const x = Math.cos(branch + spin) * r + rand();
        const y = rand() * 0.5;
        const z = Math.sin(branch + spin) * r + rand();
        pos.set([x, y, z], i * 3);
        const f = r / R;
        if (f < 0.5) tmp.copy(inC).lerp(midC, f * 2);
        else tmp.copy(midC).lerp(outC, (f - 0.5) * 2);
        col.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      mat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      pts = new THREE.Points(geo, mat);
      scene.add(pts);
    },
    frame(_t, dt) {
      pts.rotation.y += dt * 0.12;
      cam.position.x += (ctx.pointer.x * 2.0 - cam.position.x) * 0.04;
      const ty = 3.2 - ctx.pointer.y * 1.5;
      cam.position.y += (ty - cam.position.y) * 0.04;
      cam.lookAt(0, 0, 0);
      ctx.renderer.render(scene, cam);
    },
    resize(w, h) {
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    },
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}
