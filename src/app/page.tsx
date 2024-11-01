import {
  LightningBoltIcon,
  Pencil1Icon,
  GlobeIcon,
  RocketIcon,
  Crosshair2Icon,
} from "@radix-ui/react-icons";

// my images
import qm from "@/public/qm.jpg";
import graph from "@/public/graph.gif";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import TypingAnimation from "@/components/ui/typing-animation";
import BlurFade from "@/components/ui/blur-fade";

// URL
const prefixURL = process.env.NEXT_PUBLIC_LOCAL_DEVELOPMENT_URL;

// Adjust Bento Content here
const features = [
  {
    Icon: RocketIcon,
    name: "Data Science Meets Applied Mathematics",
    description: "University of California Berkeley",
    href: `/`,
    cta: "Learn more",
    background: (
      <img
        src={qm.src}
        className="absolute inset-0 w-full h-full object-cover object-right-bottom opacity-60"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Crosshair2Icon,
    name: "Modeling Chemical Reactions with Graph Neural Networks",
    description: "",
    href: "/",
    cta: "Learn more",
    background: (
      <img
        src={graph.src}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Passionate Builder and Innovator",
    description: "Checkout Some of The Projects I've Worked On Below",
    href: `${prefixURL}/projects`,
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Pencil1Icon,
    name: "Sharing Knowledge, Fueling Growth",
    description: "Checkout My Blog On Medium For More!",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: LightningBoltIcon,
    name: "Runner, Climber, and Music Lover",
    description: "A little bit on what I do outside of work",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex justify-center p-6">
        <TypingAnimation
          className="text-4xl font-bold text-black dark:text-white"
          text="Hi, I'm Qamil!"
          duration={100}
        />
      </div>
      <BlurFade delay={0.25} inView>
        <div>
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </BlurFade>
      <div className="p-3 flex justify-center">
        <h1 className="font-bold text-3xl py-3 mt-6">Let's Get Connected!</h1>
      </div>
    </div>
  );
}
