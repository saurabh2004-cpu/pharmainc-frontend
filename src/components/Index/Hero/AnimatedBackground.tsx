"use client";
import { motion } from "framer-motion";

export const AnimatedBackground = () => (
  <motion.div
    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <motion.div
      className="absolute w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl"
      style={{ top: "-6rem", left: "-8rem" }}
      animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
      transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-72 h-72 bg-[#2563EB]/20 rounded-full blur-2xl"
      style={{ bottom: "-4rem", right: "-6rem" }}
      animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
    />
  </motion.div>
);
