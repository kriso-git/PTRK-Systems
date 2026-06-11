import type { Metadata } from "next";
import Link from "next/link";
import { Crosshair } from "@/components/Crosshair";
import { AcquireOnMount } from "@/components/AcquireOnMount";

export const metadata: Metadata = {
  title: "404 — Signal Lost",
};

const ERROR_LOG = [
  { t: "00:00.041", code: "RTE·404", msg: "route not resolved in nav graph" },
  { t: "00:00.087", code: "SCN·RUN", msg: "rescanning sector map … 0 hits" },
  { t: "00:00.112", code: "LNK·ERR", msg: "uplink target unreachable" },
  { t: "00:00.140", code: "SYS·REC", msg: "rerouting to known nodes ↓" },
];

const EXITS = [
  { href: "/", label: "Főoldal", code: "§ 00 · HOME" },
  { href: "/work", label: "Portfólió", code: "§ 02 · INDEX" },
  { href: "/connect", label: "Kontakt", code: "§ 06 · COMMS" },
];

export default function NotFound() {
  return (
    <section className="min-h-svh flex items-center px-6 md:px-10 py-32 tab-enter">
      <AcquireOnMount id="signal-lost" />
      <div className="max-w-[1100px] mx-auto w-full">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="font-monospec text-[11px] text-magenta bg-magenta/10 border border-magenta/30 px-3 py-1.5 tracking-[0.25em]">
            ▓▒ TRANSMISSION ERROR
          </span>
          <span className="font-monospec text-[10px] text-secondary tracking-[0.3em]">
            ERR·0x194 / NOD·0A20070A
          </span>
        </div>

        <h1 className="font-khinterference uppercase leading-[0.95] tracking-[0.02em] mb-4">
          <span className="block text-[clamp(56px,11vw,160px)] text-primary">
            Signal
          </span>
          <span className="block text-[clamp(56px,11vw,160px)] text-magenta">
            Lost.
          </span>
        </h1>
        <p className="font-sequel text-[clamp(28px,4vw,48px)] text-secondary/60 tracking-[-0.01em] mb-14">
          404 — a keresett szektor nem létezik.
        </p>

        <div className="relative bg-surface/80 border border-magenta/20 mb-14 max-w-[640px]">
          <Crosshair position="tr" color="magenta" />
          <div className="border-b border-magenta/20 px-5 py-3 font-monospec text-[10px] tracking-[0.3em] text-magenta/70">
            SYS.LOG · ERROR TRACE
          </div>
          {ERROR_LOG.map((row) => (
            <div
              key={row.t}
              className="grid grid-cols-[auto_auto_1fr] items-baseline gap-4 px-5 py-2.5 font-monospec text-[11px] tracking-[0.12em]"
            >
              <span className="text-secondary/50">{row.t}</span>
              <span className="text-magenta">{row.code}</span>
              <span className="text-secondary">{row.msg}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {EXITS.map((exit) => (
            <Link
              key={exit.href}
              href={exit.href}
              className="group flex flex-wrap items-baseline gap-4"
            >
              <span className="font-monospec text-[10px] tracking-[0.3em] text-cyan/60 group-hover:text-cyan transition-colors">
                {exit.code}
              </span>
              <span className="font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 group-hover:text-lime transition-colors">
                {exit.label} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
