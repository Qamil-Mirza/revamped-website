"use client";

import React from "react";
import { AuroraText } from "@/components/ui/aurora-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Image from "next/image";

import team from "@/public/team.jpeg";
import solo from "@/public/solobadds.jpeg";
import temp from "@/public/temp.png";

function Page() {
  return (
    <div className="bg-backgroundColor min-h-screen">
      {/* Hero Section */}
      <section className="p-3 relative bg-cover bg-center bg-no-repeat flex items-center justify-center h-screen">
        <Image
          src={temp.src}
          alt="Serene Trees and Mist"
          fill
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <h1 className="relative z-20 text-center text-4xl font-bold tracking-tighter text-primaryText md:text-5xl lg:text-7xl">
          <AuroraText>Sidequests</AuroraText>
        </h1>
      </section>

      {/* Academic Sidequests Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-5xl md:text-7xl text-primaryText font-bold text-center mb-8">
          Academic Sidequests
        </h2>

        <div className="mb-10">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image
              src={team.src}
              alt="Academic Sidequests Team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          On the 27th of January 2025, my friend Aadil asked me to compete with
          him in the Bay Area Decision Science Summit to work on an industrial
          engineering case competition. I said yes without fully knowing what
          that entails but I believe sometimes you have to take a leap of faith.
        </p>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          We were given the problem of developing and implementing an options
          trading strategy that minimizes premium cost subject to maintaining a
          daily exposure of above $10M. I did not know much about options
          trading or optimization strategies for such a use case going in, and
          now I had 2 weeks to figure out a competitive strategy.
        </p>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          As a result, I picked up a book by McGraw Hill called "Option
          Volatility and Pricing" and read the first few pages to get the gist
          of the lingo. My research landed me in the realm of Mixed Integer
          Linear programming approaches and picked up a book on convex
          optimization to figure out how to set up the formulations. We ended up
          developing a strategy that was able to maintain the daily exposure
          above $10M and minimize the premium cost, ultimately winning us second
          place in the competition.
        </p>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
          <Image
            src={solo.src}
            alt="Solo participant from Academic Sidequests"
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          Super grateful for the opportunity and this very practical
          introduction to linear programming. Thank you to professor Kerger and
          my team for the support. If you're interested in checking out our
          work, just click the button below!
        </p>

        <a
          className="flex justify-center"
          href="https://github.com/Qamil-Mirza/badss-2025-options-alpha-strategy"
        >
          <InteractiveHoverButton>Check Out Our Github!</InteractiveHoverButton>
        </a>
      </section>

      {/* Exploring The World Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-5xl md:text-7xl text-primaryText font-bold text-center mb-8">
          Exploring The World
        </h2>
        <p className="flex justify-center text-lg text-primaryText leading-relaxed mb-6">
          Coming soon
        </p>
      </section>
    </div>
  );
}

export default Page;
