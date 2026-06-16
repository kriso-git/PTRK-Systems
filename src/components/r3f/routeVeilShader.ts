// One-shot route-transition wash. A diagonal nebula band crosses the viewport
// when uVeil goes 0 -> 1 -> 0. Same lime/cyan(+magenta) language as the Stage
// background, so the transition reads as the bg surging up and clearing, not a
// foreign wipe. alpha is the band envelope => fully transparent at rest, so the
// dedicated high-z veil canvas costs ~nothing and never blocks the page when idle.
// NOTE: never put a backtick inside these strings.
export const VEIL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const VEIL_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uVeil;    // 0..1 wash progress (0 = idle)
  uniform float uTime;
  uniform float uAmp;     // velocity-scaled intensity (0.85..1.0)
  uniform vec2  uRes;

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++){ v += a * vnoise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    if (uVeil <= 0.001) { gl_FragColor = vec4(0.0); return; }
    vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;

    // diagonal sweep position: the band center travels from one corner to the
    // other as uVeil rises and falls (a crest, not a hard wipe).
    float axis = (uv.x + uv.y) * 0.5;            // -~1 .. ~1 along the diagonal
    float center = mix(-1.2, 1.2, uVeil);        // band sweeps across
    float band = exp(-pow((axis - center) * 1.8, 2.0)); // soft gaussian band

    // nebula content inside the band
    float t = uTime * 0.4;
    vec2 q = vec2(fbm(uv * 1.8 + vec2(0.0, t)), fbm(uv * 1.8 + vec2(5.2, -t)));
    float cloud = fbm(uv * 1.8 + 3.0 * q + vec2(t * 0.5, -t * 0.5));
    cloud = smoothstep(0.30, 0.95, cloud);

    float hue = clamp(0.5 + 0.5 * (q.x - q.y), 0.0, 1.0);
    vec3 tint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    tint = mix(tint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.4);

    vec3 col = tint * (0.35 + cloud * 0.9);
    float env = band * uAmp * smoothstep(0.0, 0.12, uVeil) * smoothstep(1.0, 0.85, uVeil);
    gl_FragColor = vec4(col * env, env * 0.88);
  }
`;
