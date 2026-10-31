import Link from "next/link";
import { JOURNAL } from "@/lib/research";

export function ResearchJournal() {
  return (
    <section className="mx-auto max-w-[1200px] px-[18px] pt-[34px] md:px-9 md:pt-11">
      <h2 className="mb-3 font-[family-name:var(--font-geist-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7067] md:mb-[18px] md:text-[13px]">
        Research journal
      </h2>
      <div>
        {JOURNAL.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1.5 border-t border-[#dcdbd2] py-4 transition-all duration-200 last:border-b md:grid-cols-[150px_1fr_auto] md:gap-6 md:py-5 md:hover:pl-2.5"
          >
            <div className="col-span-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.06em] text-[#6b7067] md:col-span-1 md:text-[11px]">
              <span className="text-[#15803d]">No. {String(entry.number).padStart(2, "0")}</span>
              <span className="md:hidden"> · </span>
              <span className="md:mt-0.5 md:block">{entry.date}</span>
            </div>
            <div>
              <div className="text-base font-medium leading-snug tracking-[-0.01em] text-[#1c1f1a] transition-colors group-hover:text-[#15803d] md:text-[19px]">
                {entry.title}
              </div>
              <div className="mt-1 text-[13px] text-[#6b7067] md:text-sm">{entry.summary}</div>
            </div>
            <span className="text-[#6b7067] transition-colors group-hover:text-[#15803d]">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
