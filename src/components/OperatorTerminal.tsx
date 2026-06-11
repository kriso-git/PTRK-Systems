"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS, TECH_STACK, ENGAGEMENT } from "@/data/projects";
import { acquireNode, getAcquired, NODES, NODE_COUNT } from "@/lib/nodes";

type Line = { text: string; tone?: "lime" | "cyan" | "magenta" | "dim" };

const BANNER: Line[] = [
  { text: "PTRK SYSTEMS — OPERATOR TERMINAL v1.0", tone: "lime" },
  { text: "NOD·0A20070A linked · type `help` for commands", tone: "dim" },
];

const TONE: Record<NonNullable<Line["tone"]>, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  dim: "text-secondary/70",
};

export function OperatorTerminal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  function print(...out: Line[]) {
    setLines((prev) => [...prev, ...out]);
  }

  function go(path: string, label: string) {
    print({ text: `▶ routing → ${label}`, tone: "cyan" });
    setTimeout(() => {
      router.push(path);
      onClose();
    }, 350);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    print({ text: `$ ${cmd}`, tone: "lime" });
    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);

    switch (head) {
      case "help":
        print(
          { text: "help · elérhető parancsok", tone: "dim" },
          { text: "projects · open <id> · work · method · lab · connect · home" },
          { text: "stack · status · whoami · nodes · boot · clear · exit" },
          { text: "sudo hire --budget <összeg> · ha komolyan gondolod", tone: "dim" },
        );
        break;
      case "projects":
        PROJECTS.forEach((p, i) =>
          print({
            text: `${String(i + 1).padStart(2, "0")} · ${p.id} — ${p.name} (${p.year})`,
          }),
        );
        print({ text: "open <id> a debriefhez", tone: "dim" });
        break;
      case "open": {
        const id = rest[0];
        if (!id) {
          print({ text: "usage: open <id> — pl. open molekulax", tone: "dim" });
          break;
        }
        const p = PROJECTS.find((x) => x.id === id || x.id.startsWith(id));
        if (p) go(`/work/${p.id}`, `${p.name} · mission debrief`);
        else
          print({
            text: `✗ ismeretlen projekt: ${id} — próbáld: projects`,
            tone: "magenta",
          });
        break;
      }
      case "work":
        go("/work", "§ 02 · archívum");
        break;
      case "method":
        go("/method", "§ 03 · method");
        break;
      case "lab":
        go("/lab", "§ 05 · lab");
        break;
      case "connect":
        go("/connect", "§ 06 · connect");
        break;
      case "home":
      case "cd":
        go("/", "§ 00 · index");
        break;
      case "stack":
        print({
          text: TECH_STACK.map((t) => t.name).join(" · "),
          tone: "cyan",
        });
        break;
      case "status":
        print(
          { text: `SLOT ........ ${ENGAGEMENT.nextSlot} open`, tone: "lime" },
          { text: `SPRINT ...... ${ENGAGEMENT.sprintRange}` },
          { text: `LAUNCH ...... ${ENGAGEMENT.launchRange}` },
          { text: `RESPONSE .... ${ENGAGEMENT.responseTime}` },
        );
        break;
      case "whoami": {
        acquireNode("whoami");
        print(
          { text: "VENDÉG · azonosítatlan operátor", tone: "cyan" },
          { text: "jogosultság: olvasás + felfedezés", tone: "dim" },
          { text: "▓ a rendszer mostantól számon tart.", tone: "magenta" },
        );
        break;
      }
      case "nodes": {
        const got = getAcquired();
        print({ text: `NODES ${got.length}/${NODE_COUNT}`, tone: "magenta" });
        Object.entries(NODES).forEach(([id, label]) =>
          print({
            text: `${got.includes(id) ? "■" : "□"} ${got.includes(id) ? label : "▓▓▓▓▓▓▓▓▓▓"}`,
            tone: got.includes(id) ? undefined : "dim",
          }),
        );
        break;
      }
      case "sudo": {
        if (rest[0] !== "hire") {
          print({
            text: `sudo: ${rest[0] ?? "?"}: permission denied — ez nem az a fajta rendszer.`,
            tone: "magenta",
          });
          break;
        }
        const budget = cmd.match(/--budget\s+(\S+)/)?.[1];
        print(
          { text: "sudo: jogosultság megadva. ✓", tone: "lime" },
          {
            text: budget
              ? `HIRE_REQ rögzítve · budget: ${budget} · routing → connect`
              : "HIRE_REQ rögzítve · routing → connect",
            tone: "cyan",
          },
        );
        setTimeout(() => {
          router.push("/connect");
          onClose();
        }, 700);
        break;
      }
      case "boot":
        print({ text: "▶ reboot…", tone: "cyan" });
        try {
          sessionStorage.removeItem("ptrk-booted");
        } catch {
          /* gated off */
        }
        setTimeout(() => window.location.reload(), 400);
        break;
      case "escape":
        print({ text: "ESCAPE WILL MAKE ME ████", tone: "magenta" });
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "q":
        onClose();
        break;
      default:
        print({
          text: `✗ command not found: ${head} — próbáld: help`,
          tone: "magenta",
        });
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Operátor terminál"
      className="fixed inset-x-0 bottom-0 z-[96] border-t-2 border-lime/60 bg-void/97 backdrop-blur-md"
    >
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between mb-3 font-monospec text-[10px] tracking-[0.3em] uppercase">
          <span className="text-lime flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            OPERATOR·TERMINAL
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-magenta transition-colors px-2"
            aria-label="Terminál bezárása"
          >
            [ESC] BEZÁR ✕
          </button>
        </div>

        <div
          ref={scrollRef}
          className="h-[34vh] max-h-[340px] overflow-y-auto font-monospec text-[12px] leading-relaxed tracking-[0.06em] pr-2"
        >
          {lines.map((l, i) => (
            <div key={i} className={l.tone ? TONE[l.tone] : "text-primary/90"}>
              {l.text}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
          className="mt-3 flex items-center gap-3 border-t border-lime/20 pt-3"
        >
          <span className="font-monospec text-lime text-sm shrink-0">▶</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent outline-none font-monospec text-[13px] text-primary tracking-[0.06em] placeholder:text-secondary/40"
            placeholder="help"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminál parancs"
          />
        </form>
      </div>
    </div>
  );
}
