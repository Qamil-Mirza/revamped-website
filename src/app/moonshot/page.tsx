"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import SparklesText from "@/components/ui/sparkles-text";
import Meteors from "@/components/ui/meteors";
import Particles from "@/components/ui/particles";
import { BlurFade } from "@/components/ui/blur-fade";
import { BoxReveal } from "@/components/ui/box-reveal";
import { NavBar } from "@/components/ui/nav-bar";

import chemprop from "@/public/chemprop.png";
import ligand from "@/public/1c9.png";

// Add TypeScript declaration for the 3Dmol global
declare global {
  interface Window {
    $3Dmol: any; // Using 'any' for simplicity, but you could define a more specific type
  }
}

function Page() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !viewerRef.current) return;

    try {
      // Now TypeScript knows about window.$3Dmol
      const $3Dmol = window.$3Dmol;

      if (!$3Dmol) {
        console.error("3Dmol.js is not available in the window object");
        return;
      }

      // Configure the viewer
      const element = viewerRef.current;
      const config = { backgroundColor: "#121212" };
      const viewer = $3Dmol.createViewer(element, config);

      // Load the protein structure
      $3Dmol.download("pdb:4I23", viewer, {}, () => {
        // Add cartoon representation with chain coloring
        viewer.setStyle({}, { cartoon: { color: "spectrum" } });
        viewer.render();
        // Enable auto-rotation
        viewer.spin(true);

        viewer.zoomTo();
        viewer.render();
      });

      // Clean up function to stop rotation when component unmounts
      return () => {
        if (viewer) {
          viewer.spin(false);
        }
      };
    } catch (error) {
      console.error("Error initializing 3Dmol viewer:", error);
    }
  }, [scriptLoaded, viewerRef]);

  return (
    <div className="bg-backgroundColor min-h-screen">
      {/* Load 3Dmol.js properly using Next.js Script component */}
      <Script
        src="https://3Dmol.csb.pitt.edu/build/3Dmol-min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <NavBar />
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
        <div className="p-3">
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
              connection. However, seeing animals suffer, especially when it's
              something preventable, always broke my heart. The pain felt even
              sharper knowing I wasn't doing anything to help. Although I was
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
              clustering techniques like Tanimoto's Coefficient to group
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
                k-nearest neighbors and Tanimoto's Coefficient.
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
                <strong>Regulatory Hurdles:</strong> I didn't fully grasp the
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
              career. Tox.AI wasn't just a youthful project—it was a mission,
              one that I'm still committed to pursuing through science and
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
            <div className="max-w-3xl mx-auto p-6 text-primaryText">
              <h1 className="text-green-400 text-3xl font-bold mb-6 text-center">
                Predicting Drug-Target Affinities with AI
              </h1>

              <p className="text-lg leading-relaxed mb-6">
                The future of drug discovery lies in AI-driven precision. My
                research focuses on leveraging{" "}
                <span className="text-green-400">
                  Graph Neural Networks (GNNs)
                </span>{" "}
                and molecular descriptors to predict drug-target affinities, a
                critical step in accelerating early-stage drug development.
              </p>

              <div className="flex justify-center my-4">
                <Image
                  src={chemprop}
                  alt="Chemprop model architecture"
                  className="w-full sm:w-1/2 rounded-lg"
                />
              </div>
              <p className="flex justify-center mb-4">
                Graph Neural Network Architecture (Chemprop)
              </p>

              <p className="text-lg">
                Using <span className="text-green-400">GNNs</span>, I model
                molecules as structured graphs, capturing atomic interactions to
                predict binding strength.
              </p>

              {/* 3D Molecule Viewer Container */}
              <div className="flex justify-center items-center p-6 mb-12">
                <div
                  ref={viewerRef}
                  style={{
                    width: "100%",
                    height: "400px",
                    position: "relative",
                  }}
                  className="rounded-lg"
                >
                  {!scriptLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-green-400">
                      Loading 3D molecule viewer...
                    </div>
                  )}
                </div>
              </div>
              <p className="flex justify-center mb-4">
                Epidermal Growth Factor Receptor (4i23)
              </p>

              <p className="text-lg">
                Molecular descriptors, such as chemical fingerprints and
                electrostatic properties, refine AI models for more precise
                binding predictions.
              </p>

              <div className="flex justify-center my-4">
                <Image
                  src={ligand}
                  alt="1C9 interaction with 4i23"
                  className="w-full sm:w-1/2 rounded-lg"
                />
              </div>
              <p className="flex justify-center">1C9 Interactions With 4i23</p>

              <p className="text-lg mt-4">
                This approach helps prioritize promising drug candidates,
                reducing laboratory screening efforts and shortening the drug
                development timeline.
              </p>

              <p className="text-lg leading-relaxed mt-6">
                By integrating AI into drug discovery pipelines, I aim to make
                development{" "}
                <span className="text-green-400">faster, more efficient,</span>{" "}
                and{" "}
                <span className="text-green-400">
                  less dependent on traditional screening methods.
                </span>
                The work is ongoing, but{" "}
                <a
                  href="https://www.overleaf.com/read/sjdqztgpfych#a32bad"
                  className="text-blue-400 hover:underline"
                >
                  here
                </a>{" "}
                is a research poster we developed summarizing our current
                findings and future directions.
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default Page;
