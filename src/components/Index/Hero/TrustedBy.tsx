"use client";
import { motion } from "framer-motion";

export const TrustedBy = () => (
  <motion.div
    className="container mx-auto px-4 mt-16 relative z-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center text-gray-400 text-sm">
      <span>Trusted by medical professionals from:</span>
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        {[
          "AIIMS Delhi",
          "Apollo Hospitals",
          "Fortis Healthcare",
          "Christian Medical College (CMC)",
          "PGIMER",
        ].map((name) => (
          <div key={name} className="font-medium text-gray-600">
            {name}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);
