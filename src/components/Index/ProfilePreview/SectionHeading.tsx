import { motion } from "framer-motion";

export function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </motion.div>
  );
}