"use client";

import { useState } from "react";
import { Crosshair } from "./Crosshair";
import { DataStream } from "./DataStream";
import { PROJECTS, type Project, type AccentColor } from "@/data/projects";
import { colorMap } from "@/lib/colors";
import { PROJECT_PREVIEWS } from "./project-previews-registry";

const ACCENT_HEX: Record<AccentColor, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

// Hardcoded URLs — F3XYKEE has fexyke.hu but its CSP blocks iframe rendering,
// so we use a stylized preview component AND keep the click-through.
const VISIT_URL: Record<string, string | undefined> = {
  "f3xykee-terminal": "https://fexyke.hu",
};

function ProjectPreview({ project }: { project: Project }) {
  const accent = ACCENT_HEX[project.color];
  const visitUrl = VISIT_URL[project.id] ?? project.url;
  const hasVisit = Boolean(visitUrl);
  const displayUrl = visitUrl
    ? visitUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `${project.id}.local`;

  const Preview = PROJECT_PREVIEWS[project.id];

  const Wrapper = hasVisit ? "a" : "div";
  const wrapperProps = hasVisit
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
      className={`relative block bg-black border-b border-lime/20 overflow-hidden group ${
        hasVisit ? "cursor-pointer" : ""
      }`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-black/80 border-b border-lime/15 relative z-20">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-magenta/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-orange/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-lime/70" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-surface border border-lime/10 min-w-0">
          <span className="font-monospec text-[9px] text-secondary shrink-0">▶</span>
          <span className="font-monospec text-[10px] md:text-xs text-primary tracking-wider truncate">
            {hasVisit ? `https://${displayUrl}` : `${displayUrl} — soon`}
          </span>
        </div>
        <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.25em] hidden md:inline shrink-0">
          {project.id.toUpperCase()}
        </span>
      </div>

      {/* Stylized site preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        {Preview ? <Preview /> : (
          <div className="absolute inset-0 flex items-center justify-center font-monospec text-xs text-secondary">
            Preview not available
          </div>
        )}

        {/* Hover overlay — VISIT prompt */}
        {hasVisit && (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-[2px]">
            <span
              className="font-monospec text-xs md:text-sm tracking-[0.4em] px-5 py-3 border bg-black/70"
              style={{ color: accent, borderColor: `${accent}99` }}
            >
              ▓▓▓ VISIT {displayUrl} →
            </span>
          </div>
        )}

        {/* Live status badge */}
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

export function PortfolioTab() {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const c = colorMap[activeProject.color];

  return (
    <section className="min-h-screen px-6 md:px-10 py-24 md:py-32 bg-void relative tab-enter">
      <DataStream />

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16 md:mb-20 relative">
          <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-lime via-cyan to-magenta" />
          <div className="pl-6 md:pl-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-monospec text-[11px] text-magenta bg-magenta/10 border border-magenta/30 px-3 py-1.5 tracking-[0.2em]">
                SELECTED WORK █▓
              </span>
              <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.3em]">
                02 → PORTFOLIO
              </span>
            </div>
            <h2 className="font-khinterference text-[clamp(40px,7vw,108px)] leading-[1] mb-6 tracking-[0.02em] uppercase break-words">
              <span className="text-primary">Portfólió</span>
              <span className="text-lime">.</span>
            </h2>
            <p className="font-shorai text-lg md:text-xl text-secondary max-w-3xl leading-relaxed">
              Kattints egy projektre a részletekért. Minden munka a teljes design → engineering láncot mutatja, kutatástól prod-deployig.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Selector */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {PROJECTS.map((project, idx) => {
              const isActive = activeProject.id === project.id;
              const pc = colorMap[project.color];
              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={`w-full text-left p-6 md:p-8 border-l-4 transition-all duration-300 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-lime ${
                    isActive
                      ? `${pc.border} bg-surface scale-[1.02]`
                      : "border-transparent bg-surface/50 hover:border-lime/40 hover:bg-surface"
                  }`}
                >
                  {isActive && <Crosshair position="tr" color={project.color} />}
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div className={`font-khinterference text-2xl md:text-3xl tracking-[0.04em] uppercase transition-colors ${
                      isActive ? pc.text : "text-secondary group-hover:text-primary"
                    }`}>
                      {project.name}
                    </div>
                    <div className="font-monospec text-xs text-cyan bg-black/60 px-2.5 py-1">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="font-monospec text-xs md:text-sm text-cyan mb-1.5 tracking-wider">{project.client}</div>
                  <div className="font-monospec text-[10px] md:text-xs text-secondary tracking-[0.25em]">{project.role}</div>
                  <div className="mt-4 pt-3 border-t border-lime/10 flex items-center justify-between">
                    <span className="font-monospec text-xs text-secondary">{project.year}</span>
                    <span className={`font-ui text-xs ${isActive ? pc.text : "text-secondary"}`}>
                      {isActive ? "→ AKTÍV" : "→"}
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="mt-2 p-5 border border-dashed border-lime/20 bg-void/40 relative">
              <span className="font-monospec text-[10px] text-cyan/60 tracking-widest">SLOT_OPEN</span>
              <p className="font-shorai text-sm text-secondary mt-2 leading-relaxed">
                További projektek beadhatók egy új objektumként a{" "}
                <code className="font-monospec text-lime text-xs">src/data/projects.ts</code> fájlba.
              </p>
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-8">
            <div key={activeProject.id} className="bg-surface border border-lime/20 relative tab-enter">
              <Crosshair position="tl" color={activeProject.color} />
              <Crosshair position="br" color={activeProject.color} />

              <ProjectPreview project={activeProject} />

              <div className="p-7 md:p-12 space-y-7">
                <div className="bg-black/40 border-l-4 border-r-4 border-lime/20 p-6 md:p-10 relative">
                  <div className="font-khinterference text-5xl md:text-7xl text-primary mb-3 tracking-[0.04em] uppercase">
                    {activeProject.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="font-sequel text-base md:text-xl text-cyan tracking-tight">{activeProject.client}</span>
                    <span className={`w-3 h-3 ${c.bg}`} />
                    <span className="font-monospec text-sm text-secondary">{activeProject.year}</span>
                  </div>
                  <div className={`font-monospec text-sm md:text-base ${c.text} mb-5 tracking-[0.25em]`}>
                    {activeProject.role}
                  </div>
                  <p className="font-shorai text-base md:text-xl text-secondary leading-relaxed max-w-2xl">
                    {activeProject.desc}
                  </p>
                  <span className="absolute bottom-3 right-4 font-fraktion text-[10px] text-cyan/30">
                    [{activeProject.id}]
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-black/40 border border-lime/20 p-7 relative">
                    <div className="font-monospec text-[11px] text-secondary uppercase tracking-[0.25em] mb-4">
                      TECH STACK
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {activeProject.stack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2.5 bg-surface border border-lime/30 font-monospec text-xs md:text-sm tracking-[0.15em] text-primary hover:border-lime hover:text-lime transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`bg-black/40 border ${c.borderSoft} p-7 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-all relative`}>
                    <Crosshair position="tl" color={activeProject.color} />
                    <div className="font-monospec text-[11px] text-secondary mb-3 uppercase tracking-[0.2em]">
                      {activeProject.metricLabel}
                    </div>
                    <div className={`font-sequel text-4xl md:text-6xl ${c.text} leading-none tracking-[-0.02em]`}>
                      {activeProject.metric}
                    </div>
                  </div>
                </div>

                {(() => {
                  const liveUrl = VISIT_URL[activeProject.id] ?? activeProject.url;
                  if (!liveUrl) return null;
                  const display = liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
                  return (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-lime text-black font-monospec font-bold text-xs md:text-sm tracking-[0.3em] hover:shadow-2xl hover:shadow-lime/50 transition-all"
                    >
                      VISIT <span className="opacity-70">{display}</span> <span aria-hidden>→</span>
                    </a>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
