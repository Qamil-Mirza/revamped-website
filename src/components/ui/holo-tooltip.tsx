"use client";
import { motion } from "framer-motion";

const HoloTooltip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 0.8, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-8 right-8 z-50 pointer-events-none"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl" />

        {/* Main tooltip */}
        <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md border border-blue-400/30 rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <p className="text-white text-sm sm:text-lg font-semibold tracking-wide">
                HYPERSPACE READY
              </p>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </div>
            <p className="text-blue-200/80 text-xs sm:text-sm text-center">
              Hold to charge • Release to jump
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HoloTooltip;
