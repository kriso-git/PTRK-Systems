import Link from "next/link";

const COORD = "47.4979°N · 19.0402°E";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-void px-6 md:pl-10 md:pr-[260px] py-10 md:py-14 relative z-10">
      <div className="max-w-[1700px] mx-auto">
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
    </footer>
  );
}
