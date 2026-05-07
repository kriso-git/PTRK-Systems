import { colorMap } from "@/lib/colors";
import type { AccentColor } from "@/data/projects";

type Position = "tl" | "tr" | "bl" | "br";

const positions: Record<Position, string> = {
  tl: "top-3 left-3 border-t-2 border-l-2",
  tr: "top-3 right-3 border-t-2 border-r-2",
  bl: "bottom-3 left-3 border-b-2 border-l-2",
  br: "bottom-3 right-3 border-b-2 border-r-2",
};

const dotPos: Record<Position, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
};

export function Crosshair({
  position = "tl",
  color = "lime",
}: {
  position?: Position;
  color?: AccentColor;
}) {
  const c = colorMap[color];
  return (
    <div
      aria-hidden
      className={`absolute ${positions[position]} ${c.border} w-5 h-5 pointer-events-none opacity-80`}
    >
      <span
        className={`absolute ${dotPos[position]} w-1 h-1 ${c.bg}`}
        style={{
          transform:
            position === "tl"
              ? "translate(-50%, -50%)"
              : position === "tr"
              ? "translate(50%, -50%)"
              : position === "bl"
              ? "translate(-50%, 50%)"
              : "translate(50%, 50%)",
        }}
      />
    </div>
  );
}
