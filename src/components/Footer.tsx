import { Crosshair } from "./Crosshair";

export function Footer() {
  return (
    <footer className="border-t-2 border-lime/20 bg-void px-6 md:px-10 py-10 md:py-12 relative">
      <Crosshair position="tl" color="lime" />
      <Crosshair position="tr" color="cyan" />

      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="font-monospec text-[11px] text-secondary tracking-widest">
          © 2026 PTRK SYSTEMS — DESIGN ENGINEERING UNIT
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="font-fraktion text-sm text-secondary hover:text-lime transition-colors">
            Privacy
          </a>
          <a href="#" className="font-fraktion text-sm text-secondary hover:text-lime transition-colors">
            Terms
          </a>
          <a
            href="https://github.com/kriso-git"
            target="_blank"
            rel="noopener noreferrer"
            className="font-fraktion text-sm text-secondary hover:text-lime transition-colors"
          >
            GitHub
          </a>
        </div>
        <div className="font-monospec text-[10px] text-cyan/40 tracking-widest">
          ESCAPE WILL MAKE ME ████
        </div>
      </div>
    </footer>
  );
}
