import Image from "next/image";
import { PROJECT_PREVIEWS } from "@/components/project-previews-registry";
import type { AccentColor, Project } from "@/data/projects";

/** Real screenshots of the live sites — captured by
    `node scripts/capture-previews.mjs`, re-run when the sites change.
    Falls back to the stylized PROJECT_PREVIEWS mock when missing. */
const PREVIEW_IMAGES: Record<string, string> = {
  "f3xykee-terminal": "/previews/f3xykee-terminal.webp",
  molekulax: "/previews/molekulax.webp",
  "donna-pizza": "/previews/donna-pizza.webp",
};

const ACCENT_HEX: Record<AccentColor, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

export function BrowserPreview({
  project,
  asLink = true,
}: {
  project: Project;
  /** Set false when an ancestor already provides the link context —
      nested <a> inside <a> is invalid HTML and breaks hydration. */
  asLink?: boolean;
}) {
  const accent = ACCENT_HEX[project.color];
  const visitUrl = project.url;
  const hasVisit = Boolean(visitUrl);
  const displayUrl = visitUrl
    ? visitUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `${project.id}.local`;

  const Preview = PROJECT_PREVIEWS[project.id];

  const Wrapper = asLink && hasVisit ? "a" : "div";
  const wrapperProps =
    asLink && hasVisit
      ? {
          href: visitUrl,
          target: "_blank" as const,
          rel: "noopener noreferrer" as const,
          "aria-label": `Visit ${project.name} live site`,
        }
      : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`relative block overflow-hidden bg-black border border-white/15 ${
        asLink && hasVisit ? "cursor-pointer group/preview" : "group/preview"
      }`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-black/80 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-magenta/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-orange/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-lime/70" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-surface border border-white/10 min-w-0">
          <span className="font-monospec text-[9px] text-secondary shrink-0">▶</span>
          <span className="font-monospec text-[10px] md:text-xs text-primary tracking-wider truncate">
            {hasVisit ? `https://${displayUrl}` : `${displayUrl} — soon`}
          </span>
        </div>
        <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.25em] hidden md:inline shrink-0 uppercase">
          {project.id}
        </span>
      </div>

      {/* Preview canvas */}
      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        {PREVIEW_IMAGES[project.id] ? (
          <>
            <Image
              src={PREVIEW_IMAGES[project.id]}
              alt={`${project.name} — élő oldal képernyőképe`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-top"
            />
            {/* Subtle scanline wash keeps the screenshot inside the HUD language */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 3px, rgba(5,5,8,0.9) 3px 4px)",
              }}
            />
          </>
        ) : Preview ? (
          <Preview />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-monospec text-xs text-secondary">
            Preview not available
          </div>
        )}

        {/* Hover overlay — only when THIS component is the link; otherwise
            the promise ("Visit …") would lie about where the click goes */}
        {asLink && hasVisit && (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-[2px]">
            <span
              className="font-monospec text-xs md:text-sm tracking-[0.4em] px-5 py-3 border bg-black/70 uppercase"
              style={{ color: accent, borderColor: `${accent}99` }}
            >
              ▓▓▓ Visit {displayUrl} →
            </span>
          </div>
        )}

        {/* Status badge */}
        <div
          className="absolute top-3 right-4 font-monospec text-[9px] tracking-[0.3em] z-10 pointer-events-none px-2 py-0.5 backdrop-blur-md"
          style={{ color: accent, background: "rgba(0,0,0,0.5)" }}
        >
          {hasVisit ? "● LIVE" : "○ SOON"}
        </div>
      </div>
    </Wrapper>
  );
}
