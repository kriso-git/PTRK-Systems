// Shared per-project accent + pixel-icon mapping so the home work index and the
// /work archive flag each project identically (color -> text/bg/border + icon).
export type ProjectAccent = { text: string; bg: string; border: string; icon: string };

export const PROJECT_ACCENT: Record<string, ProjectAccent> = {
  lime: { text: "text-lime", bg: "bg-lime", border: "border-lime/40", icon: "computers-devices-electronics-monitor" },
  cyan: { text: "text-cyan", bg: "bg-cyan", border: "border-cyan/40", icon: "internet-network-wifi-monitor" },
  magenta: { text: "text-magenta", bg: "bg-magenta", border: "border-magenta/40", icon: "coding-apps-websites-shield-lock" },
  orange: { text: "text-orange", bg: "bg-orange", border: "border-orange/40", icon: "computers-devices-electronics-harddisk" },
};

export const projectAccent = (color: string): ProjectAccent => PROJECT_ACCENT[color] ?? PROJECT_ACCENT.orange;
