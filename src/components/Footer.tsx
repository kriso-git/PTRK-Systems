import Link from "next/link";

const COORD = "47.4979°N · 19.0402°E";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-void px-6 md:pl-10 md:pr-[260px] pb-10 md:pb-14 relative z-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Oversized outline wordmark finale — bleeds off the bottom edge
            of its clipping band, classic editorial closing chord */}
        <div aria-hidden className="overflow-hidden pointer-events-none">
          <div className="text-ghost font-khinterference uppercase text-lime/20 text-[clamp(72px,14vw,200px)] leading-[0.8] tracking-[0.02em] translate-y-[22%] whitespace-nowrap">
            PTRK Systems
          </div>
        </div>
        <div className="pt-8 md:pt-10">
        <div className="grid grid-cols-12 gap-y-8 md:gap-x-10 items-baseline">
          <div className="col-span-12 md:col-span-4 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            PTRK Systems · Design Engineering Unit
          </div>

          <nav className="col-span-12 md:col-span-5 flex flex-wrap gap-x-8 gap-y-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
            <Link href="/" className="hover:text-lime transition-colors">
              § 00 · Index
            </Link>
            <Link href="/work" className="hover:text-lime transition-colors">
              § 02 · Work
            </Link>
            <Link href="/method" className="hover:text-lime transition-colors">
              § 03 · Method
            </Link>
            <Link href="/lab" className="hover:text-lime transition-colors">
              § 05 · Lab
            </Link>
            <Link href="/connect" className="hover:text-lime transition-colors">
              § 06 · Connect
            </Link>
          </nav>

          <div className="col-span-12 md:col-span-3 md:text-right font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary/60">
            {COORD}
            <span className="block mt-1 text-secondary/40">© 2026 · Budapest</span>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
