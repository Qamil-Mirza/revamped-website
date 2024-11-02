import React from "react";

import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import IconCloud from "@/components/ui/icon-cloud";
import WordPullUp from "@/components/ui/word-pull-up";
import Ripple from "@/components/ui/ripple";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

// Features to moddify Bento Grid
const features = [
    {
        Icon: FileTextIcon,
        name: "Save your files",
        description: "We automatically save your files as you type.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
    {
        Icon: BellIcon,
        name: "Notifications",
        description: "Get notified when something happens.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
    {
        Icon: Share2Icon,
        name: "Integrations",
        description: "Supports 100+ integrations and counting.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
    {
        Icon: CalendarIcon,
        name: "Calendar",
        description: "Use the calendar to filter your files by date.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
    {
        Icon: CalendarIcon,
        name: "User Management",
        description: "Manage user access and permissions easily.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
    {
        Icon: CalendarIcon,
        name: "Settings",
        description: "Customize your experience with advanced settings.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
    },
];

// Adjust IconCloud Content here
const slugs = [
  "typescript",
  "javascript",
  "java",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "amazonaws",
  "postgresql",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "figma",
  "ruby",
  "vuedotjs",
  "go",
  "python",
  "flask",
  "tailwindcss",
  "mui",
  "shadcnui",
  "kubernetes",
  "postman",
  "numpy",
  "streamlit",
  "scikitlearn",
  "pytorch",
  "tensorflow",
  "react",
  "plotly",
  "keras",
  "pandas",
  "opencv",
  "ubuntu",
  "amazonec2",
];

function page() {
  return (
    <main>
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black">
          Projects
        </p>
        <Ripple />
      </div>
      <div className="p-3">
        <p className="flex justify-center text-3xl font-bold">Explore My Creative Journey</p>
      </div>
      <section className="p-6">
      <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
      </section>
      <section>
        <div className="flex justify-center p-3">
          <WordPullUp
            className="font-bold text-3xl mt-6"
            words="Technologies I've worked with"
          />
        </div>
        <div className="flex w-full h-[78%] items-center justify-center">
          <IconCloud iconSlugs={slugs} />
        </div>
      </section>
      <footer className="m-12"></footer>
    </main>
  );
}

export default page;
