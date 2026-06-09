import { EXPERIENCE } from "../../content-data";
import { Prompt, Reveal, THeading, TDivider, TList, TTag } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Experience "service record" terminal log. */
export default function ExperienceTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="cat experience.log" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>
      {EXPERIENCE.map((job, i) => (
        <Reveal key={`${job.org}-${job.period}`}>
          <div className="space-y-2">
            <THeading>{`[ ${job.period} ]`}</THeading>
            <div className={`crt-text ${MONO} text-base font-bold leading-snug`}>
              {job.title}
            </div>
            <div className={`crt-text ${MONO} text-sm opacity-70`}>{job.org}</div>
            <TList items={job.points} />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {job.tags.map((tag) => (
                <TTag key={tag}>{tag}</TTag>
              ))}
            </div>
            {i < EXPERIENCE.length - 1 && (
              <div className="pt-2">
                <TDivider />
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
