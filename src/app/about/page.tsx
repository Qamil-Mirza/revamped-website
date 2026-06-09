import { Metadata } from "next";
import AboutExperience from "@/components/space/AboutExperience";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://qamil-mirza.com/about",
  },
};

export default function AboutPage() {
  return <AboutExperience />;
}
