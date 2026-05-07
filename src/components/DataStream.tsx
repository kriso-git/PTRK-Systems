const STREAMS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 6.25 + (i % 3) * 1.7).toFixed(1)}%`,
  delay: `${(i * 0.43) % 5}s`,
  duration: `${4.2 + ((i * 0.7) % 3.6)}s`,
  payload: i % 2 === 0
    ? `01010011\n11001010\n00110101\n10101100\n01011001\n11100010`
    : `0xEC1153\n0xC2FE0C\nNOD·0A20\nLNK·EC11\n7F-A2-9D\n${(i * 1153).toString(16).toUpperCase()}`,
}));

export function DataStream() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Vertical streams */}
      <div className="absolute inset-0 opacity-[0.08]">
        {STREAMS.map((s, i) => (
          <pre
            key={i}
            className="absolute top-0 font-monospec text-[10px] leading-tight text-lime whitespace-pre"
            style={{
              left: s.left,
              animation: `dataStream ${s.duration} linear ${s.delay} infinite`,
            }}
          >
            {s.payload}
          </pre>
        ))}
      </div>

      {/* Scanline */}
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent"
        style={{ animation: "scanline 7s linear infinite" }}
      />

      {/* Horizontal HUD ticker */}
      <div
        className="absolute top-[40%] inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent"
        style={{ animation: "scanline 14s linear infinite reverse" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #c2fe0c 1px, transparent 1px), linear-gradient(to bottom, #c2fe0c 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Noise / static dots */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(#01ffff 0.5px, transparent 0.5px), radial-gradient(#c2fe0c 0.5px, transparent 0.5px)",
          backgroundSize: "120px 120px, 200px 200px",
          backgroundPosition: "0 0, 60px 60px",
        }}
      />
    </div>
  );
}
