import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C } from '../lib';

// Warp-speed starfield: ~4000 stars streaking toward the camera. Each star is a 2-vertex
// line segment; the vertex shader stretches the trailing vertex backward along the motion
// axis to form a streak whose length scales with warp speed. Stars travel +Z toward the
// camera (at z=0) and respawn far behind once they pass. Speed eases up the further the
// pointer is from screen center. White core, lime/cyan tint.
export function starfield(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let geo: THREE.BufferGeometry;
  let mat: THREE.ShaderMaterial;
  let lines: THREE.LineSegments;

  const N = 4000;
  const FAR = 60; // spawn depth behind the camera plane
  const SPREAD = 26; // x/y half-extent of the spawn cylinder

  // CPU-side star state (z + per-star speed factor); positions pushed to GPU each frame.
  const starZ = new Float32Array(N);
  const starSpd = new Float32Array(N);

  // GPU buffers: 2 vertices per star (head + tail), shared xy, differing "side" attribute.
  const positions = new Float32Array(N * 2 * 3); // base point (same for both verts)
  const sideArr = new Float32Array(N * 2); // 0 = head (at point), 1 = tail (streaked back)
  const tintArr = new Float32Array(N * 2); // 0..1 lime->cyan tint per star

  let warp = 1.0; // smoothed warp multiplier driven by pointer distance

  function respawn(i: number, far: boolean) {
    const a = Math.random() * Math.PI * 2;
    // bias toward edges a little so the center stays clearer (more tunnel-like)
    const r = Math.sqrt(Math.random()) * SPREAD;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const z = far ? -FAR - Math.random() * FAR : -Math.random() * FAR;
    starZ[i] = z;
    starSpd[i] = 0.55 + Math.random() * 0.9;
    const tint = Math.random();
    const o = i * 2 * 3;
    positions[o] = x;
    positions[o + 1] = y;
    positions[o + 2] = z;
    positions[o + 3] = x;
    positions[o + 4] = y;
    positions[o + 5] = z;
    tintArr[i * 2] = tint;
    tintArr[i * 2 + 1] = tint;
  }

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;

      scene = new THREE.Scene();
      scene.background = C.void.clone();
      cam = new THREE.PerspectiveCamera(70, ctx.width / ctx.height || 1, 0.1, 200);
      cam.position.set(0, 0, 0);
      cam.lookAt(0, 0, -1);

      for (let i = 0; i < N; i++) {
        respawn(i, false);
        sideArr[i * 2] = 0;
        sideArr[i * 2 + 1] = 1;
      }

      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aSide', new THREE.BufferAttribute(sideArr, 1));
      geo.setAttribute('aTint', new THREE.BufferAttribute(tintArr, 1));

      mat = new THREE.ShaderMaterial({
        uniforms: {
          uStreak: { value: 2.0 }, // world-units the tail trails behind the head
          uLime: { value: new THREE.Vector3(C.lime.r, C.lime.g, C.lime.b) },
          uCyan: { value: new THREE.Vector3(C.cyan.r, C.cyan.g, C.cyan.b) },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute float aSide;
          attribute float aTint;
          uniform float uStreak;
          varying float vCore;   // 1 at head (bright core), 0 at tail
          varying float vTint;
          varying float vFade;   // distance-based brightness
          void main(){
            vec3 p = position;
            // The tail vertex trails toward larger -Z (behind the head) forming the streak.
            // Stars near the camera (z ~ 0) get longer visual streaks.
            float nearK = clamp((p.z + 60.0) / 60.0, 0.0, 1.0); // 0 far .. 1 near
            float len = uStreak * (0.25 + nearK * 1.0);
            p.z -= aSide * len;
            vCore = 1.0 - aSide;
            vTint = aTint;
            // fade in stars that just spawned far away, fade brightest near camera
            vFade = smoothstep(-60.0, -30.0, position.z) * (0.4 + nearK * 0.9);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform vec3 uLime;
          uniform vec3 uCyan;
          varying float vCore;
          varying float vTint;
          varying float vFade;
          void main(){
            vec3 neon = mix(uLime, uCyan, vTint);
            // white-hot core blended toward neon along the streak tail
            vec3 col = mix(neon, vec3(1.0), pow(vCore, 1.5));
            float a = vFade * (0.18 + vCore * 0.95);
            gl_FragColor = vec4(col * (0.6 + vCore * 0.8), a);
          }
        `,
      });

      lines = new THREE.LineSegments(geo, mat);
      lines.frustumCulled = false;
      scene.add(lines);
    },

    frame(_t, dt) {
      const d = Math.min(dt, 0.05); // clamp big frame gaps

      // Pointer distance from center eases the warp speed (center = calm, edges = fast).
      const pd = Math.min(1, Math.hypot(ctx.pointer.x, ctx.pointer.y) / 1.4);
      const targetWarp = 1.0 + pd * pd * 5.0;
      warp += (targetWarp - warp) * Math.min(1, d * 4.0);
      mat.uniforms.uStreak.value = 1.4 + warp * 1.6;

      const base = 22.0 * warp; // world units/sec toward camera
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < N; i++) {
        starZ[i] += base * starSpd[i] * d;
        if (starZ[i] > 1.5) {
          respawn(i, true);
        } else {
          const o = i * 2 * 3;
          positions[o + 2] = starZ[i];
          positions[o + 5] = starZ[i];
        }
      }
      posAttr.needsUpdate = true;

      // Subtle parallax: drift the field opposite the pointer.
      lines.position.x += (-ctx.pointer.x * 1.6 - lines.position.x) * 0.05;
      lines.position.y += (-ctx.pointer.y * 1.6 - lines.position.y) * 0.05;

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
