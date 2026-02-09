"use client";

import { motion } from "framer-motion";
import { UserPlus, Building, Users, Handshake, TrendingUp } from "lucide-react";

const timelineItems = [
  {
    icon: UserPlus,
    title: "Join",
    delay: 0,
  },
  {
    icon: Building,
    title: "Build Profile",
    delay: 0.2,
  },
  {
    icon: Users,
    title: "Connect",
    delay: 0.4,
  },
  {
    icon: Handshake,
    title: "Collaborate",
    delay: 0.6,
  },
  {
    icon: TrendingUp,
    title: "Grow",
    delay: 0.8,
  },
];

export const TimelineJourney = () => {
  return (
    <section className="relative py-24 bg-linear-to-br from-[#e0e7ef] via-[#f8fafc] to-[#e0e7ef] overflow-x-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl z-0" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[#38bdf8]/20 rounded-full blur-2xl z-0" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-serif font-extrabold text-[#1e293b] tracking-tight mb-4">
            The Medical Professional Journey
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-light">
            A unique path designed for excellence—grow, connect, and lead in
            your field.
          </p>
        </motion.div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-center min-h-112">
          <svg
            className="absolute left-0 right-0 mx-auto md:top-1/2 md:transform md:-translate-y-1/2 w-full h-64 md:h-40 pointer-events-none z-0"
            viewBox="0 0 1200 160"
            fill="none"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 50 80 Q 200 10 350 80 Q 500 150 650 80 Q 800 10 950 80 Q 1100 150 1150 80"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="12 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>

          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-y-24 md:gap-y-0 md:gap-x-18 relative z-10">
            {timelineItems.map((item, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center"
                style={{
                  marginTop: idx % 2 === 0 ? 0 : "5rem",
                }}
              >
                {/* Icon Bubble */}
                <motion.div
                  className="absolute -top-12 md:top-auto md:-bottom-14 left-1/2 -translate-x-1/2 z-20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: item.delay + 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-[#3B82F6]/30 blur-lg animate-pulse" />
                    <span className="w-8 h-8 rounded-full border-4 border-white bg-[#3B82F6] flex items-center justify-center shadow-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </span>
                  </div>
                </motion.div>

                {/* Wrapper for Step + Box */}
                <div className="relative w-60 md:w-48 mx-auto">
                  {/* Step Label */}
                  <motion.span
                    className="absolute -top-5 left-1/2 -translate-x-1/2 ml-[-20px] px-4 py-1 rounded-full bg-linear-to-r from-[#3B82F6] to-[#38bdf8] text-white text-xs font-bold shadow-lg z-10"
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay + 0.2 }}
                  >
                    Step {idx + 1}
                  </motion.span>

                  {/* Box */}
                  <motion.div
                    className="bg-white/60 backdrop-blur-lg border border-[#3B82F6]/10 rounded-lg shadow-xl px-6 py-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_0_rgba(59,130,246,0.15)]"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: item.delay }}
                  >
                    <h3 className="font-serif text-[1.5rem] md:text-[1.65rem] font-semibold text-[#1e293b] mb-2 text-center leading-tight">
                      {item.title}
                    </h3>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="flex justify-center mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center px-8 py-4 bg-white/80 backdrop-blur-lg rounded-full shadow-lg border border-[#3B82F6]/20">
            <motion.div
              className="w-4 h-4 mr-3 rounded-full bg-linear-to-r from-[#3B82F6] to-[#38bdf8] shadow-lg"
              animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span className="font-semibold text-lg text-[#1D4ED8]">
              Join over{" "}
              <span className="font-extrabold text-[#3B82F6]">500,000</span>{" "}
              medical professionals
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
