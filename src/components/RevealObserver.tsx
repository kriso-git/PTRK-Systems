"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One shared IntersectionObserver for every [data-reveal] element.
 * Marks elements with data-inview="true" once and unobserves them —
 * the wipe-in itself is pure CSS (globals.css), gated behind
 * html[data-js] + prefers-reduced-motion so no-JS/RM users always
 * see the content.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // data-js is set HERE (not in an inline script) so the CSS hidden
    // state only ever exists once the revealer is provably alive — if
    // the JS bundle never runs, every [data-reveal] stays visible.
    document.documentElement.setAttribute("data-js", "");

    const els = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-inview])",
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-inview", "true");
            io.unobserve(entry.target);
          }
        }
      },
      // threshold 0: tall articles (taller than the viewport) would never
      // hit a 15% visibility ratio on small screens. rootMargin -18%:
      // fire when the element is properly INSIDE the viewport, so the
      // wipe is actually visible — at -8% it ran at the screen edge and
      // finished before the visitor's eye arrived.
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
