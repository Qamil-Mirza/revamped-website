"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Code, GraduationCap, User } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import { NavBar } from "@/components/ui/nav-bar";
import BioContent from "./panels/BioContent";
import EducationContent from "./panels/EducationContent";
import ExperienceContent from "./panels/ExperienceContent";
import TechContent from "./panels/TechContent";

/**
 * The original tabbed "About" layout, now composed from the shared section
 * components. Used as the accessible fallback (reduced motion / classic view)
 * for the interactive space scene so both stay in sync from one source.
 */
export default function LegacyAbout() {
  return (
    <div className="dark bg-[#121212] min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <AuroraText
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            colors={[
              "#ffffff",
              "#d9ffed",
              "#b3ffdb",
              "#8cffca",
              "#66ffa8",
              "#40ff94",
            ]}
          >
            Qamil Mirza
          </AuroraText>
          <p className="mt-3 text-xl text-primaryText">
            Full Stack Developer & Machine Learning Researcher
          </p>
        </div>

        <Tabs defaultValue="bio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bio">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bio</span>
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="tech">
              <Code className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Tech Stack</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="mt-6">
            <BioContent />
          </TabsContent>
          <TabsContent value="education" className="mt-6">
            <EducationContent />
          </TabsContent>
          <TabsContent value="experience" className="mt-6">
            <ExperienceContent />
          </TabsContent>
          <TabsContent value="tech" className="mt-6">
            <TechContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
