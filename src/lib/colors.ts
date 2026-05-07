import type { AccentColor } from "@/data/projects";

type ClassSet = {
  text: string;
  bg: string;
  border: string;
  borderHover: string;
  borderSoft: string;
  bgSoft: string;
  shadow: string;
};

export const colorMap: Record<AccentColor, ClassSet> = {
  lime: {
    text: "text-lime",
    bg: "bg-lime",
    border: "border-lime",
    borderHover: "hover:border-lime",
    borderSoft: "border-lime/30",
    bgSoft: "bg-lime/10",
    shadow: "hover:shadow-lime/40",
  },
  cyan: {
    text: "text-cyan",
    bg: "bg-cyan",
    border: "border-cyan",
    borderHover: "hover:border-cyan",
    borderSoft: "border-cyan/30",
    bgSoft: "bg-cyan/10",
    shadow: "hover:shadow-cyan/40",
  },
  magenta: {
    text: "text-magenta",
    bg: "bg-magenta",
    border: "border-magenta",
    borderHover: "hover:border-magenta",
    borderSoft: "border-magenta/30",
    bgSoft: "bg-magenta/10",
    shadow: "hover:shadow-magenta/40",
  },
  orange: {
    text: "text-orange",
    bg: "bg-orange",
    border: "border-orange",
    borderHover: "hover:border-orange",
    borderSoft: "border-orange/30",
    bgSoft: "bg-orange/10",
    shadow: "hover:shadow-orange/40",
  },
};
