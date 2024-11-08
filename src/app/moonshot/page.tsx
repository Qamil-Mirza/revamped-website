"use client";

import React from "react";
import SparklesText from "@/components/ui/sparkles-text";
import Meteors from "@/components/ui/meteors";
import Particles from "@/components/ui/particles";

function Page() {
  return (
    <div className="bg-backgroundColor min-h-screen">
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        {/* Meteor Animation */}
        <div className="absolute inset-0">
          <Meteors number={30} />
        </div>

        {/* Particle Animation */}
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={"#ffffff"}
          refresh
        />

        {/* Overlay Text */}
        <div className="p-3 ">
          <SparklesText
            text="TOX.AI"
            className="text-green-400"
            colors={{ first: "#fef9c3", second: "#cce7ff" }}
            sparklesCount={5}
          />
        </div>
      </div>
      <div className="flex justify-center items-center p-3">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-primaryText text-3xl font-bold mb-2">
            Building Towards a Future of Ethical Innovation in Medicine
          </h1>
          <span className="text-primaryText">More details soon...</span>
        </div>
      </div>
    </div>
  );
}

export default Page;
