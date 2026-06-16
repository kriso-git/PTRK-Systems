import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C, COLORS } from '../lib';

// Flying through an infinite wireframe HUD tunnel along a looping noisy curve, with fog depth.
export function tunnel(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let curve: THREE.CatmullRomCurve3;
  let mesh: THREE.Mesh;
  const up = new THREE.Vector3(0, 1, 0);
  const trash: { dispose(): void }[] = [];

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(new THREE.Color(COLORS.void).getHex(), 0.09);
      cam = new THREE.PerspectiveCamera(72, 1, 0.1, 100);

      // One large gentle loop (radius >> tube radius) with only SMALL perturbations, so the
      // path never comes near itself -> the camera can't fly through another tube wall.
      const pts: THREE.Vector3[] = [];
      const RINGS = 20;
      const R = 22;
      for (let i = 0; i < RINGS; i++) {
        const a = (i / RINGS) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * R + Math.sin(a * 3) * 2.6,
            Math.sin(a) * R * 0.6 + Math.cos(a * 2) * 2.2,
            Math.sin(a * 2) * 4.5,
          ),
        );
      }
      curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
      const geo = new THREE.TubeGeometry(curve, 280, 2.3, 18, true);
      const mat = new THREE.MeshBasicMaterial({ color: C.lime, wireframe: true, fog: true });
      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      trash.push(geo, mat);
    },
    frame(t) {
      const u = (t * 0.04) % 1;
      const p = curve.getPointAt(u);
      const p2 = curve.getPointAt((u + 0.012) % 1);
      cam.position.copy(p);
      // gentle pointer-driven offset inside the tube
      cam.position.x += ctx.pointer.x * 0.6;
      cam.position.y += ctx.pointer.y * 0.6;
      cam.up.copy(up);
      cam.lookAt(p2);
      ctx.renderer.render(scene, cam);
    },
    resize(w, h) {
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    },
    dispose() {
      trash.forEach((d) => d.dispose());
    },
  };
}
