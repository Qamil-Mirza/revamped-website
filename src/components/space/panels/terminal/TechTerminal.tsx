import { TECH_GROUPS } from "../../content-data";
import { Prompt, Reveal, THeading, TDivider } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Tech stack "systems manifest" terminal readout with status lines. */
export default function TechTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="apt list --installed" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>
      {TECH_GROUPS.map((group) => (
        <Reveal key={group.title}>
          <div className="space-y-2">
            <THeading>{group.title}</THeading>
            <div className="space-y-1">
              {group.tools.map((tool) => (
                <div
                  key={tool.name}
                  className={`crt-text ${MONO} flex items-baseline gap-2 text-sm`}
                >
                  <span className="opacity-95">{tool.name}</span>
                  <span className="crt-border min-w-6 flex-1 translate-y-[-3px] border-b border-dotted opacity-40" />
                  <span className="text-xs opacity-70">
                    [ {tool.faded ? "AUX" : "ONLINE"} ]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
