import { EDUCATION } from "../../content-data";
import { Prompt, Reveal, THeading, TDivider, TField, TTag } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Education "training record" terminal readout. */
export default function EducationTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="cat education.txt" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>
      {EDUCATION.map((entry, i) => (
        <Reveal key={entry.degree}>
          <div className="space-y-2">
            <THeading>
              {`RECORD ${String(i + 1).padStart(2, "0")} // ${entry.period}`}
            </THeading>
            <TField label="DEGREE" value={entry.degree} />
            <TField label="INSTITUTION" value={entry.institution} />
            <p className={`crt-text ${MONO} text-sm leading-relaxed opacity-90`}>
              {entry.detail}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {entry.tags.map((tag) => (
                <TTag key={tag}>{tag}</TTag>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
