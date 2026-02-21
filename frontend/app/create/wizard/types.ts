import type { ProjectDirFile } from "@/app/components/ProjectDirSidebar";
import type { LibraryProject } from "@/lib/api/types";

export type ProjectChoice = null | "create" | "choose";

export interface WizardProject {
  id: string;
  name: string;
  files: ProjectDirFile[];
}

export function toWizardProject(p: LibraryProject): WizardProject {
  return {
    id: p.id,
    name: p.name,
    files: (p.files ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      type: (f.type === "stem" ? "stem" : f.type === "modification" ? "modification" : "composition") as "composition" | "stem" | "modification",
      createdAt: undefined,
    })),
  };
}

export interface WizardStep {
  id: string;
  title: string;
}
