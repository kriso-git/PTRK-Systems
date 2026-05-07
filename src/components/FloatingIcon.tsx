"use client";

import { useEffect, useRef, useState } from "react";

const REPEL_RADIUS = 200;
const MAX_OFFSET = 30;

export function FloatingIcon({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS) {
        const angle = Math.atan2(dy, dx);
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        setPos({
          x: -Math.cos(angle) * force * MAX_OFFSET,
          y: -Math.sin(angle) * force * MAX_OFFSET,
        });
      } else if (pos.x !== 0 || pos.y !== 0) {
        setPos({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [pos.x, pos.y]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
