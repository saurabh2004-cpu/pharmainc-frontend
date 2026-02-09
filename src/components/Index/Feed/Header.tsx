import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
        Your Professional Medical Feed
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Stay updated with the latest research, case studies, and discussions
        from your medical network
      </p>
    </motion.div>
  );
}
