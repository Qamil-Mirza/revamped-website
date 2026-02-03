"use client";

import { NavBar } from "@/components/ui/nav-bar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockClosedIcon, CheckCircledIcon, RocketIcon } from "@radix-ui/react-icons";
import Particles from "@/components/ui/particles";

interface MonthChallenge {
  month: string;
  year: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "coming-soon";
  tags?: string[];
  link?: string;
  videoLink?: string;
  highlights?: string[];
}

const challenges: MonthChallenge[] = [
  {
    month: "January",
    year: 2026,
    title: "The Daily Brief - AI Finance Newsletter Bot",
    description: "A fully automated daily finance/economics email bot that pulls news, summarizes with local LLM, generates audio podcasts, and sends beautifully formatted emails.",
    status: "completed",
    tags: ["Python", "Ollama", "Coqui TTS", "Docker", "MarketAux API"],
    link: "https://github.com/Qamil-Mirza/Wallstreet-PA",
    videoLink: "https://www.tiktok.com/t/ZThyTW4sn/",
    highlights: [
      "Multi-feed financial news aggregation from MarketAux",
      "Local LLM summarization with analyst-style voice",
      "Text-to-speech podcast generation with Coqui TTS",
      "Sectioned HTML email delivery via SMTP",
    ],
  },
  {
    month: "February",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the February challenge!",
    status: "coming-soon",
  },
  {
    month: "March",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the March challenge!",
    status: "coming-soon",
  },
  {
    month: "April",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the April challenge!",
    status: "coming-soon",
  },
  {
    month: "May",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the May challenge!",
    status: "coming-soon",
  },
  {
    month: "June",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the June challenge!",
    status: "coming-soon",
  },
  {
    month: "July",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the July challenge!",
    status: "coming-soon",
  },
  {
    month: "August",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the August challenge!",
    status: "coming-soon",
  },
  {
    month: "September",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the September challenge!",
    status: "coming-soon",
  },
  {
    month: "October",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the October challenge!",
    status: "coming-soon",
  },
  {
    month: "November",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the November challenge!",
    status: "coming-soon",
  },
  {
    month: "December",
    year: 2026,
    title: "Coming Soon",
    description: "Stay tuned for the December challenge!",
    status: "coming-soon",
  },
];

function StatusBadge({ status }: { status: MonthChallenge["status"] }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
          <CheckCircledIcon className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30">
          <RocketIcon className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case "coming-soon":
      return (
        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30">
          <LockClosedIcon className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>
      );
  }
}

function ChallengeCard({ challenge, index }: { challenge: MonthChallenge; index: number }) {
  const isLocked = challenge.status === "coming-soon";

  return (
    <BlurFade delay={0.1 + index * 0.05} inView>
      <Card
        className={`relative overflow-hidden transition-all duration-300 h-full ${
          isLocked
            ? "bg-gray-900/50 border-gray-700/50 opacity-60"
            : "bg-gray-900/80 border-gray-700 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10"
        }`}
      >
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <LockClosedIcon className="w-8 h-8 text-gray-500" />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-400">
              {challenge.month} {challenge.year}
            </span>
            <StatusBadge status={challenge.status} />
          </div>
          <CardTitle className="text-xl text-white">{challenge.title}</CardTitle>
          <CardDescription className="text-gray-400">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-green-500/10 text-green-300 border-green-500/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {challenge.highlights && challenge.highlights.length > 0 && (
            <ul className="space-y-2">
              {challenge.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start text-sm text-gray-300">
                  <span className="text-green-400 mr-2">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {challenge.link && (
              <a
                href={challenge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
              >
                View Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {challenge.videoLink && (
              <a
                href={challenge.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors text-sm font-medium"
              >
                Watch Demo
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.18a8.27 8.27 0 004.77 1.51V7.24a4.83 4.83 0 01-1-.55z" />
                </svg>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );
}

export default function ChallengesPage() {
  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const inProgressCount = challenges.filter((c) => c.status === "in-progress").length;

  return (
    <div className="bg-backgroundColor min-h-screen">
      <NavBar />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={50}
          ease={80}
          color={"#4ade80"}
          refresh
        />
        <BlurFade delay={0.1} inView>
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Building Something Every Month
          </h1>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <p className="text-lg text-gray-400 text-center max-w-2xl mb-6">
            My 2026 challenge: Ship one meaningful project every month. Follow along as I build,
            learn, and share my journey.
          </p>
        </BlurFade>
        <BlurFade delay={0.3} inView>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-400">{completedCount}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div>
              <p className="text-3xl font-bold text-yellow-400">{inProgressCount}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div>
              <p className="text-3xl font-bold text-gray-400">12</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </BlurFade>
      </div>

      {/* Challenge Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={challenge.month} challenge={challenge} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
