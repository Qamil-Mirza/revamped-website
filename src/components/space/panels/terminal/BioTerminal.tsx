import qamil from "@/public/qm.jpg";
import { BIO } from "../../content-data";
import { Prompt, Reveal, CrtImage, TDivider } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** "Who I Am" terminal readout. */
export default function BioTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="whoami" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-[170px_1fr]">
        <Reveal>
          <CrtImage src={qamil.src} alt="Qamil Mirza" />
        </Reveal>
        <div className="space-y-3">
          <Reveal>
            <h2 className={`crt-text ${MONO} text-lg font-bold uppercase tracking-wider`}>
              {BIO.tagline}
            </h2>
          </Reveal>
          {BIO.paragraphs.map((paragraph, i) => (
            <Reveal key={i}>
              <p className={`crt-text ${MONO} text-sm leading-relaxed opacity-95`}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
