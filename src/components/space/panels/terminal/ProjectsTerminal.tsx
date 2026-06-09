import Link from "next/link";
import { PROJECT_HIGHLIGHTS } from "../../content-data";
import { Prompt, Reveal, THeading, TDivider, TTag } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Projects & research "directory listing" terminal readout. */
export default function ProjectsTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="ls -la ~/projects" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>
      {PROJECT_HIGHLIGHTS.map((project, i) => (
        <Reveal key={project.title}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="crt-border crt-hoverable group block border-l-2 pl-3"
          >
            <THeading>{`PROJ_${String(i + 1).padStart(2, "0")}`}</THeading>
            <div
              className={`crt-text ${MONO} mt-1 text-sm font-bold leading-snug`}
            >
              {project.title}
            </div>
            <p className={`crt-text ${MONO} mt-1 text-sm leading-relaxed opacity-85`}>
              {project.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <TTag key={tag}>{tag}</TTag>
              ))}
            </div>
            <div
              className={`crt-text ${MONO} mt-2 text-xs opacity-70 group-hover:opacity-100`}
            >
              {"> access "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </div>
          </a>
        </Reveal>
      ))}
      <Reveal>
        <Link
          href="/projects"
          className={`crt-text crt-border crt-hoverable ${MONO} inline-block border px-3 py-1.5 text-sm`}
        >
          {"> cd ~/projects"}
        </Link>
      </Reveal>
    </div>
  );
}
