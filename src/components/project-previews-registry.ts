import type { ComponentType } from "react";
import { F3xykeePreview, MolekulaXPreview } from "./ProjectPreviews";

export const PROJECT_PREVIEWS: Record<string, ComponentType> = {
  "f3xykee-terminal": F3xykeePreview,
  molekulax: MolekulaXPreview,
};
