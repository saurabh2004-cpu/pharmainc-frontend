"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const TextContent = () => (
  <motion.div
    className="lg:w-1/2 text-center lg:text-left"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.h1
      className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 drop-shadow-lg"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7 }}
    >
      Where Medical Minds Connect
    </motion.h1>
    <motion.p
      className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
    >
      Join a trusted network of healthcare professionals advancing care through
      collaboration.
    </motion.p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <motion.div
        className="overflow-hidden rounded-lg"
        whileHover={{ scale: 1.05, boxShadow: "0 0 16px #3B82F6" }}
      >
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="border-[#3B82F6] border-2 rounded-lg text-[#3B82F6] hover:bg-[#3B82F6]/5 shadow"
          onClick={() => {
            const el = document.getElementById("global-map");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          See How It Works
        </Button>
      </motion.div>
      <motion.div
        className="overflow-hidden rounded-lg"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px #1D4ED8" }}
      >
        <Button
          size="lg"
          variant="default"
          className="bg-[#1D4ED8] text-white hover:bg-[#2563EB] shadow-lg"
          onClick={() =>
            window.open("https://forms.gle/p2tQuTwxM3HwR8LL6", "_blank")
          }
        >
          Take the Survey
        </Button>
      </motion.div>
    </div>
  </motion.div>
);
