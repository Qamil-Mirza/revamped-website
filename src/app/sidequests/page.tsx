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
