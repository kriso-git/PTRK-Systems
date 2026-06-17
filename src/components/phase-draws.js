/* eslint-disable */
// Per-phase canvas visuals for ProcessJourney. Plain JS (untyped) on purpose so
// the hand-tuned draw routines stay terse. Each: (ctx, W, H, t, p, accent) => void,
// stateless, centered on W/2,H/2, no clearRect (the host clears).

const drawResearch = (ctx, W, H, t, p, accent) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H), R = S * 0.42;
  const ease = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineCap = "round";
  ctx.font = `${Math.round(S * 0.026)}px monospace`;

  // --- concentric range rings (build in with p) ---
  const rings = 4;
  for (let i = 1; i <= rings; i++) {
    const rp = ease((p - (i - 1) * 0.12) * 1.6);
    if (rp <= 0) continue;
    ctx.globalAlpha = 0.18 + 0.22 * rp;
    ctx.strokeStyle = i === rings ? accent : accent + "55";
    ctx.lineWidth = i === rings ? 1.4 : 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, R * (i / rings) * rp, 0, Math.PI * 2);
    ctx.stroke();
  }

  // --- fine ticked outer bezel ---
  const bp = ease((p - 0.25) * 1.8);
  if (bp > 0) {
    const ticks = 72;
    for (let i = 0; i < ticks; i++) {
      const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
      const major = i % 6 === 0;
      const r0 = R * (major ? 1.02 : 1.05), r1 = R * 1.09;
      ctx.globalAlpha = (major ? 0.85 : 0.4) * bp;
      ctx.strokeStyle = accent;
      ctx.lineWidth = major ? 1.2 : 0.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.stroke();
    }
  }

  // --- crosshair ---
  ctx.globalAlpha = 0.3 * bp;
  ctx.strokeStyle = accent + "55";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-R, 0); ctx.lineTo(R, 0);
  ctx.moveTo(0, -R); ctx.lineTo(0, R);
  ctx.stroke();

  // --- rotating sweep + afterglow wedge ---
  const sweepP = ease((p - 0.35) * 2);
  if (sweepP > 0) {
    const sweep = (t * 1.1) % (Math.PI * 2);
    const grad = ctx.createConicGradient(sweep - 0.9, 0, 0);
    grad.addColorStop(0, accent + "00");
    grad.addColorStop(0.85, accent + "00");
    grad.addColorStop(1, accent + "44");
    ctx.globalAlpha = sweepP;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, sweep - 0.9, sweep);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.shadowColor = accent; ctx.shadowBlur = 12;
    ctx.globalAlpha = sweepP;
    ctx.strokeStyle = accent; ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(sweep) * R, Math.sin(sweep) * R);
    ctx.stroke();
    ctx.restore();

    // --- blips: lock as sweep passes, label flashes & fades ~1s ---
    const N = 7;
    const codes = ["0xAF", "0x3C", "0x91", "0xE0", "0x7B", "0x52", "0xC4"];
    for (let i = 0; i < N; i++) {
      const ba = (Math.sin(i * 12.9898) * 0.5 + 0.5) * Math.PI * 2;
      const br = R * (0.28 + (Math.sin(i * 78.233) * 0.5 + 0.5) * 0.62);
      const bx = Math.cos(ba) * br, by = Math.sin(ba) * br;
      const rev = (t * 1.1) / (Math.PI * 2);
      const passes = Math.floor(rev) + (((t * 1.1) % (Math.PI * 2)) >= ba ? 1 : 0);
      const lastPass = passes * (Math.PI * 2) + ba;
      const since = t * 1.1 - lastPass;
      const lock = since >= 0 && since < 1 ? 1 - since : 0;
      ctx.globalAlpha = (0.45 + 0.55 * lock) * sweepP;
      ctx.fillStyle = accent;
      ctx.save();
      ctx.shadowColor = accent; ctx.shadowBlur = 6 + 10 * lock;
      ctx.beginPath();
      ctx.arc(bx, by, S * 0.009 * (1 + lock), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (lock > 0.01) {
        const b = S * 0.03 * (1 + (1 - lock) * 0.5), g = b * 0.4;
        ctx.globalAlpha = lock * sweepP;
        ctx.strokeStyle = accent; ctx.lineWidth = 1.3;
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(bx + sx * b, by + sy * b - sy * g);
          ctx.lineTo(bx + sx * b, by + sy * b);
          ctx.lineTo(bx + sx * b - sx * g, by + sy * b);
          ctx.stroke();
        }
        ctx.globalAlpha = lock * sweepP;
        ctx.fillStyle = accent;
        ctx.fillText(codes[i], bx + b + S * 0.012, by - b);
      }
    }
  }
  ctx.restore();
};

