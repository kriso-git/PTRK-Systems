import * as THREE from 'three';

export const COLORS = {
  void: '#050508',
  lime: '#c2fe0c',
  cyan: '#01ffff',
  magenta: '#ea027e',
  orange: '#ff8c42',
};

export const C = {
  void: new THREE.Color(COLORS.void),
  lime: new THREE.Color(COLORS.lime),
  cyan: new THREE.Color(COLORS.cyan),
  magenta: new THREE.Color(COLORS.magenta),
  orange: new THREE.Color(COLORS.orange),
};

export interface Ctx {
  renderer: THREE.WebGLRenderer;
  pointer: THREE.Vector2; // normalized device coords, -1..1
  width: number;
  height: number;
}

export interface Effect {
  init(ctx: Ctx): void;
  frame(t: number, dt: number): void;
  resize(w: number, h: number): void;
  dispose(): void;
}

// cheap value-noise fbm, shared by terrain (and available to others)
export const NOISE_GLSL = /* glsl */ `
vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash2(i + vec2(0.0, 0.0)).x;
  float b = hash2(i + vec2(1.0, 0.0)).x;
  float c = hash2(i + vec2(0.0, 1.0)).x;
  float d = hash2(i + vec2(1.0, 1.0)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * vnoise(p); p *= 2.0; a *= 0.5; }
  return v;
}
`;
