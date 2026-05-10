export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center gap-3 mt-20 md:mt-28 opacity-70 hover:opacity-100 transition-opacity"
    >
      <span className="font-monospec text-[10px] tracking-[0.4em] uppercase text-secondary">
        ▽ {label}
      </span>
      <span
        className="block w-px h-12 bg-gradient-to-b from-lime/80 to-transparent"
        style={{ animation: "scrollPulse 2.4s ease-in-out infinite" }}
      />
      <span className="font-monospec text-[9px] tracking-[0.4em] uppercase text-lime/60">
        § 01 ↓
      </span>
    </div>
  );
}
