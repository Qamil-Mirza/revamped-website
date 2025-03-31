"use client";

import React from "react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Map from "@/components/ui/Map";
import Image from "next/image";
import { NavBar } from "@/components/ui/nav-bar";

import team from "@/public/team.jpeg";
import solo from "@/public/solobadds.jpeg";
import temp from "@/public/temp.png";

function Page() {
  return (
    <div className="bg-backgroundColor min-h-screen">
      <NavBar />

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
          Life's Too Short For Just One Adventure
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
          On January 27, 2025, my friend Aadil invited me to join him in
          competing at the Bay Area Decision Science Summit, an industrial
          engineering case competition. Although I wasn't fully aware of what
          this entailed, I accepted, trusting that sometimes embracing
          uncertainty leads to rewarding experiences.
        </p>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          The challenge we received was to develop and implement an options
          trading strategy aimed at minimizing premium costs while maintaining a
          daily exposure of at least $10 million. Going into this, I had minimal
          knowledge of options trading or related optimization techniques, and
          only two weeks to formulate a competitive strategy.
        </p>

        <p className="text-lg text-primaryText leading-relaxed mb-6">
          To bridge my knowledge gap, I began reading "Option Volatility and
          Pricing" by McGraw Hill, quickly acquainting myself with essential
          trading terminology. Further exploration led me to Mixed Integer
          Linear Programming approaches, prompting me to study convex
          optimization methods in greater depth to establish effective
          formulations. Ultimately, we crafted a robust trading strategy that
          consistently met the exposure requirement and minimized premium costs,
          securing second place in the competition.
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
        <p className="text-center text-lg text-primaryText mb-6">
          Adventures And Discoveries Across Different Cultures and Landscapes
        </p>
        <Map />
      </section>
    </div>
  );
}

export default Page;
