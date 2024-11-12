"use client";

import React from "react";

import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFileAlt,
  FaEnvelope,
} from "react-icons/fa";
import ShineBorder from "@/components/ui/shine-border";

function SocialDock() {
  return (
    <ShineBorder
      className="w-full space-x-8 mt-2 bg-cardBackground"
      color={["#FFFFFF00", "#FFFFFF33", "#FFFFFF80", "#FFFFFF"]}
      borderWidth={2}
    >
      <div className="flex items-center justify-evenly w-full space-x-8">
        <a
          className="transition-transform transform hover:scale-125"
          href="https://www.linkedin.com/in/qamil-mirza-bin-abdullah-a50551183/"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          <FaLinkedin size={30} className="text-iconColor hover:text-[#2196F3]" />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://github.com/Qamil-Mirza"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <FaGithub size={30} className="text-iconColor hover:text-primaryText" />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://www.instagram.com/camel_is_real/"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <FaInstagram size={30} className="text-iconColor hover:text-[#FF4081]" />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="https://docs.google.com/document/d/19WATQ6s31JjC-cTm0EEM1rLkfROOngezMz7WTQvRliA/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          title="Resume"
          download={true}
        >
          <FaFileAlt size={30} className="text-iconColor hover:text-primaryText" />
        </a>
        <a
          className="transition-transform transform hover:scale-125"
          href="/contact"
          title="Email"
        >
          <FaEnvelope size={30} className="text-iconColor hover:text-primaryText" />
        </a>
      </div>
    </ShineBorder>
  );
}

export default SocialDock;
