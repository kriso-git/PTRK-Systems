"use client";

import { acquireNode } from "@/lib/nodes";

/** Wraps a piece of lore text as a clickable node-acquire trigger. */
export function NodeTrigger({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => acquireNode(id)}
      className={`cursor-pointer appearance-none bg-transparent border-0 p-0 font-inherit text-inherit tracking-inherit ${className ?? ""}`}
      aria-label="Rejtett rendszer-kód"
    >
      {children}
    </button>
  );
}
