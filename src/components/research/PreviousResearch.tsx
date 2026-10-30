import { PREVIOUS_RESEARCH } from "@/lib/research";

export function PreviousResearch() {
  return (
    <section className="mx-auto max-w-[1200px] px-[18px] pb-[30px] pt-[34px] md:px-9 md:pb-10 md:pt-11">
      <h2 className="mb-3 font-[family-name:var(--font-geist-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7067] md:mb-[18px] md:text-[13px]">
        Previous research
      </h2>
      <div>
        {PREVIOUS_RESEARCH.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1.5 border-t border-[#dcdbd2] py-4 transition-all duration-200 last:border-b md:grid-cols-[150px_1fr_auto] md:gap-6 md:py-5 md:hover:pl-2.5"
          >
            <div className="col-span-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.06em] text-[#6b7067] md:col-span-1 md:text-[11px]">
              {item.when}
            </div>
            <div>
              <div className="text-base font-medium leading-snug tracking-[-0.01em] text-[#1c1f1a] transition-colors group-hover:text-[#15803d] md:text-[19px]">
                {item.title}
              </div>
              <div className="mt-1 text-[13px] text-[#6b7067] md:text-sm">{item.summary}</div>
            </div>
            <span className="text-[#6b7067] transition-colors group-hover:text-[#15803d]">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
