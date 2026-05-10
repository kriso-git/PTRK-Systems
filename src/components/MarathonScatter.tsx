"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Static scattered Marathon decoration — short hex/glitch tags scattered across
 * the page at low opacity, plus thin glitch blocks. Live-typing terminal lines
 * are now rendered by the body-level <LiveTerminalTypers /> component instead,
 * because they need fixed positioning above content (z-[40]) to be reliably
 * visible.
 *
 *  1) Permanent visibility — every element renders at low opacity with a
 *     subtle drift/pulse so the bg "lives" at every scroll position.
 *  2) Readability shield — on mount/resize/route-change we measure the
 *     bounding boxes of every prose element inside <main>; any scatter
 *     element whose box intersects a prose box fades to 0.
 */

const HEX_BURSTS = [
  "0xC2FE0C", "NOD·0A20", "LNK·EC11", "7F-A2-9D",
  "F3X·LIVE", "0xDEADBEEF", "200 OK", "▓▓▓▓",
  "@param", "// init", "RX·1153", "AUTH·OK",
  "PRT·443", "PORT·3000", "GIT·d5675", "SHA·8b3f9a",
  "RELAY·02", "PING·17ms", "BUILD·OK",
];

const COLORS = ["#c2fe0c", "#01ffff", "#ea027e", "#ff8c42"];

type ScatterItem = {
  top: string;
  left: string;
  text: string;
  color: string;
  delay: string;
  duration: string;
  size: number;
  baseOpacity: number;
};

// Static decorative scatter — only short hex/glitch tags. All actual terminal
// commands live-type in <LiveTerminalTypers /> at body level (z-[40]).
// The right ~18% of the viewport is reserved for the fixed
// <RightDataStream /> terminal aside on md+ screens. Scatter elements stay
// clear of it so they never appear to bleed onto/over the terminal box.
function buildScatter(): ScatterItem[] {
  return Array.from({ length: 60 }, (_, i) => {
    const x = (i * 73) % 1000 / 1000;
    const y = (i * 37 + 17) % 1000 / 1000;
    return {
      top: `${(y * 96 + 2).toFixed(2)}%`,
      left: `${(x * 74 + 2).toFixed(2)}%`,
      text: HEX_BURSTS[i % HEX_BURSTS.length],
      color: COLORS[i % 4],
      delay: `-${(i * 0.41) % 8}s`,
      duration: `${8 + (i % 5)}s`,
      size: 10,
      baseOpacity: 0.18 + ((i * 13) % 14) / 100,
    };
  });
}

const GLITCH_BLOCKS = Array.from({ length: 50 }, (_, i) => ({
  top: `${((i * 53 + 7) % 980) / 10}%`,
  left: `${((i * 37 + 13) % 740) / 10}%`,
  width: 6 + (i % 6) * 3,
  height: 1 + (i % 3),
  color: COLORS[(i + 1) % 4],
  delay: `-${(i * 0.31) % 6}s`,
  duration: `${3 + (i % 4)}s`,
}));

export function MarathonScatter() {
  const pathname = usePathname();
  const scatter = useMemo(() => buildScatter(), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const blockRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  // Overlap detection: hide any scatter element whose box intersects a
  // prose element inside <main>.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const proseEls = document.querySelectorAll<HTMLElement>(
        "main p, main h1, main h2, main h3, main h4, main h5, main h6, " +
          "main li, main dt, main dd, main button, main a, main label, " +
          "main blockquote, main input, main textarea, " +
          "header p, header h1, header a, header button, " +
          "footer p, footer a, footer h1, footer h2, footer h3, footer li"
      );
      const proseRects: Array<{ top: number; left: number; bottom: number; right: number }> = [];
      proseEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        proseRects.push({
          top: r.top + window.scrollY - 2,
          left: r.left - 2,
          bottom: r.bottom + window.scrollY + 2,
          right: r.right + 2,
        });
      });

      const next = new Set<string>();
      const checkRefs = (
        refs: (HTMLElement | null)[],
        prefix: string
      ) => {
        refs.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          const sTop = r.top + window.scrollY;
          const sLeft = r.left;
          const sBottom = r.bottom + window.scrollY;
          const sRight = r.right;
          for (const t of proseRects) {
            if (
              sRight >= t.left &&
              sLeft <= t.right &&
              sBottom >= t.top &&
              sTop <= t.bottom
            ) {
              next.add(`${prefix}-${i}`);
              break;
            }
          }
        });
      };
      checkRefs(itemRefs.current, "s");
      checkRefs(blockRefs.current, "g");
      setHidden(next);
    };

    // Run after layout settles.
    const t1 = setTimeout(compute, 80);
    const t2 = setTimeout(compute, 400);
    const t3 = setTimeout(compute, 1200);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(compute, 180);
    };
    window.addEventListener("resize", onResize);

    // Recompute when <main> mutates (route content swap, lazy content).
    const main = document.querySelector("main");
    let observer: MutationObserver | null = null;
    if (main) {
      observer = new MutationObserver(() => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(compute, 220);
      });
      observer.observe(main, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {scatter.map((s, i) => {
        const key = `s-${i}`;
        const isHidden = hidden.has(key);
        return (
          <span
            key={`${pathname}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute font-monospec tracking-[0.12em] whitespace-nowrap"
            style={{
              top: s.top,
              left: s.left,
              color: s.color,
              fontSize: `${s.size}px`,
              opacity: isHidden ? 0 : s.baseOpacity,
              transition: "opacity 320ms ease",
              animation: isHidden
                ? "none"
                : `scatterPulse ${s.duration} ease-in-out ${s.delay} infinite`,
            }}
          >
            {s.text}
          </span>
        );
      })}

      {GLITCH_BLOCKS.map((g, i) => {
        const key = `g-${i}`;
        const isHidden = hidden.has(key);
        return (
          <span
            key={`gb-${pathname}-${i}`}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="absolute"
            style={{
              top: g.top,
              left: g.left,
              width: `${g.width}px`,
              height: `${g.height}px`,
              background: g.color,
              opacity: 0,
              transition: "opacity 320ms ease",
              animation: isHidden
                ? "none"
                : `glitchFlicker ${g.duration} steps(1) ${g.delay} infinite`,
            }}
          />
        );
      })}

    </div>
  );
}
