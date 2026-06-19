// Nebula background shader – ported verbatim from the original BgNebula.tsx so
// the R3F Stage background is visually identical. Fullscreen-triangle vertex
// shader (ignores the camera); fragment shader = domain-warped fbm wisps on a
// dark base, revealed by a cursor "torch".
// NOTE: never put a backtick inside these template-literal strings.
export const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const NEBULA_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uScroll;   // 0..1 page scroll progress (drives the colour journey + flow)
  uniform float uEnergy;   // 0..1 smoothed scroll energy (fast scroll surges the field)

  const vec3 LIME    = vec3(0.761, 0.996, 0.047);
  const vec3 CYAN    = vec3(0.004, 1.0,   1.0);
  const vec3 MAGENTA = vec3(0.918, 0.008, 0.494);
  const vec3 ORANGE  = vec3(1.0,   0.55,  0.16);

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++){
      v += amp * vnoise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv0 = (vUv * uRes - 0.5 * uRes) / uRes.y;
    // scroll advances the noise field (it morphs/streams as you travel the page)
    // and energy speeds the drift. Kept gentle so the field GLIDES on scroll
    // rather than racing (the eased uScroll on the JS side smooths it further).
    float t = uTime * (0.06 + uEnergy * 0.05) + uScroll * 1.25;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec2 uv = uv0 + m * 0.30;

    vec2 q = vec2(
      fbm(uv * 1.6 + vec2(0.0, t)),
      fbm(uv * 1.6 + vec2(5.2, -t * 0.8))
    );
    vec2 r = vec2(
      fbm(uv * 1.6 + 3.4 * q + vec2(1.7 - t * 0.5, 9.2) + m * 0.6),
      fbm(uv * 1.6 + 3.4 * q + vec2(8.3, 2.8 + t * 0.6) + m * 0.9)
    );
    float cloud = fbm(uv * 1.6 + 4.0 * r + vec2(t * 0.45, -t * 0.35));
    cloud = smoothstep(0.28, 0.95, cloud);
    cloud = pow(cloud, 1.3);

    vec2 mAC = (uMouse * uRes - 0.5 * uRes) / uRes.y;
    float md = length(uv0 - mAC);
    float torch = exp(-md * md * 1.8);

    // noise-driven hue, kept for local variation
    float hue = clamp(0.5 + 0.5 * (q.x - r.y), 0.0, 1.0);
    vec3 ntint = mix(LIME, CYAN, smoothstep(0.0, 0.7, hue));
    ntint = mix(ntint, MAGENTA, smoothstep(0.85, 1.0, hue) * 0.45);

    // scroll JOURNEY across the brand palette: lime -> cyan -> magenta -> orange
    // as you travel down the page, so each section reads in its own light.
    vec3 jtint = mix(LIME, CYAN, smoothstep(0.0, 0.40, uScroll));
    jtint = mix(jtint, MAGENTA, smoothstep(0.40, 0.72, uScroll));
    jtint = mix(jtint, ORANGE, smoothstep(0.72, 1.0, uScroll));

    // journey colour dominates so each section reads in its own light; the noise
    // tint only adds 20% local variation (otherwise its cyan/lime washes it green).
    vec3 tint = mix(ntint, jtint, 0.80);

    vec3 col = vec3(0.011, 0.012, 0.017);
    // ambient presence (raised from 0.10 so the field reads without the cursor)
    // plus a scroll-energy surge that brightens the whole field on fast scroll.
    col += tint * cloud * (0.20 + uEnergy * 0.40);
    col += tint * cloud * torch * 1.05;
    col += tint * torch * 0.10;
    col += jtint * pow(cloud, 3.0) * torch * 0.28;
    // soft streaming pulse pushed through the clouds while scrolling
    col += jtint * pow(cloud, 2.0) * uEnergy * 0.32;

    float vig = smoothstep(1.3, 0.2, length(uv));
    col *= 0.5 + 0.5 * vig;
    col *= 0.6; // overall brightness dialed down from 0.92 - present but non-distracting

    gl_FragColor = vec4(col, 1.0);
  }
`;
