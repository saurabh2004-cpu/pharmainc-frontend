'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 1,
        title: 'Doctors',
        description: 'Access verified doctors across multiple specialties for full-time, visiting, and emergency staffing requirements.',
    },
    {
        id: 2,
        title: 'Nurses',
        description: 'Connect with qualified nursing professionals for ICU, ward, rotational, and long-term staffing support.',
    },
    {
        id: 3,
        title: 'Specialists',
        description: 'Source specialized healthcare professionals across critical care, diagnostics, surgery, and advanced treatment areas.',
    },
    {
        id: 4,
        title: 'Therapists',
        description: 'Access licensed therapy professionals for rehabilitation, recovery, and patient support services.',
    },
    {
        id: 5,
        title: 'Pharmacists',
        description: 'Hire licensed pharmacists for clinical, hospital, and retail healthcare operations.',
    },
    {
        id: 6,
        title: 'Lab Technicians',
        description: 'Connect with trained diagnostic and laboratory professionals for testing and pathology support.',
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export default function Categories() {
    return (
        <section className="w-full bg-white px-4 py-2 md:px-8 md:py-0 lg:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 md:mb-12 lg:mb-16"
                >
                    <h2 className="font-poppins font-semibold text-[35px] leading-none text-center text-gray-900">
                        Our Categories
                    </h2>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            variants={cardVariants}
                            whileHover={{ 
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            {/* Card Container */}
                            <div className="relative bg-white rounded-[20px] p-8 w-full max-w-[22.4828rem] h-[20.2492rem] mx-auto flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(8,213,206,0.15)] group-hover:ring-1 group-hover:ring-[#08D5CE]/20">
                                {/* Decorative Blob */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + category.id * 0.05, duration: 0.6 }}
                                    className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#08D5CE] to-[#8DEFA4] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                                />

                                {/* Category Number */}
                                <div className="relative mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + category.id * 0.05, duration: 0.6 }}
                                        className="font-poppins font-medium text-[72px] leading-none bg-gradient-to-b from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
                                    >
                                        {String(category.id).padStart(2, '0')}
                                    </motion.div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col relative z-10 h-full">
                                    {/* Title */}
                                    <h3 className="font-poppins font-medium text-[24px] leading-[32px] tracking-[-0.6px] text-gray-900 mb-4 group-hover:text-[#08D5CE] transition-colors duration-300">
                                        {category.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-poppins font-medium text-[16px] leading-[26px] text-[#45556C] max-w-[18.4828rem] mb-6">
                                        {category.description}
                                    </p>

                                    {/* Explore Link */}
                                    <div className="mt-auto">
                                        <motion.a
                                            href="#"
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 text-[#08D5CE] font-poppins font-normal text-[14px] leading-[20px] tracking-[0.7px] uppercase hover:opacity-80 transition-opacity"
                                        >
                                            View Professionals
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </motion.a>
                                    </div>
                                </div>

                                {/* Bottom Separator Line */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + category.id * 0.05, duration: 0.6 }}
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#08D5CE] via-[#8DEFA4] to-[#8DEFA4] origin-left"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}