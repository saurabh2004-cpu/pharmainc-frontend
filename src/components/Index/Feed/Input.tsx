import { motion } from "framer-motion";
import { MessageSquare, Image, FileText } from "lucide-react";

export function Input() {
  return (
    <motion.div
      className="bg-gray-50 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className="flex gap-3">
        <motion.div
          className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[#3B82F6] font-bold text-sm">Me</span>
        </motion.div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Share your medical insights, research, or case studies..."
            className="w-full py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 transition-colors">
              <Image className="w-4 h-4 text-[#3B82F6]" />
              <span>Image</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 transition-colors">
              <FileText className="w-4 h-4 text-[#3B82F6]" />
              <span>Document</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 transition-colors">
              <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
              <span>Poll</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
