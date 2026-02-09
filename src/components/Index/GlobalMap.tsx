"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

const medicalHubs = [
  { x: "25%", y: "30%", label: "North America", size: 3 },
  { x: "30%", y: "45%", label: "Mexico City", size: 2 },
  { x: "45%", y: "30%", label: "Europe", size: 4 },
  { x: "52%", y: "35%", label: "Germany", size: 3 },
  { x: "60%", y: "28%", label: "Eastern Europe", size: 2 },
  { x: "70%", y: "30%", label: "Asia", size: 4 },
  { x: "80%", y: "25%", label: "China", size: 3 },
  { x: "85%", y: "35%", label: "Japan", size: 3 },
  { x: "40%", y: "65%", label: "South America", size: 3 },
  { x: "55%", y: "70%", label: "Africa", size: 3 },
  { x: "90%", y: "75%", label: "Australia", size: 3 },
];

export const GlobalMap = () => (
  <section id="global-map" className="py-16 bg-white overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          A Global Network of Medical Professionals
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join doctors from over 150 countries collaborating across borders and
          specialties
        </p>
        <motion.div
          className="flex justify-center gap-2 mt-4 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {["#GlobalHealth", "#MedicalNetwork", "#HealthcareCollaboration"].map(
            (tag, index) => (
              <motion.span
                key={tag}
                className="px-3 py-1 rounded-full text-xs bg-[#EFF6FF] text-[#1D4ED8] font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-4">
          <div className="relative w-full aspect-2/1 bg-gray-50 rounded-lg overflow-hidden">
            <svg
              viewBox="0 0 2000 1001"
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none z-0"
              aria-hidden="true"
            >
              <g>
                <path
                  d="M1900,300 L1800,200 L1700,250 L1600,200 L1500,300 L1400,250 L1300,350 L1200,300 L1100,400 L1000,350 L900,450 L800,400 L700,500 L600,450 L500,550 L400,500 L300,600 L200,550 L100,650"
                  stroke="#3B82F6"
                  strokeWidth="20"
                  fill="none"
                  opacity="0.2"
                />
              </g>
            </svg>
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {medicalHubs.map((hub, index) => {
                const connections: typeof medicalHubs = [];
                if (index < medicalHubs.length - 1) {
                  connections.push(medicalHubs[index + 1]);
                }
                if (index % 3 === 0 && index + 3 < medicalHubs.length) {
                  connections.push(medicalHubs[index + 3]);
                }
                return connections.map((target, i) => {
                  const x1 = (parseFloat(hub.x) / 100) * 2000;
                  const y1 = (parseFloat(hub.y) / 100) * 1001;
                  const x2 = (parseFloat(target.x) / 100) * 2000;
                  const y2 = (parseFloat(target.y) / 100) * 1001;
                  return (
                    <motion.path
                      key={`${index}-${i}`}
                      d={`M${x1},${y1} Q${(x1 + x2) / 2},${
                        Math.min(y1, y2) - 120
                      } ${x2},${y2}`}
                      stroke="#3B82F6"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="12,12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 2, delay: index * 0.2 + 0.5 }}
                    />
                  );
                });
              })}
            </svg>
            {medicalHubs.map((hub, index) => (
              <motion.div
                key={index}
                className={`absolute z-20 ${
                  hub.size === 4
                    ? "w-7 h-7"
                    : hub.size === 3
                    ? "w-5 h-5"
                    : "w-4 h-4"
                } rounded-full bg-[#3B82F6] flex items-center justify-center shadow-lg`}
                style={{
                  top: hub.y,
                  left: hub.x,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + index * 0.2,
                  delay: index * 0.3,
                }}
                title={hub.label}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#3B82F6]"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 16px rgba(59, 130, 246, 0)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeOut",
                    delay: index * 0.2,
                  }}
                />
                {hub.size >= 3 && <HeartPulse className="w-3 h-3 text-white" />}
              </motion.div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <motion.div
                className="bg-white/80 rounded-lg p-6 backdrop-blur-xs shadow-md max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.15)",
                }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <motion.p
                      className="text-[#3B82F6] text-2xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      150+
                    </motion.p>
                    <p className="text-sm text-gray-600">Countries</p>
                  </div>
                  <div>
                    <motion.p
                      className="text-[#3B82F6] text-2xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      500K+
                    </motion.p>
                    <p className="text-sm text-gray-600">
                      Medical Professionals
                    </p>
                  </div>
                  <div>
                    <motion.p
                      className="text-[#3B82F6] text-2xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                    >
                      10K+
                    </motion.p>
                    <p className="text-sm text-gray-600">Institutions</p>
                  </div>
                </div>
                <motion.div className="mt-4 w-full overflow-hidden">
                  <svg viewBox="0 0 100 10" className="w-full">
                    <motion.path
                      d="M0,5 L5,5 L7,1 L10,9 L12,5 L15,5 L20,5 L25,5 L30,1 L35,9 L38,5 L40,5 L45,5 L50,5 L55,1 L60,9 L65,5 L70,5 L75,1 L80,9 L85,5 L90,5 L95,5 L100,5"
                      stroke="#3B82F6"
                      strokeWidth="0.8"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <motion.p
              className="text-gray-500 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.span
                className="inline-block mr-2 text-[#3B82F6]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HeartPulse className="w-4 h-4" />
              </motion.span>
              Growing worldwide — because good healthcare has no borders.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
