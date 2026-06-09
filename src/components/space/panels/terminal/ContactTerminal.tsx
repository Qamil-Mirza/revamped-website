import Link from "next/link";
import { CONTACT } from "../../content-data";
import { Prompt, Reveal, THeading, TDivider } from "../../terminal/crt";

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Contact "comms uplink" terminal readout. */
export default function ContactTerminal() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Prompt command="cat contact.txt" />
      </Reveal>
      <Reveal>
        <TDivider />
      </Reveal>

      <Reveal>
        <div className="space-y-2">
          <THeading>Primary Channel</THeading>
          <a
            href={`mailto:${CONTACT.email}`}
            className={`crt-text crt-border crt-hoverable ${MONO} flex items-baseline gap-2 border px-3 py-2 text-sm`}
          >
            <span className="opacity-50">{">"}</span>
            <span className="opacity-95">{CONTACT.email}</span>
          </a>
        </div>
      </Reveal>

      <Reveal>
        <div className="space-y-2">
          <THeading>Open Frequencies</THeading>
          <div className="space-y-1.5">
            {CONTACT.socials.map((social, i) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`crt-text crt-border crt-hoverable group ${MONO} flex items-center gap-2 border px-3 py-2 text-sm`}
              >
                <span className="opacity-60">
                  [ CH-{String(i + 1).padStart(2, "0")} ]
                </span>
                <social.Icon className="h-4 w-4" />
                <span className="opacity-95">{social.label}</span>
                <span className="crt-border ml-auto min-w-6 flex-1 translate-y-[-2px] border-b border-dotted opacity-30" />
                <span className="text-xs opacity-70 group-hover:opacity-100">
                  connect ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <Link
          href="/contact"
          className={`crt-text crt-border crt-hoverable ${MONO} inline-block border px-3 py-1.5 text-sm`}
        >
          {"> mail qamil"}
        </Link>
      </Reveal>
    </div>
  );
}
