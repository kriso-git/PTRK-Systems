const ENTRIES = [
  { ts: "2026-05-08 14:22", code: "DEPLOY", msg: "ptrk_systems_v0.1.0_live", color: "lime" },
  { ts: "2026-05-07 09:48", code: "OPS", msg: "fexyke.hu_ssl_renewed", color: "cyan" },
  { ts: "2026-05-04 16:31", code: "AUDIT", msg: "donna_pizza_lighthouse_98", color: "lime" },
  { ts: "2026-04-29 11:02", code: "MERGE", msg: "molekulax_pubmed_refs_added", color: "magenta" },
  { ts: "2026-04-22 08:14", code: "INIT", msg: "ptrk_systems_v0_commit", color: "orange" },
  { ts: "2026-04-15 13:50", code: "SHIP", msg: "fexyke_terminal_supabase_rls", color: "cyan" },
] as const;

const COLOR_DOT: Record<string, string> = {
  lime: "bg-lime",
  cyan: "bg-cyan",
  magenta: "bg-magenta",
  orange: "bg-orange",
};

export function SysLog() {
  return (
    <div className="bg-surface border border-lime/15 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-lime/10 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-lime cursor-blink" />
          <span className="font-monospec text-[10px] text-lime tracking-[0.3em]">SYS.LOG · LIVE</span>
        </div>
        <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.25em]">
          NOD·0A20070A
        </span>
      </div>

      {/* Entries */}
      <div className="divide-y divide-lime/5">
        {ENTRIES.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-5 py-3 hover:bg-lime/5 transition-colors"
          >
            <span className={`w-1.5 h-1.5 ${COLOR_DOT[e.color]}`} />
            <span className="font-monospec text-[10px] text-secondary tracking-wider">{e.ts}</span>
            <span className="font-monospec text-[11px] md:text-xs text-primary tracking-wider truncate">
              <span className="text-cyan/70">{e.code}</span> · {e.msg}
            </span>
            <span className="font-monospec text-[9px] text-secondary/50">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-lime/10 bg-black/40 flex items-center justify-between">
        <span className="font-monospec text-[10px] text-secondary tracking-[0.25em]">
          ▓▓▓ END.OF.STREAM
        </span>
        <span className="font-monospec text-[10px] text-lime/60 tracking-widest">
          06 / 06
        </span>
      </div>
    </div>
  );
}
