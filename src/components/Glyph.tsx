import type { CSSProperties } from "react";

type GlyphName =
  | "cross-petal"
  | "hex-triangle"
  | "diamond-arrow"
  | "lime-hex"
  | "bracket-x"
  | "scan-block";

const PATHS: Record<GlyphName, React.ReactNode> = {
  // 4-leaf cross-petal (the white shape from the reference)
  "cross-petal": (
    <>
      <path d="M32 4 Q32 26 14 32 Q32 38 32 60 Q32 38 50 32 Q32 26 32 4 Z" />
    </>
  ),
  // hexagon with triangle inside (small top, bigger lime variant)
  "hex-triangle": (
    <>
      <polygon points="32,2 58,17 58,47 32,62 6,47 6,17" fill="none" strokeWidth="3" />
      <polygon points="32,18 48,42 16,42" />
    </>
  ),
  // 4-direction arrow diamond
  "diamond-arrow": (
    <>
      <path d="M32 4 L42 14 L36 14 L36 26 L48 26 L48 20 L58 32 L48 44 L48 38 L36 38 L36 50 L42 50 L32 60 L22 50 L28 50 L28 38 L16 38 L16 44 L6 32 L16 20 L16 26 L28 26 L28 14 L22 14 Z" />
    </>
  ),
  // solid lime hexagon with center hole
  "lime-hex": (
    <>
      <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" />
      <circle cx="32" cy="32" r="9" fill="#050508" />
    </>
  ),
  // bracket + X protocol marker
  "bracket-x": (
    <>
      <path d="M8 8 L8 24 M8 8 L24 8 M56 8 L40 8 M56 8 L56 24 M8 56 L8 40 M8 56 L24 56 M56 56 L40 56 M56 56 L56 40" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M22 22 L42 42 M42 22 L22 42" stroke="currentColor" strokeWidth="3" />
    </>
  ),
  // pixel scan block
  "scan-block": (
    <>
      <rect x="6" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
      <rect x="22" y="14" width="6" height="6" />
      <rect x="6" y="22" width="6" height="6" />
      <rect x="22" y="22" width="6" height="6" />
      <rect x="6" y="30" width="6" height="6" />
      <rect x="14" y="30" width="6" height="6" />
      <rect x="22" y="30" width="6" height="6" />
      <rect x="38" y="14" width="20" height="6" />
      <rect x="38" y="24" width="14" height="4" />
      <rect x="38" y="32" width="20" height="4" />
    </>
  ),
};

export function Glyph({
  name,
  size = 56,
  color = "currentColor",
  className = "",
  style,
}: {
  name: GlyphName;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill={color}
      stroke={color}
      className={className}
      style={style}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
