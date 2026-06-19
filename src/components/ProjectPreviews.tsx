/**
 * Stylized landing-page previews for each portfolio project.
 * Pure CSS/SVG – no iframe, no external images. Each component
 * faithfully captures the visual essence of the actual deployed site.
 */

export function F3xykeePreview() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#07080b" }}>
      {/* Top ticker bar */}
      <div
        className="absolute inset-x-0 top-0 h-5 flex items-center px-3 overflow-hidden"
        style={{ background: "rgba(24, 233, 104, 0.08)", borderBottom: "1px solid rgba(24, 233, 104, 0.2)" }}
      >
        <span className="font-monospec text-[7px] tracking-[0.4em]" style={{ color: "#18e968" }}>
          ▓ NOD·0A20070A · LIVE.FEED · LNK·EC1153EC · JEL.STREAM · ████
        </span>
      </div>

      {/* Vertical data streams left + right */}
      <div className="absolute left-2 top-8 bottom-8 w-12 opacity-30 overflow-hidden">
        <pre className="font-monospec text-[7px] leading-tight" style={{ color: "#18e968" }}>
{`01010011
11001010
00110101
10101100
01011001
11100010
0xEC1153
NOD·0A20
F3X·9D
0xC2FE0C
01010011
11001010
00110101
10101100`}
        </pre>
      </div>
      <div className="absolute right-2 top-8 bottom-8 w-12 opacity-25 overflow-hidden">
        <pre className="font-monospec text-[7px] leading-tight text-right" style={{ color: "#4df0ff" }}>
{`LNK·EC11
7F-A2-9D
LNK·EC11
NOD·0A20
0xEC1153
0xC2FE0C
01010011
11001010
F3X·LIVE
NOD·0A20
LNK·EC11`}
        </pre>
      </div>

      {/* Center headline + meta */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
        <div
          className="font-monospec text-[8px] tracking-[0.5em] mb-3 px-2 py-0.5 border"
          style={{ color: "#18e968", borderColor: "rgba(24, 233, 104, 0.4)" }}
        >
          ▓▓ V0.1.0 · LIVE
        </div>
        <div
          className="font-khinterference text-[clamp(32px,6vw,72px)] leading-[0.9] tracking-[0.04em] uppercase"
          style={{ color: "#fafafa" }}
        >
          F3XYKEE
        </div>
        <div
          className="font-khinterference text-[clamp(28px,5vw,60px)] leading-[0.9] tracking-[0.04em] uppercase mt-1"
          style={{ color: "#18e968" }}
        >
          / BLOG
        </div>
        <div className="font-shorai text-[10px] md:text-xs mt-4 max-w-md" style={{ color: "#7d8794" }}>
          „Minek ide idézet ha odabasz a kinézet"
        </div>
        <div className="flex gap-2 mt-5">
          {["INSTA", "TWITCH", "STEAM"].map((s) => (
            <span
              key={s}
              className="px-3 py-1 font-monospec text-[8px] tracking-[0.3em] border"
              style={{ borderColor: "rgba(24, 233, 104, 0.4)", color: "#18e968" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* HUD corners */}
      <div className="absolute top-7 left-2 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: "#18e968" }} />
      <div className="absolute top-7 right-2 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: "#4df0ff" }} />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: "#ff4dbf" }} />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: "#18e968" }} />

      {/* Scanline */}
      <div
        className="absolute inset-x-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, #18e96866, transparent)",
          animation: "scanline 4s linear infinite",
        }}
      />
    </div>
  );
}

export function MolekulaXPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#050505" }}>
      {/* Top ticker */}
      <div
        className="absolute inset-x-0 top-0 h-5 flex items-center px-3 overflow-hidden"
        style={{ borderBottom: "1px solid rgba(0, 255, 153, 0.2)" }}
      >
        <span className="font-shorai text-[8px] tracking-[0.3em]" style={{ color: "#00ff99" }}>
          ▶ PEPTIDTUDÁS · EDUKÁCIÓ · PUBMED · TELEGRAM · ▶ PEPTIDTUDÁS · EDUKÁCIÓ
        </span>
      </div>

      {/* Decorative blurred orbs */}
      <div
        className="absolute top-1/3 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20"
        style={{ background: "#00ff99" }}
      />
      <div
        className="absolute -bottom-12 left-1/4 w-40 h-40 rounded-full blur-3xl opacity-15"
        style={{ background: "#00ff99" }}
      />

      {/* Floating "Peptid edukáció" badge */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 backdrop-blur-md border rounded-full"
        style={{ background: "rgba(0, 255, 153, 0.05)", borderColor: "rgba(0, 255, 153, 0.3)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full cursor-blink" style={{ background: "#00ff99" }} />
        <span className="font-shorai text-[9px] tracking-wider" style={{ color: "#00ff99" }}>
          Peptid edukáció
        </span>
      </div>

      {/* Hero */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 pt-16">
        <div
          className="font-khinterference text-[clamp(36px,7vw,84px)] tracking-tight leading-[0.9]"
          style={{ color: "#fafafa" }}
        >
          MolekulaX
        </div>
        <div
          className="font-shorai italic text-sm md:text-base mt-3"
          style={{ color: "#00ff99", textShadow: "0 0 12px rgba(0, 255, 153, 0.4)" }}
        >
          – Peptidtudás és Edukáció
        </div>
        <div className="font-shorai text-[10px] md:text-xs mt-4 max-w-md leading-relaxed" style={{ color: "#9ca3af" }}>
          Tudásbázis, peer-reviewed PubMed tanulmányok, közvetlen szakértői kontakt.
        </div>
        <div className="flex gap-2 mt-5">
          <span
            className="px-4 py-1.5 font-shorai text-[10px] font-semibold rounded-md"
            style={{
              background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
              color: "#ffffff",
            }}
          >
            Kapcsolat Telegramon
          </span>
          <span
            className="px-4 py-1.5 font-shorai text-[10px] font-semibold rounded-md backdrop-blur-md border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "#fafafa" }}
          >
            TikTok
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-shorai text-[8px] tracking-widest opacity-50" style={{ color: "#00ff99" }}>
        ↓ SCROLL
      </div>
    </div>
  );
}

// DonnaPizzaPreview removed - Donna Pizza is no longer listed as a project.