const drawArchitecture = (ctx, W, H, t, p, accent) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H);
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3);
  // hierarchy: 1 root, 3 children, 6 grandchildren — positions relative to center
  const root = { x: 0, y: -0.34, lvl: 0 };
  const kids = [-0.26, 0, 0.26].map(dx => ({ x: dx, y: -0.04, lvl: 1 }));
  const gkids = [];
  kids.forEach((k, ki) => {
    [-0.085, 0.085].forEach(dx => gkids.push({ x: k.x + dx, y: 0.28, lvl: 2, parent: k }));
  });
  const P = v => ({ x: cx + v.x * S, y: cy + v.y * S });
  // per-level draw-in windows of p
  const lvlProg = lvl => ease((p - lvl * 0.22) / 0.42);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const drawn = []; // nodes whose connector has reached them

  const drawElbow = (a, b, prog, lvl) => {
    const pa = P(a), pb = P(b);
    const midY = pa.y + (pb.y - pa.y) * 0.5;
    const pts = [pa, { x: pa.x, y: midY }, { x: pb.x, y: midY }, pb];
    let total = 0, segs = [];
    for (let i = 0; i < 3; i++) {
      const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
      segs.push(d); total += d;
    }
    const reach = total * prog;
    ctx.strokeStyle = accent + '55';
    ctx.lineWidth = 1.1;
    ctx.shadowBlur = 8; ctx.shadowColor = accent;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    let run = 0;
    for (let i = 0; i < 3; i++) {
      if (reach >= run + segs[i]) { ctx.lineTo(pts[i + 1].x, pts[i + 1].y); }
      else { const f = Math.max(0, (reach - run) / segs[i]); ctx.lineTo(pts[i].x + (pts[i + 1].x - pts[i].x) * f, pts[i].y + (pts[i + 1].y - pts[i].y) * f); break; }
      run += segs[i];
    }
    ctx.stroke();
    // data pulse traveling down the connector
    if (prog > 0.4) {
      const pf = (Math.sin(t * 1.6 - lvl * 0.9) * 0.5 + 0.5) * Math.min(prog, 1);
      const dist = total * pf; run = 0;
      for (let i = 0; i < 3; i++) {
        if (dist <= run + segs[i]) {
          const f = (dist - run) / segs[i];
          const px = pts[i].x + (pts[i + 1].x - pts[i].x) * f, py = pts[i].y + (pts[i + 1].y - pts[i].y) * f;
          ctx.fillStyle = '#fff'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(px, py, 2, 0, 7); ctx.fill();
          break;
        }
        run += segs[i];
      }
    }
    ctx.shadowBlur = 0;
    return prog >= 0.999;
  };

  // connectors level by level
  kids.forEach(k => { if (drawElbow(root, k, lvlProg(0), 0)) drawn.push(k); });
  gkids.forEach(g => { if (drawElbow(g.parent, g, lvlProg(1), 1)) drawn.push(g); });

  // node draw helper: diamond, pops in via reach of its incoming connector
  const node = (v, prog, big) => {
    const pp = P(v);
    const s = ease(prog) * (big ? 9 : 6) * (0.9 + 0.1 * Math.sin(t * 2 + v.x * 8));
    if (s < 0.5) return;
    ctx.save();
    ctx.translate(pp.x, pp.y);
    ctx.rotate(Math.PI / 4);
    ctx.shadowBlur = 14; ctx.shadowColor = accent;
    ctx.strokeStyle = accent; ctx.lineWidth = 1.4;
    ctx.fillStyle = accent + '22';
    ctx.beginPath(); ctx.rect(-s, -s, s * 2, s * 2); ctx.fill(); ctx.stroke();
    if (big) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.rect(-s * 0.32, -s * 0.32, s * 0.64, s * 0.64); ctx.fill(); }
    ctx.restore();
  };

  node(root, ease((p - 0) / 0.3), true);
  kids.forEach(k => node(k, lvlProg(0)));
  gkids.forEach(g => node(g, lvlProg(1)));
  ctx.restore();
};

