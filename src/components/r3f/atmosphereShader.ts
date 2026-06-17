// Volumetric atmosphere — a raymarched 3D cloud field that replaces the flat 2D
// nebula on full-quality devices. Same brand palette + scroll reactivity as the
// nebula: uScroll drives a lime -> cyan -> magenta -> orange colour journey and a
// forward drift, uEnergy swells brightness on fast scroll, uMouse parallaxes the
// camera + lights a torch. Heavy (raymarch), so it runs only on full quality and
// at a reduced canvas DPR; lite falls back to the cheap 2D nebula.
// NOTE: this is an R3F <shaderMaterial> (auto-injects attribute/precision); do NOT
// redeclare them, and never put a backtick inside these strings.
export const ATMOS_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const ATMOS_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uScroll;
  uniform float uEnergy;

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);
  const vec3 ORANGE  = vec3(1.0,   0.55,  0.16);

  float h(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vnoise(vec3 x){
    vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h(i+vec3(0,0,0)), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.03; a *= 0.5; } return v; }
  float density(vec3 p){ float d = fbm(p * 0.9 + vec3(uTime * 0.02, 0.0, 0.0)) - 0.33; return clamp(d * 2.3, 0.0, 1.0); }

  void main(){
    vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;
    vec2 m = (uMouse - 0.5);
    vec3 ro = vec3(m.x * 0.6, m.y * 0.4, 4.0);
    vec3 rd = normalize(vec3(uv, -1.6));
    vec3 lightDir = normalize(vec3(0.6, 0.5, 0.3));

    // scroll colour journey across the brand palette
    vec3 jtint = mix(LIME, CYAN, smoothstep(0.0, 0.40, uScroll));
    jtint = mix(jtint, MAGENTA, smoothstep(0.40, 0.72, uScroll));
    jtint = mix(jtint, ORANGE, smoothstep(0.72, 1.0, uScroll));

    // scroll + energy advance the volume so it streams as you travel the page
    float drift = uTime * (0.14 + uEnergy * 0.12) + uScroll * 1.6;

    vec3 col = vec3(0.0); float trans = 1.0; float t = 0.5;
    for (int i = 0; i < 38; i++){
      vec3 p = ro + rd * t; p.z += drift;
      float den = density(p);
      if (den > 0.01){
        float ld = density(p + lightDir * 0.35);
        float lit = clamp((den - ld) * 3.2, 0.0, 1.0);
        float hv = clamp(0.5 + 0.5 * sin(p.z * 0.4 + p.y * 0.6), 0.0, 1.0);
        vec3 local = mix(LIME, CYAN, hv);
        local = mix(local, MAGENTA, smoothstep(0.7, 1.0, hv));
        vec3 base = mix(local, jtint, 0.76);
        vec3 c = base * (0.26 + lit * 1.3 + uEnergy * 0.4);
        col += c * den * trans * 0.26;
        trans *= 1.0 - den * 0.22;
      }
      t += 0.2; if (trans < 0.02) break;
    }

    vec3 bg = vec3(0.011, 0.013, 0.018);
    col += bg * trans;
    // cursor torch, the brand "reveal light"
    float md = length(uv - m); float torch = exp(-md * md * 1.6);
    col += jtint * torch * 0.06;
    float vig = smoothstep(1.5, 0.2, length(uv)); col *= 0.5 + 0.5 * vig;
    col = col / (col + 0.72);
    gl_FragColor = vec4(col, 1.0);
  }
`;
