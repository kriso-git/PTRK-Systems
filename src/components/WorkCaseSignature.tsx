"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/data/projects";

// ssr:false (View + three read the DOM/window) – loaded only in the browser,
// which a Server Component can't do directly, hence this client island.
const ProjectSignature = dynamic(
  () => import("@/components/r3f/ProjectSignature").then((m) => m.ProjectSignature),
  { ssr: false }
);

/** /work case signature – a standing per-project object in the case's Preview
 *  column. Always shown on full (idle animation, brightens when hovered); a
 *  static accent-glow on lite. */
export function WorkCaseSignature({ project }: { project: Project }) {
  return (
    <ProjectSignature
      projectId={project.id}
      color={project.color}
      className="relative mt-6 h-[170px] w-full overflow-hidden rounded-lg border border-white/5"
    />
  );
}
