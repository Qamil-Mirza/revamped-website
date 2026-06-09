import type { ComponentType } from "react";
import type { PanelKey } from "../../types";
import BioTerminal from "./BioTerminal";
import EducationTerminal from "./EducationTerminal";
import ExperienceTerminal from "./ExperienceTerminal";
import TechTerminal from "./TechTerminal";
import ProjectsTerminal from "./ProjectsTerminal";
import ContactTerminal from "./ContactTerminal";

/** Maps a node's panelKey to its CRT terminal content (space-scene view). */
export const TERMINAL_PANELS: Record<PanelKey, ComponentType> = {
  bio: BioTerminal,
  education: EducationTerminal,
  experience: ExperienceTerminal,
  tech: TechTerminal,
  projects: ProjectsTerminal,
  contact: ContactTerminal,
};
