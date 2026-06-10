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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
