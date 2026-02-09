"use client";
import { motion } from "framer-motion";

const cardVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
};

export const DoctorProfile = () => (
  <motion.div
    className="lg:w-1/2 flex justify-center items-center"
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-0"
      animate={{ y: [0, -10, 0] }}
      transition={{
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut",
      }}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-6 py-3 text-white flex items-center rounded-t-2xl shadow-lg border-b border-blue-100">
        <div className="w-3 h-3 rounded-full bg-red-400 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-400 mr-auto" />
        <span className="text-sm font-medium">
          Dr. Priya Sharma - Oncology Profile
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Header Info */}
        <div className="flex items-start gap-4">
          <motion.div
            className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 border-4 border-[#3B82F6]/20 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 6 }}
          >
            <span className="text-[#3B82F6] font-bold text-xl">SC</span>
          </motion.div>
          <div>
            <h3 className="font-bold text-xl">Dr. Priya Sharma</h3>
            <p className="text-gray-600">Oncologist</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 text-xs bg-[#EFF6FF] text-[#1D4ED8] rounded-full">
                AIIMS Delhi
              </div>
              <div className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                412 connections
              </div>
            </div>
          </div>
        </div>

        {/* Activity Info */}
        <div className="mt-6 space-y-3">
          <motion.div
            className="p-3 rounded-lg bg-gray-50 border border-gray-100 shadow"
            whileHover={{ scale: 1.02, backgroundColor: "#EFF6FF" }}
          >
            <h4 className="font-medium text-sm text-gray-600">
              Recent Activity
            </h4>
            <p className="text-gray-800 mt-1">
              Co-led cancer awareness drive in Lucknow&apos;s govt hospital
            </p>
          </motion.div>
          <motion.div
            className="p-3 rounded-lg bg-[#EFF6FF] border border-[#3B82F6]/20 shadow"
            whileHover={{ scale: 1.02, backgroundColor: "#DBEAFE" }}
          >
            <h4 className="font-medium text-sm text-[#1D4ED8]">
              Upcoming Conference
            </h4>
            <p className="text-gray-800 mt-1">
              Panel speaker at Indian Public Health Conference 2025
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
