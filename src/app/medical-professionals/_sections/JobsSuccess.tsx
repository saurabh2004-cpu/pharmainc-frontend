'use client';

import { motion, Variants } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

export default function JobSuccess() {
    return (
        <section className="w-full bg-[#233F64] py-8 pb-40 md:pb-15 md:py-24 px-4 sm:px-8 md:px-12 lg:px-0 xl:px-8 2xl:px-0">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2  xl:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="flex flex-col justify-center text-center xl:text-left items-center xl:items-start"
                    >
                        {/* Checkmark Icon */}
                        <motion.div
                            variants={itemVariants}
                            className="w-10 h-10 rounded-full bg-[#08D5CE] flex items-center justify-center mb-6"
                        >
                            <Check strokeWidth={4} className="w-5 h-5 text-slate-900 font-bold" />
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            variants={itemVariants}
                            className="font-figtree font-semibold text-[28px] sm:text-[32px] md:text-[40px] lg:text-[42.92px] text-white mb-6 lg:mb-8 leading-[1.3] max-w-[500px]"
                        >
                            Increase your job success rate with Us
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="font-poppins font-normal tracking-[0.02em] text-[15px] sm:text-[16px] md:text-[18px] text-gray-300 mb-8 leading-[1.3] max-w-[520px]"
                        >
                            In this free lesson, you will learn some job success factors and
                            the job success strategies you need to succeed in the
                            marketplace.
                        </motion.p>
                    </motion.div>

                    {/* Right Content - Card with Background Image */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        className="relative w-full max-w-[500px] lg:w-[500px] h-[340px] sm:h-80 md:h-[450px] lg:h-[520px] mx-auto lg:ml-auto mt-10 lg:mt-0"
                    >
                        {/* Image Container with Clipping */}
                        <div className="absolute inset-0 rounded-[30px] overflow-hidden shadow-2xl">
                            {/* Background Image */}
                            <Image
                                src="/medical-professionals/job-success-img-1.png"
                                alt="Professional office environment"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        </div>

                        {/* Card Container - Half-overlapping the left edge */}
                        <div className="absolute top-[100%] md:top-1/2 -translate-y-1/2 left-5  sm:-left-4 md:-left-16 lg:-left-24 xl:-left-24 z-10 w-[90%] xs:w-[18.875rem] md:w-[18.875rem] h-auto min-h-[16rem] md:h-[18rem] bg-white rounded-2xl p-6 shadow-2xl">
                            {/* Card Title */}
                            <h3 className="font-figtree font-semibold text-[1.2rem] md:text-[1.5rem] text-black mb-[1rem] md:mb-[1.5rem] leading-none">
                                Job Success
                            </h3>

                            {/* Job Options */}
                            <div className="space-y-4 md:space-y-5">
                                {/* Remote Hiring */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-figtree font-semibold text-[0.9rem] md:text-[1rem]">
                                            Remote Hiring
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-teal-600 rounded-full"></div>
                                        </div>
                                        <span className="text-[10px] md:text-xs text-gray-600 font-medium whitespace-nowrap">
                                            $600/$500
                                        </span>
                                    </div>
                                    <span className="font-poppins text-[10px] md:text-xs text-gray-500 font-semibold px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                                        On-task
                                    </span>
                                </div>

                                {/* In House Hiring */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-figtree font-semibold text-[0.9rem] md:text-[1rem]">
                                            In House Hiring
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full w-1/2 bg-teal-600 rounded-full"></div>
                                        </div>
                                        <span className="text-[10px] md:text-xs text-gray-600 font-medium whitespace-nowrap">
                                            7 months
                                        </span>
                                    </div>
                                    <span className="font-poppins text-[10px] md:text-xs text-gray-500 font-semibold px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                                        On-task
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}