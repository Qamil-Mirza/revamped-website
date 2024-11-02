"use client";

import React from "react";
import { useTheme } from "next-themes";

import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFileAlt,
  FaEnvelope,
} from "react-icons/fa";
import ShineBorder from "@/components/ui/shine-border";

function SocialDock() {
  const theme = useTheme();
  return (
    <ShineBorder
      className="w-full space-x-8 mt-2"
      color={theme.theme === "dark" ? "white" : "black"}
    >
      <div className="flex items-center justify-evenly w-full space-x-8">
        <a
          className="transition-transform transform hover:scale-125"
          href="https://www.linkedin.com/in/qamil-mirza-bin-abdullah-a50551183/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          <FaLinkedin size={30} />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://github.com/Qamil-Mirza"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <FaGithub size={30} />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://www.instagram.com/camel_is_real/"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <FaInstagram size={30} />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://github.com/Qamil-Mirza/revamped-website/blob/main/docs/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Resume"
          download={true}
        >
          <FaFileAlt size={30} />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="mailto:qamilmirza@berkeley.edu"
          title="Email"
        >
          <FaEnvelope size={30} />
        </a>
      </div>
    </ShineBorder>
  );
}

export default SocialDock;
