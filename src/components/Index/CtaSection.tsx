"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Stethoscope, HeartPulse } from "lucide-react";

export const CtaSection = () => {
  return (
    <section className="py-16 bg-linear-to-br from-[#3B82F6] to-[#3B82F6] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute top-10 left-10 w-24 h-24"
          animate={{
            rotate: 360,
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Stethoscope className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32"
          animate={{
            rotate: -360,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <HeartPulse className="w-full h-full" />
        </motion.div>
        <motion.div className="absolute top-1/2 w-full h-20">
          <svg className="w-full h-full" viewBox="0 0 1200 200">
            <motion.path
              d="M0,100 L40,100 L60,20 L80,180 L100,100 L120,100 L140,100 L160,100 L180,100 L200,100 L220,20 L240,180 L260,100 L280,100 L300,100 L320,100 L340,20 L360,180 L380,100 L400,100 L420,100 L440,100 L460,100 L480,100 L500,20 L520,180 L540,100 L560,100 L580,100 L600,100 L620,20 L640,180 L660,100 L680,100 L700,100 L720,100 L740,100 L760,100 L780,20 L800,180 L820,100 L840,100 L860,100 L880,100 L900,20 L920,180 L940,100 L960,100 L980,100 L1000,100 L1020,100 L1040,100 L1060,20 L1080,180 L1100,100 L1120,100 L1140,100 L1160,100 L1180,20 L1200,100"
              fill="transparent"
              strokeWidth="2"
              stroke="white"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Build Your Professional Presence?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of medical professionals already connecting,
            collaborating, and growing their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#3B82F6] hover:bg-gray-100"
              >
                Get Started
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              "#MedicalProfessionals",
              "#HealthcareNetworking",
              "#DoctorsConnect",
              "#MedicalCommunity",
              "#HealthcareInnovation",
            ].map((tag, index) => (
              <motion.span
                key={tag}
                className="px-3 py-1 rounded-full text-xs bg-[#EFF6FF] text-[#1D4ED8] font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 3px 10px rgba(29, 78, 216, 0.15)",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-4 h-4 rounded-full bg-white"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255, 255, 255, 0.7)",
              "0 0 0 20px rgba(255, 255, 255, 0)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeOut",
          }}
        />
      </div>
    </section>
  );
};