const drawDesign = (ctx, W, H, t, p, accent) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H);
  const ease = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  const R = (i, a) => 0.5 + 0.5 * Math.sin(i * 12.9898 + a * 78.233);
  ctx.save();
  ctx.translate(cx, cy);

  // --- composition panels: 3 overlapping translucent rounded rects ---
  const panels = [
    { w: 0.60, h: 0.78, x: -0.20, y: -0.06, a: 0.10 },
    { w: 0.46, h: 0.52, x:  0.14, y: -0.18, a: 0.16 },
    { w: 0.40, h: 0.40, x:  0.10, y:  0.18, a: 0.22 },
  ];
  panels.forEach((pn, i) => {
    const pp = ease((p - i * 0.12) / 0.6);
    if (pp <= 0) return;
    const slide = (1 - pp) * S * (i % 2 ? 0.5 : -0.5);
    const br = 0.18 + 0.06 * Math.sin(t * 0.6 + i * 2.1); // breathe
    const w = pn.w * S * (0.96 + 0.04 * Math.sin(t * 0.5 + i));
    const h = pn.h * S * (0.96 + 0.04 * Math.cos(t * 0.5 + i));
    const x = pn.x * S + slide + Math.sin(t * 0.3 + i * 2) * S * 0.012;
    const y = pn.y * S + Math.cos(t * 0.35 + i * 3) * S * 0.012;
    const rad = Math.min(w, h) * (0.10 + 0.04 * br);
    ctx.globalAlpha = pp;
    ctx.fillStyle = accent + (i === 0 ? "22" : "55");
    ctx.strokeStyle = accent + "55";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, rad);
    ctx.fill();
    ctx.stroke();
  });

  // --- golden-ratio + baseline guide grid ---
  ctx.globalAlpha = ease((p - 0.25) / 0.5) * 0.5;
  ctx.strokeStyle = accent + "55";
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 4]);
  const G = S * 0.42, phi = 0.618;
  [-phi, -phi + 1, 0].forEach((f) => {
    const vx = f * G;
    ctx.beginPath(); ctx.moveTo(vx, -G); ctx.lineTo(vx, G); ctx.stroke();
  });
  for (let r = -4; r <= 4; r++) { // baseline rhythm
    const ly = (r / 4) * G * (1 - phi);
    ctx.beginPath(); ctx.moveTo(-G, ly); ctx.lineTo(G, ly); ctx.stroke();
  }
  ctx.setLineDash([]);

  // --- big type specimen "Aa" ---
  const tp = ease((p - 0.4) / 0.5);
  if (tp > 0) {
    ctx.globalAlpha = tp;
    ctx.font = `700 ${S * 0.40}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.beginPath();
    ctx.rect(-G, -G, 2 * G, 2 * G * (0.5 + 0.5 * tp)); // reveal wipe
    ctx.clip();
    ctx.shadowBlur = 24; ctx.shadowColor = accent;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Aa", -S * 0.04, S * 0.02);
    ctx.restore();
    ctx.globalAlpha = tp * 0.5;
    ctx.lineWidth = 1; ctx.strokeStyle = accent;
    ctx.strokeText("Aa", -S * 0.04, S * 0.02);
  }

  // --- color swatch row ---
  const sw = ease((p - 0.55) / 0.45);
  if (sw > 0) {
    ctx.shadowBlur = 0;
    const n = 5, sz = S * 0.052, gap = S * 0.018;
    const total = n * sz + (n - 1) * gap;
    const sy = G * 0.78;
    for (let i = 0; i < n; i++) {
      const si = ease(sw - i * 0.08);
      if (si <= 0) continue;
      const sx = -total / 2 + i * (sz + gap);
      const al = (0.25 + 0.7 * R(i, 3)).toString(16);
      ctx.globalAlpha = si;
      ctx.fillStyle = accent + ("0" + Math.floor((0.2 + 0.7 * R(i, 3)) * 255).toString(16)).slice(-2);
      ctx.strokeStyle = accent + "55";
      ctx.lineWidth = 1;
      const wob = Math.sin(t * 1.2 + i) * sz * 0.05;
      ctx.beginPath();
      ctx.roundRect(sx, sy + wob, sz, sz, sz * 0.22);
      ctx.fill(); ctx.stroke();
    }
    ctx.globalAlpha = sw * 0.6;
    ctx.font = `${S * 0.026}px monospace`;
    ctx.fillStyle = accent;
    ctx.textAlign = "left";
    ctx.fillText("PALETTE / 05", -total / 2, sy - sz * 0.5);
  }

  ctx.restore();
};

const drawDevelopment = (ctx, W, H, t, p, accent) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H), R = S * 0.42;
  const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
  // 6 pad nodes on a loose ring
  const N = 6, pads = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + 0.35 + rnd(i, 1) * 0.4;
    const rr = R * (0.45 + rnd(i, 2) * 0.5);
    pads.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
  }
  // traces connect consecutive pads + a couple of cross links (Manhattan paths)
  const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4]];
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.font = `${Math.round(S * 0.045)}px monospace`;
  const padHit = new Array(N).fill(0);

  links.forEach((lk, li) => {
    const a = pads[lk[0]], b = pads[lk[1]];
    // Manhattan: horizontal-first or vertical-first per seed, with a bend point
    const hFirst = rnd(li, 5) > 0.5;
    const bx = hFirst ? b.x : a.x, by = hFirst ? a.y : b.y;
    const seg = [[a.x, a.y], [bx, by], [b.x, b.y]];
    // total length for progressive draw + pulse param
    const L1 = Math.hypot(bx - a.x, by - a.y), L2 = Math.hypot(b.x - bx, b.y - by);
    const total = L1 + L2 || 1;
    // draw-in progress for this trace (staggered by index)
    const dp = Math.max(0, Math.min(1, (p - li * 0.04) / 0.6));
    if (dp <= 0) return;
    // build dashed-draw by clipping length
    const drawLen = total * dp;
    ctx.beginPath();
    ctx.moveTo(seg[0][0], seg[0][1]);
    if (drawLen <= L1) {
      const k = drawLen / (L1 || 1);
      ctx.lineTo(a.x + (bx - a.x) * k, a.y + (by - a.y) * k);
    } else {
      ctx.lineTo(bx, by);
      const k = (drawLen - L1) / (L2 || 1);
      ctx.lineTo(bx + (b.x - bx) * k, by + (b.y - by) * k);
    }
    ctx.strokeStyle = accent + "55"; ctx.lineWidth = S * 0.006; ctx.stroke();
    // bright pulse travels along when fully (or mostly) drawn
    if (dp > 0.92) {
      const speed = 0.35 + rnd(li, 7) * 0.3;
      const ph = ((t * speed + rnd(li, 9)) % 1);
      const along = ph * total;
      let px, py;
      if (along <= L1) { const k = along / (L1 || 1); px = a.x + (bx - a.x) * k; py = a.y + (by - a.y) * k; }
      else { const k = (along - L1) / (L2 || 1); px = bx + (b.x - bx) * k; py = by + (b.y - by) * k; }
      ctx.save();
      ctx.shadowBlur = S * 0.06; ctx.shadowColor = accent;
      ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(px, py, S * 0.012, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // arrival flash: light up destination pad in last 12% of travel
      if (ph > 0.88) padHit[lk[1]] = Math.max(padHit[lk[1]], (ph - 0.88) / 0.12);
    }
  });

  // pads
  pads.forEach((pd, i) => {
    const ap = Math.max(0, Math.min(1, (p - 0.1 - i * 0.05) / 0.4));
    if (ap <= 0) return;
    const r = S * 0.022 * ap;
    const lit = padHit[i];
    ctx.save();
    ctx.globalAlpha = ap;
    ctx.shadowBlur = S * (0.02 + lit * 0.08); ctx.shadowColor = accent;
    ctx.fillStyle = "#0a0e12";
    ctx.beginPath(); ctx.rect(pd.x - r, pd.y - r, r * 2, r * 2); ctx.fill();
    ctx.lineWidth = S * 0.005; ctx.strokeStyle = lit > 0.05 ? "#fff" : accent;
    ctx.stroke();
    // inner core
    ctx.fillStyle = accent; ctx.globalAlpha = ap * (0.4 + lit * 0.6);
    ctx.beginPath(); ctx.arc(pd.x, pd.y, r * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });

  // code-bracket glyphs near two nodes
  ctx.save();
  ctx.fillStyle = accent; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.globalAlpha = Math.max(0, (p - 0.5) / 0.5);
  ctx.shadowBlur = S * 0.03; ctx.shadowColor = accent;
  const blink = 0.6 + 0.4 * Math.sin(t * 3);
  ctx.globalAlpha *= blink;
  ctx.fillText("</>", pads[0].x + S * 0.06, pads[0].y - S * 0.05);
  ctx.fillText("{ }", pads[3].x - S * 0.06, pads[3].y + S * 0.05);
  ctx.restore();

  ctx.restore();
};

const drawTesting = (ctx, W, H, t, p, accent) => {
  const S = Math.min(W, H), cx = W / 2, cy = H / 2;
  const R = S * 0.46;
  const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  ctx.save();
  ctx.translate(cx, cy);

  // ---- scope frame (square, centered) ----
  const half = S * 0.34;
  ctx.lineWidth = 1;
  // faint grid
  ctx.strokeStyle = accent + "22";
  const divs = 8;
  for (let i = 0; i <= divs; i++) {
    const g = (i / divs) * 2 - 1, gx = g * half;
    const gap = (i / divs) * ease; // grid wipes in
    if (gap <= 0) continue;
    ctx.globalAlpha = 0.7 * ease;
    ctx.beginPath(); ctx.moveTo(gx, -half * gap); ctx.lineTo(gx, half * gap); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-half * gap, gx); ctx.lineTo(half * gap, gx); ctx.stroke();
  }
  ctx.globalAlpha = ease;
  // center crosshair brighter
  ctx.strokeStyle = accent + "55";
  ctx.beginPath(); ctx.moveTo(-half, 0); ctx.lineTo(half, 0); ctx.stroke();
  // frame border
  ctx.strokeStyle = accent + "55";
  ctx.strokeRect(-half, -half, half * 2, half * 2);

  // ---- waveforms (composite sines, scrolling) ----
  ctx.save();
  ctx.beginPath(); ctx.rect(-half, -half, half * 2, half * 2); ctx.clip();
  const waves = [
    { f: 2.2, a: 0.55, s: 1.4, ph: 0.0, w: 2.2, alpha: 1.0 },
    { f: 3.7, a: 0.32, s: -0.9, ph: 1.7, w: 1.6, alpha: 0.7 },
    { f: 1.3, a: 0.7, s: 0.6, ph: 3.1, w: 1.3, alpha: 0.45 },
  ];
  const N = 90;
  for (let wi = 0; wi < waves.length; wi++) {
    const wv = waves[wi];
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const u = i / N, x = (u * 2 - 1) * half;
      const ph = u * Math.PI * 2 * wv.f + t * wv.s + wv.ph;
      const amp = wv.a * half * 0.5 * ease;
      const y = Math.sin(ph) * amp + Math.sin(ph * 2.3 + wv.ph) * amp * 0.22;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.globalAlpha = wv.alpha * ease;
    ctx.lineWidth = wv.w;
    ctx.strokeStyle = accent;
    ctx.shadowColor = accent; ctx.shadowBlur = 10 * ease;
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // ---- vertical scan line ----
  const scanU = (t * 0.32) % 1;
  const sx = (scanU * 2 - 1) * half;
  ctx.globalAlpha = 0.9 * ease;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.2;
  ctx.shadowColor = accent; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(sx, -half); ctx.lineTo(sx, half); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // ---- stream of pass-marks (OK ticks) along the top ----
  const maxTicks = Math.round(7 * p);
  ctx.font = `${Math.round(S * 0.028)}px monospace`;
  ctx.textBaseline = "middle";
  for (let i = 0; i < maxTicks; i++) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const appear = Math.min(1, Math.max(0, (t * 1.5 + i * 0.4) % 6 - i * 0.05));
    const fade = 0.55 + 0.45 * Math.sin(t * 2 + i);
    const tx = -half + (i / 6) * half * 2 + half * 0.15;
    const ty = -half - S * 0.045;
    ctx.globalAlpha = ease * (0.5 + 0.5 * fade);
    // check tick
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = accent; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(tx - 5, ty);
    ctx.lineTo(tx - 1, ty + 4);
    ctx.lineTo(tx + 6, ty - 5);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ---- iteration arrow loop (rotating ring + arrowhead) ----
  const ir = R * 0.92;
  const rot = t * 0.7;
  const sweep = Math.PI * 1.55 * ease;
  ctx.globalAlpha = ease * 0.9;
  ctx.lineWidth = 2;
  ctx.strokeStyle = accent + "55";
  ctx.shadowColor = accent; ctx.shadowBlur = 8 * ease;
  ctx.beginPath();
  ctx.arc(0, 0, ir, rot, rot + sweep);
  ctx.stroke();
  // arrowhead at the leading end
  const ae = rot + sweep;
  const ax = Math.cos(ae) * ir, ay = Math.sin(ae) * ir;
  const tang = ae + Math.PI / 2;
  const ah = S * 0.03;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(ax + Math.cos(tang) * ah, ay + Math.sin(tang) * ah);
  ctx.lineTo(ax + Math.cos(ae) * ah * 0.6, ay + Math.sin(ae) * ah * 0.6);
  ctx.lineTo(ax - Math.cos(tang) * ah * 0.5, ay - Math.sin(tang) * ah * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
};

const drawLaunch = (ctx, W, H, t, p, accent) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H);
  const ease = p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p);
  ctx.save();
  ctx.translate(cx, cy);

  // --- Concentric signal rings radiating outward (broadcast loop) ---
  const ringCount = Math.round(4 + ease * 4);
  const maxR = S * 0.45;
  for (let i = 0; i < ringCount; i++) {
    const phase = (t * 0.45 + i / ringCount) % 1;
    const r = phase * maxR;
    const a = (1 - phase) * (1 - phase) * ease;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = accent;
    ctx.globalAlpha = a * 0.85;
    ctx.lineWidth = 1 + (1 - phase) * 2.5;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 14 * a;
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // --- Tick reticle ring (assembles in with p) ---
  ctx.globalAlpha = ease * 0.5;
  ctx.strokeStyle = accent + "55";
  ctx.lineWidth = 1;
  const baseR = S * 0.30;
  const ticks = 48;
  for (let i = 0; i < ticks; i++) {
    if (i / ticks > ease) break;
    const ang = (i / ticks) * Math.PI * 2 - Math.PI / 2;
    const long = i % 4 === 0;
    const r0 = baseR, r1 = baseR + (long ? 9 : 4);
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0);
    ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
    ctx.stroke();
  }

  // --- Ascending particle streaks (liftoff trajectories) ---
  const pCount = Math.round(ease * 22);
  for (let i = 0; i < pCount; i++) {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const sx = ((seed - Math.floor(seed)) - 0.5) * S * 0.34;
    const spd = 0.35 + (Math.sin(i * 78.233) * 0.5 + 0.5) * 0.55;
    const life = (t * spd + (Math.cos(i * 3.17) * 0.5 + 0.5)) % 1;
    const wob = Math.sin(life * 6 + i) * S * 0.015;
    const y = (0.5 - life) * S * 0.82;
    const fade = Math.sin(life * Math.PI);
    const len = S * (0.04 + spd * 0.05);
    ctx.globalAlpha = fade * ease * 0.9;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 8 * fade;
    ctx.beginPath();
    ctx.moveTo(sx + wob, y);
    ctx.lineTo(sx + wob, y + len);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // --- Bright pulsing core ---
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  const coreR = S * (0.035 + 0.02 * pulse) * ease;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR * 3);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.35, accent);
  grad.addColorStop(1, accent + "00");
  ctx.globalAlpha = ease;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, coreR * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = ease;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, 0, coreR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- "● LIVE" tag, pulsing ---
  const blink = 0.55 + 0.45 * Math.sin(t * 5);
  ctx.globalAlpha = ease;
  ctx.font = `600 ${Math.round(S * 0.045)}px monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const tagY = -S * 0.40;
  ctx.fillStyle = accent;
  ctx.globalAlpha = ease * blink;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 10 * blink;
  ctx.beginPath();
  ctx.arc(-S * 0.06, tagY, S * 0.012, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = ease;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("LIVE", -S * 0.038, tagY);

  ctx.restore();
};

export { drawResearch, drawArchitecture, drawDesign, drawDevelopment, drawTesting, drawLaunch };
