"use client";

import React from "react";
import SparklesText from "@/components/ui/sparkles-text";
import Meteors from "@/components/ui/meteors";
import Particles from "@/components/ui/particles";
import { BlurFade } from "@/components/ui/blur-fade";
import { BoxReveal } from "@/components/ui/box-reveal";

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
        <div className="flex flex-col justify-center items-center max-w-3xl">
          <BlurFade delay={0.25} inView>
            <h1 className="text-green-400 text-3xl font-bold mb-6 text-left">
              My Journey Towards Tackling Toxicity Prediction
            </h1>
            <p className="text-primaryText text-lg mb-4 text-left">
              Growing up, I always had a deep love and respect for animals. They
              brought joy into my life and taught me so much about empathy and
              connection. However, seeing animals suffer, especially when it’s
              something preventable, always broke my heart. The pain felt even
              sharper knowing I wasn’t doing anything to help. Although I was
              just a kid, I believed that every small effort could make a
              difference, and this belief stayed with me as I got older.
            </p>
            <p className="text-primaryText text-lg mb-4 text-left">
              By the time I turned 16, I started dreaming bigger. This is when I
              came up with the idea for Tox.AI.{" "}
              <strong className="text-green-400">
                The mission was ambitious but clear: disrupt the drug
                development pipeline through computational methods to predict
                drug toxicity.
              </strong>{" "}
              I envisioned creating a system that could shorten the time and
              reduce the cost of drug discovery while making animal testing
              redundant. The ultimate goal? To render animal testing obsolete
              and significantly devalue its role in preclinical trials.
            </p>
          </BlurFade>

          <BlurFade delay={0.25} inView>
            <hr className="border-t-2 border-white w-full my-6" />
            <h1 className="text-green-400 text-3xl font-bold mb-6 text-left">
              Technicalities Of A Naive Idea
            </h1>

            <p className="text-primaryText text-lg mb-4 text-left">
              At the core of this vision was the belief that machine learning
              could do what animal models currently do—only faster, cheaper, and
              more ethically.{" "}
              <strong className="text-green-400">
                At the time, I proposed developing a system to predict toxic
                properties of chemical substances based on their molecular
                characteristics.
              </strong>{" "}
              Using resources like PubChem, my plan was to gather data on
              molecular structures, store it in a vectorized database, and use
              clustering techniques like Tanimoto’s Coefficient to group
              chemicals by similarity. This would feed into a binary
              classification model, allowing us to predict whether a substance
              would be hazardous at specific doses.
            </p>
            <ol className="text-primaryText text-lg mb-4 list-decimal list-inside text-left">
              <li>
                <strong>Data Collection:</strong> Scrape the web for chemical
                property data and create an expanding database.
              </li>
              <li>
                <strong>Clustering:</strong> Group similar chemicals using
                k-nearest neighbors and Tanimoto’s Coefficient.
              </li>
              <li>
                <strong>Prediction Model:</strong> Train a model to classify
                chemicals as hazardous or non-hazardous based on their feature
                vectors.
              </li>
            </ol>
            <p className="text-primaryText text-lg mb-4 text-left">
              I was a bold, stubborn teenager, filled with enthusiasm and belief
              in the power of technology. But looking back, I see how naïve I
              was. I failed to consider critical factors:
            </p>
            <ol className="text-primaryText text-lg mb-4 list-decimal list-inside text-left">
              <li>
                <strong>Data Complexity:</strong> I underestimated how
                challenging it would be to gather and standardize high-quality
                toxicity data.
              </li>
              <li>
                <strong>Regulatory Hurdles:</strong> I didn’t fully grasp the
                stringent requirements of regulatory bodies like the FDA.
              </li>
              <li>
                <strong>Model Limitations:</strong> I overlooked the complexity
                of biological systems and how even advanced computational models
                might struggle to replicate certain human responses.
              </li>
              <li>
                <strong>Ethical Nuance:</strong> While reducing animal testing
                is a noble goal, ensuring the safety of patients in clinical
                trials is a moral imperative.
              </li>
            </ol>
            <p className="text-primaryText text-lg mb-12 text-left">
              Despite these oversights, the experience was invaluable. It
              planted the seed for my passion and shaped the direction of my
              career. Tox.AI wasn’t just a youthful project—it was a mission,
              one that I’m still committed to pursuing through science and
              innovation as a data science and applied math student at Berkeley.
              While the path forward may be complex, my goal remains clear:
            </p>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <BoxReveal boxColor={"#4ade80"} duration={1}>
              <h1 className="text-green-400 tracking-tighter text-3xl font-bold mb-6 text-center">
                "I want to build a future where animals are no longer the cost
                of medical progress."
              </h1>
            </BoxReveal>
            <hr className="border-t-2 border-white w-full my-6" />
            <h1 className="text-green-400 text-3xl font-bold mb-6 text-center">
            More info on what I'm currently doing soon!
            </h1>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default Page;
