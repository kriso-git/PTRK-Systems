import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C } from '../lib';

// Fresnel + scanline hologram with flicker, on a rotating knot. Classic HUD-hologram look.
const VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vView;
varying vec3 vW;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
const FRAG = /* glsl */ `
precision highp float;
varying vec3 vN;
varying vec3 vView;
varying vec3 vW;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uColor2;
void main(){
  float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.4);
  float scan = 0.5 + 0.5 * sin(vW.y * 42.0 - uTime * 6.0);
  float flick = 0.82 + 0.18 * sin(uTime * 28.0) * sin(uTime * 13.0);
  vec3 col = mix(uColor, uColor2, fres);
  float a = (fres * 0.85 + scan * 0.18) * flick;
  gl_FragColor = vec4(col * (0.5 + fres), a);
}
`;

export function hologram(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let group: THREE.Group;
  let mat: THREE.ShaderMaterial;
  const trash: { dispose(): void }[] = [];

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      cam.position.set(0, 0, 5);
      group = new THREE.Group();
      scene.add(group);

      mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uColor: { value: C.lime }, uColor2: { value: C.cyan } },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const g1 = new THREE.TorusKnotGeometry(1.4, 0.42, 160, 24);
      group.add(new THREE.Mesh(g1, mat));
      const g2 = new THREE.IcosahedronGeometry(2.1, 1);
      group.add(new THREE.Mesh(g2, new THREE.MeshBasicMaterial({ color: C.cyan, wireframe: true, transparent: true, opacity: 0.12 })));
      trash.push(g1, g2, mat);
    },
    frame(t, dt) {
      mat.uniforms.uTime.value = t;
      group.rotation.y += dt * 0.5;
      group.rotation.x += dt * 0.18;
      cam.position.x += (ctx.pointer.x * 1.5 - cam.position.x) * 0.05;
      cam.position.y += (ctx.pointer.y * 1.5 - cam.position.y) * 0.05;
      cam.lookAt(0, 0, 0);
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
