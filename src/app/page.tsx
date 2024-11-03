import { GearIcon } from "@radix-ui/react-icons";

// my images
import qm from "@/public/qm.jpg";
import graph from "@/public/graph.gif";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import TypingAnimation from "@/components/ui/typing-animation";
import BlurFade from "@/components/ui/blur-fade";
import Meteors from "@/components/ui/meteors";
import { DotPattern } from "@/components/ui/dot-pattern";

import { cn } from "@/lib/utils";
import SocialDock from "@/components/ui/socials-dock";

// Adjust Bento Content here
const features = [
  {
    name: "Data Science Meets Applied Mathematics",
    description: "University of California Berkeley",
    href: `/`,
    cta: "Learn more",
    disable: true,
    primaryTextColor: "text-white",
    secondaryTextColor: "text-white",
    background: (
      <img
        src={qm.src}
        className="absolute inset-0 w-full h-full object-cover object-right-bottom opacity-100 brightness-75 scale-150 -translate-y-1/4"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    name: "Modeling Chemical Reactions with Graph Neural Networks",
    description: "",
    href: "/moonshot",
    cta: "Learn more",
    iconColor: "text-white",
    primaryTextColor: "text-white",
    background: (
      <img
        src={graph.src}
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GearIcon,
    hideIcon: true,
    name: "Passionate Builder and Innovator",
    description: "Checkout Some of The Projects I've Worked On Below",
    href: "/projects",
    cta: "Learn more",
    background: (
      <div className="absolute z-0 flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <Meteors number={30} />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    name: "Sharing Knowledge, Fueling Growth",
    description: "Checkout My Blog On Medium For More!",
    href: "https://medium.com/@qamilmirza",
    cta: "Learn more",
    background: (
      <div className="absolute flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    name: "Runner, Climber, and Music Lover",
    description: "A little bit on what I do outside of work",
    href: "/about",
    cta: "Learn more",
    background: <img className="absolute inset-0 w-full h-full object-cover object-top opacity-60 brightness-50" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    primaryTextColor: "text-white",
    secondaryTextColor: "text-white",
  },
];

export default function Home() {
  return (
    <div className="p-3 bg-backgroundColor min-h-screen">
      <div className="flex justify-center p-3 mb-4">
        <TypingAnimation
          className="text-4xl font-bold text-primaryText dark:text-white"
          text="QAMIL MIRZA"
          duration={100}
        />
      </div>
      <BlurFade delay={0.3} inView>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
      </BlurFade>
      
      {/* Social Dock */}
      <BlurFade delay={0.5} inView>
      <div className="mt-7 flex flex-row justify-center items-center w-full">
        <SocialDock />
      </div>
      </BlurFade>
    </div>
  );
}
