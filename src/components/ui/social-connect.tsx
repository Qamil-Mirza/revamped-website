"use client"
import { motion } from "framer-motion"
import { FaLinkedin, FaGithub, FaFileAlt, FaEnvelope } from "react-icons/fa"
import ShineBorder from "@/components/ui/shine-border"

const socialLinks = [
  {
    icon: <FaLinkedin size={28} />,
    href: "https://www.linkedin.com/in/qamil-mirza-bin-abdullah-a50551183/",
    label: "LinkedIn",
    hoverColor: "hover:text-[#2196F3]",
    bgColor: "bg-[#2196F3]/10",
  },
  {
    icon: <FaGithub size={28} />,
    href: "https://github.com/Qamil-Mirza",
    label: "GitHub",
    hoverColor: "hover:text-primaryText",
    bgColor: "bg-white/10",
  },
  {
    icon: <FaFileAlt size={28} />,
    href: "/documents/Qamil_Mirza_s_Resume_September_2025.pdf",
    label: "Resume",
    hoverColor: "hover:text-primaryText",
    bgColor: "bg-green-500/10",
    download: true,
  },
  {
    icon: <FaEnvelope size={28} />,
    href: "/contact",
    label: "Email",
    hoverColor: "hover:text-primaryText",
    bgColor: "bg-red-500/10",
  },
]

function SocialConnect({ onResumeClick }: { onResumeClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <ShineBorder
      className="w-fit bg-transparent backdrop-blur-sm py-4 px-6 rounded-xl"
      color={["#FFFFFF00", "#FFFFFF33", "#FFFFFF80", "#FFFFFF"]}
      borderWidth={2}
    >
      <div className="flex items-center justify-center w-full= gap-10 md:gap-16">
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 * index,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 -m-3 rounded-full ${link.bgColor} blur-md`}
            />

            <a
              className="relative flex items-center justify-center transition-all duration-300 hover:scale-125"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              title={link.label}
              download={link.label === "Resume" ? undefined : link.download}
              onClick={link.label === "Resume" ? onResumeClick : undefined}
            >
              <motion.div className={`text-iconColor ${link.hoverColor}`}>{link.icon}</motion.div>
            </a>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-xs font-medium text-white/90 whitespace-nowrap px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">
                {link.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </ShineBorder>
  )
}

export default SocialConnect

