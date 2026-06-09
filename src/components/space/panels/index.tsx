import type { ComponentType } from "react";
import type { PanelKey } from "../types";
import BioContent from "./BioContent";
import EducationContent from "./EducationContent";
import ExperienceContent from "./ExperienceContent";
import TechContent from "./TechContent";
import ProjectsContent from "./ProjectsContent";
import ContactContent from "./ContactContent";

/** Maps a node's panelKey to the React content rendered inside its panel. */
export const PANEL_CONTENT: Record<PanelKey, ComponentType> = {
  bio: BioContent,
  education: EducationContent,
  experience: ExperienceContent,
  tech: TechContent,
  projects: ProjectsContent,
  contact: ContactContent,
};

export {
  BioContent,
  EducationContent,
  ExperienceContent,
  TechContent,
  ProjectsContent,
  ContactContent,
};
