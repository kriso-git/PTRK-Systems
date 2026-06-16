import * as THREE from 'three';
import type { Ctx, Effect } from '../lib';
import { C } from '../lib';

// "Matrix" terminal rain in 3D depth.
// A glyph atlas is rasterized on a 2D canvas (katakana-ish + 0-9 + symbols, white on
// transparent). One InstancedMesh of tiny quads draws every glyph; each instance gets a
// per-instance atlas-cell index (aGlyph), a column id, and a row offset. The vertex shader
// resolves the atlas UV; the fragment shader fades each glyph by its distance behind the
// leading character of its column -> brightest at the head, dim trail. Columns scroll along
// -Y and wrap; gentle pointer parallax + varied z gives depth. perf light.

const ATLAS_COLS = 8; // 8x8 = 64 glyph cells
const ATLAS_ROWS = 8;
const CELL = 64; // px per cell

// katakana half-width-ish set + digits + a few terminal symbols
const GLYPHS =
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛ0123456789:.=*+<>|';

function buildAtlas(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = ATLAS_COLS * CELL;
  cv.height = ATLAS_ROWS * CELL;
  const g = cv.getContext('2d')!;
  g.clearRect(0, 0, cv.width, cv.height); // transparent bg
  g.fillStyle = '#ffffff'; // white -> tinted per-instance in shader
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `700 ${Math.floor(CELL * 0.78)}px "Courier New", ui-monospace, monospace`;
  const n = Math.min(GLYPHS.length, ATLAS_COLS * ATLAS_ROWS);
  for (let i = 0; i < n; i++) {
    const cx = (i % ATLAS_COLS) * CELL + CELL / 2;
    const cy = Math.floor(i / ATLAS_COLS) * CELL + CELL / 2;
    g.fillText(GLYPHS[i], cx, cy);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

const VERT = /* glsl */ `
attribute float aGlyph;     // which atlas cell this instance shows
attribute float aColPhase;  // 0..1 scroll phase along the column (0 = head)
attribute float aHeadJit;   // small per-instance flicker seed
uniform float uTime;
uniform float uAtlasCols;
uniform float uAtlasRows;
uniform float uTrail;       // trail length in "phase" units
varying vec2 vUv;
varying float vFade;        // 0..1 brightness
varying float vHead;        // 1 at leading char
void main(){
  // atlas cell -> uv offset
  float cell = floor(aGlyph + 0.5);
  float col = mod(cell, uAtlasCols);
  float row = floor(cell / uAtlasCols);
  vec2 cellSize = vec2(1.0 / uAtlasCols, 1.0 / uAtlasRows);
  // quad uv is 0..1 (set on geometry); flip V so atlas reads upright
  vec2 quadUv = uv;
  vUv = vec2(col, (uAtlasRows - 1.0) - row) * cellSize + quadUv * cellSize;

  // phase: 0 at the head, grows down the trail. brightness fades along the trail.
  float p = aColPhase;
  vFade = clamp(1.0 - p / uTrail, 0.0, 1.0);
  vFade = pow(vFade, 1.6);
  vHead = smoothstep(0.06, 0.0, p);

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uAtlas;
uniform float uTime;
uniform vec3 uLime;
uniform vec3 uHead;   // near-white head color
uniform vec3 uCyan;
varying vec2 vUv;
varying float vFade;
varying float vHead;
void main(){
  float a = texture2D(uAtlas, vUv).a;
  if (a < 0.04) discard;

  // trail = lime, drifting toward cyan deep in the tail; head punches to white
  vec3 col = mix(uLime, uCyan, (1.0 - vFade) * 0.5);
  col = mix(col, uHead, vHead);

  // subtle scanline flicker so it reads as a live terminal
  float flick = 0.85 + 0.15 * sin(uTime * 18.0 + gl_FragCoord.y * 0.35);

  float bright = (vFade * 0.9 + vHead * 1.6) * flick;
  gl_FragColor = vec4(col * bright, a * (vFade * 0.85 + vHead));
}
`;

export function matrixrain(): Effect {
  let ctx: Ctx;
  let scene: THREE.Scene;
  let cam: THREE.PerspectiveCamera;
  let mat: THREE.ShaderMaterial;
  let mesh: THREE.InstancedMesh;
  let atlas: THREE.CanvasTexture;
  let geo: THREE.PlaneGeometry;

  // layout
  const COLUMNS = 64;
  const PER_COL = 22; // glyphs per column
  const COUNT = COLUMNS * PER_COL;
  const SPACING = 0.62; // vertical spacing between glyphs (world units)
  const COL_HEIGHT = PER_COL * SPACING;
  const X_SPREAD = 22; // horizontal world width
  const TRAIL = PER_COL * SPACING * 0.92;

  // per-column state
  const colX = new Float32Array(COLUMNS);
  const colZ = new Float32Array(COLUMNS);
  const colSpeed = new Float32Array(COLUMNS);
  const colHead = new Float32Array(COLUMNS); // current head Y (descends)
  const colTop = new Float32Array(COLUMNS); // wrap-around top
  const colSwap = new Float32Array(COLUMNS); // glyph-swap timer

  // per-instance scratch attrs
  let aGlyph: Float32Array;
  let aColPhase: Float32Array;
  let aHeadJit: Float32Array;

  const dummy = new THREE.Object3D();
  const NGLYPH = Math.min(GLYPHS.length, ATLAS_COLS * ATLAS_ROWS);

  return {
    init(c) {
      ctx = c;
      ctx.renderer.autoClear = true;
      scene = new THREE.Scene();
      scene.background = C.void.clone();

      cam = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
      cam.position.set(0, 0, 16);

      atlas = buildAtlas();

      geo = new THREE.PlaneGeometry(0.5, 0.62);

      mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uAtlas: { value: atlas },
          uAtlasCols: { value: ATLAS_COLS },
          uAtlasRows: { value: ATLAS_ROWS },
          uTrail: { value: TRAIL },
          uLime: { value: C.lime },
          uCyan: { value: C.cyan },
          uHead: { value: new THREE.Color('#eafff0') },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
      });

      mesh = new THREE.InstancedMesh(geo, mat, COUNT);
      mesh.frustumCulled = false;

      aGlyph = new Float32Array(COUNT);
      aColPhase = new Float32Array(COUNT);
      aHeadJit = new Float32Array(COUNT);

      // init columns
      const halfTop = COL_HEIGHT * 0.7;
      for (let i = 0; i < COLUMNS; i++) {
        colX[i] = (i / (COLUMNS - 1) - 0.5) * X_SPREAD + (Math.random() - 0.5) * 0.25;
        colZ[i] = -6 + Math.random() * 14; // depth spread
        colSpeed[i] = 4.5 + Math.random() * 6.5; // world units / s
        colTop[i] = halfTop + Math.random() * 6;
        colHead[i] = (Math.random() - 0.5) * COL_HEIGHT * 2.0; // staggered start
        colSwap[i] = Math.random();
      }

      for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < PER_COL; j++) {
          const k = i * PER_COL + j;
          aGlyph[k] = Math.floor(Math.random() * NGLYPH);
          aColPhase[k] = j * SPACING; // static: distance behind the column head
          aHeadJit[k] = Math.random();
        }
      }
      geo.setAttribute('aGlyph', new THREE.InstancedBufferAttribute(aGlyph, 1));
      geo.setAttribute('aColPhase', new THREE.InstancedBufferAttribute(aColPhase, 1));
      geo.setAttribute('aHeadJit', new THREE.InstancedBufferAttribute(aHeadJit, 1));

      scene.add(mesh);
    },

    frame(t, dt) {
      const d = Math.min(dt, 0.05);
      mat.uniforms.uTime.value = t;

      const glyphAttr = geo.getAttribute('aGlyph') as THREE.InstancedBufferAttribute;
      let glyphDirty = false;

      for (let i = 0; i < COLUMNS; i++) {
        // descend head
        colHead[i] -= colSpeed[i] * d;
        const bottom = -colTop[i];
        const span = colTop[i] - bottom; // total wrap span
        if (colHead[i] < bottom) {
          colHead[i] += span + Math.random() * 4; // wrap with jitter
          colSpeed[i] = 4.5 + Math.random() * 6.5;
          colZ[i] = -6 + Math.random() * 14;
        }

        // occasional glyph swap to make the stream flicker/mutate
        colSwap[i] -= d;
        const swap = colSwap[i] <= 0;
        if (swap) colSwap[i] = 0.06 + Math.random() * 0.18;

        const z = colZ[i];
        const x = colX[i];
        for (let j = 0; j < PER_COL; j++) {
          const k = i * PER_COL + j;
          const y = colHead[i] + j * SPACING; // trailing chars sit ABOVE the head as it falls
          dummy.position.set(x, y, z);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(k, dummy.matrix);

          // mutate the leading few glyphs more often
          if (swap && (j < 3 || Math.random() < 0.12)) {
            aGlyph[k] = Math.floor(Math.random() * NGLYPH);
            glyphDirty = true;
          }
        }
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (glyphDirty) glyphAttr.needsUpdate = true;

      // gentle parallax from pointer
      const px = ctx.pointer.x;
      const py = ctx.pointer.y;
      cam.position.x += (px * 2.6 - cam.position.x) * 0.06;
      cam.position.y += (py * 1.8 - cam.position.y) * 0.06;
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
      atlas.dispose();
      mesh.dispose();
    },
  };
}
