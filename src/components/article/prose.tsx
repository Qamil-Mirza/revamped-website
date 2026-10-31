// Building blocks for long-form research write-ups on the light research theme.
import { cn } from "@/lib/utils";
import { renderTex } from "@/lib/article-math";
import { referenceNumber } from "@/lib/article-refs";

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("my-5 text-[17px] leading-[1.75] text-[#2b2f29] md:text-[18px]", className)}>{children}</p>;
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-4 mt-16 scroll-mt-24 text-[26px] font-semibold leading-tight tracking-[-0.015em] text-[#1c1f1a] md:text-[30px]"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-10 text-[20px] font-semibold tracking-[-0.01em] text-[#1c1f1a] md:text-[22px]">{children}</h3>;
}

// Prompts, memories and model outputs quoted in the text.
export function Quote({ label, children, tone = "plain" }: { label?: string; children: React.ReactNode; tone?: "plain" | "model" }) {
  return (
    <div
      className={cn(
        "my-5 rounded-xl border px-4 py-3 text-[15px] leading-relaxed",
        tone === "model" ? "border-[#1c1f1a] bg-[#1c1f1a] text-[#f5f4ee]" : "border-[#dcdbd2] bg-white text-[#2b2f29]",
      )}
    >
      {label && (
        <div
          className={cn(
            "mb-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em]",
            tone === "model" ? "text-[#9aa096]" : "text-[#6b7067]",
          )}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function Tex({ children, display = false }: { children: string; display?: boolean }) {
  const html = renderTex(children, display);
  return display ? (
    <div className="my-6 overflow-x-auto py-1 text-[#1c1f1a]" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className="text-[#1c1f1a]" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function Cite({ id }: { id: string }) {
  const n = referenceNumber(id);
  return (
    <sup className="ml-0.5">
      <a href={`#ref-${n}`} className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#15803d] hover:underline">
        [{n}]
      </a>
    </sup>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[#1c1f1a]">{children}</strong>;
}

export function Figure({ children, caption, wide = false }: { children: React.ReactNode; caption: React.ReactNode; wide?: boolean }) {
  return (
    <figure className={cn("my-10", wide && "md:-mx-[90px]")}>
      <div className="overflow-hidden rounded-2xl border border-[#dcdbd2] bg-white">{children}</div>
      <figcaption className="mt-3 text-[13.5px] leading-relaxed text-[#6b7067]">{caption}</figcaption>
    </figure>
  );
}

export function List({ ordered = false, children }: { ordered?: boolean; children: React.ReactNode }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "my-5 space-y-2 pl-6 text-[17px] leading-[1.7] text-[#2b2f29] marker:text-[#15803d] md:text-[18px]",
        ordered ? "list-decimal" : "list-disc",
      )}
    >
      {children}
    </Tag>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-[#dcdbd2] bg-white">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14.5px] leading-relaxed">
        <thead>
          <tr className="border-b border-[#dcdbd2] bg-[#faf9f5]">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7067]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#ecebe4] align-top last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-3 text-[#2b2f29]",
                    j === 0 && "font-medium text-[#1c1f1a]",
                    j === row.length - 1 && "whitespace-nowrap font-[family-name:var(--font-geist-mono)] font-semibold text-[#1c1f1a]",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
