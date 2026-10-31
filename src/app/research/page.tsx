import { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/ui/nav-bar";
import { LabAnimation } from "@/components/research/LabAnimation";
import { PreviousResearch } from "@/components/research/PreviousResearch";
import { ResearchJournal } from "@/components/research/ResearchJournal";
import { HERO } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research | Qamil Mirza",
  alternates: {
    canonical: "https://qamil-mirza.com/research",
  },
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-[#f5f4ee] font-[family-name:var(--font-geist-sans)] text-[#1c1f1a]">
      <NavBar variant="light" />

      <section className="mx-auto max-w-[1200px] px-[18px] pt-7 md:px-9 md:pt-14">
        <h1 className="mb-2.5 max-w-[720px] text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] md:mb-3.5 md:text-[44px] md:leading-[1.08]">
          {HERO.headline}
        </h1>
        <p className="m-0 max-w-[600px] text-sm leading-[1.55] text-[#6b7067] md:text-base md:leading-[1.6]">
          {HERO.lede}
        </p>
      </section>

      <div className="mt-[22px] md:mt-[34px]">
        <LabAnimation />
      </div>

      <div className="mx-auto flex max-w-[1200px] justify-between gap-7 px-[18px] pt-3.5 font-[family-name:var(--font-geist-mono)] text-[10px] text-[#6b7067] md:justify-start md:px-9 md:pb-0 md:pt-4 md:text-[11px]">
        <span>{HERO.meta}</span>
        <Link href={HERO.linkHref} className="text-[#15803d] hover:underline">
          {HERO.linkLabel}
        </Link>
      </div>

      <ResearchJournal />
      <PreviousResearch />
    </div>
  );
}
