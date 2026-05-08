'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function Hero() {
    return (
        <div className="w-full bg-[#c6f7dd]">
            {/* Responsive SVG Clip Path Definitions */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    {/* Deep Curve for Desktop */}
                    <clipPath id="hero-belly-curve-desktop" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0 L 1,0 L 1,0.55 Q 0.5,1.25 0,0.55 Z" />
                    </clipPath>
                    {/* Shallower Curve for Mobile/Tablet */}
                    <clipPath id="hero-belly-curve-mobile" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0 L 1,0 L 1,0.85 Q 0.5,1.05 0,0.85 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Hero Section Container with Responsive Clip Path */}
            <div
                className="w-full bg-[#097083] [clip-path:url(#hero-belly-curve-mobile)] md:[clip-path:url(#hero-belly-curve-desktop)] isolation-auto"
                style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    perspective: '1000px'
                }}
            >
                <section className="relative w-full px-4 sm:px-8 pt-8 lg:pt-10 sm:pt-24 pb-32 sm:pb-48 md:pb-60 lg:pb-80">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="flex flex-col items-center"
                        >
                            {/* Tagline */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-2 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-8 sm:mb-10 shadow-sm"
                            >
                                <span className="text-black font-poppins font-[400] text-[14px] sm:text-[16px] leading-[1] tracking-normal">
                                    No agencies. No commissions. Justopportunities.
                                </span>
                                <ArrowUpRight size={16} className="text-black sm:w-[18px] sm:h-[18px]" />
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-[40px] sm:text-[56px] md:text-[64px] lg:text-[73.22px] text-white text-center tracking-tight mb-6 sm:mb-8"
                                style={{
                                    fontFamily: "'Figtree', sans-serif",
                                    fontWeight: 800,
                                    lineHeight: '100%',
                                }}
                            >
                                Your Career,
                                <br />
                                Your Rules
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p
                                variants={itemVariants}
                                className="text-[17px] sm:text-[20px] lg:text-[22.24px] w-full font-poppins font-normal text-white/90 text-center leading-[1.3] sm:leading-[1.4] tracking-normal mb-10 sm:mb-14 max-w-[90%] md:max-w-4xl"
                            >
                                Discover verified healthcare
                                opportunities directly from hospitals and institutions across India.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto items-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full sm:w-auto px-8 sm:px-14 h-[47px] bg-[linear-gradient(93.47deg,_#08D5CE_0%,_#8DEFA4_50%,_#08D5CE_100%)] bg-[length:200%_auto] animate-gradient-flow text-black rounded-full font-poppins font-normal text-[16px] sm:text-[18.2px] leading-none tracking-normal flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                                    style={{
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)'
                                    }}
                                >
                                    Get Started
                                    <ArrowUpRight size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full sm:w-auto px-8 sm:px-14 h-[47px] border-[1.5px] border-white text-white rounded-full font-poppins font-normal text-[16px] sm:text-[18.2px] leading-none tracking-normal hover:bg-white/5 transition-all flex items-center justify-center"
                                    style={{
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)'
                                    }}
                                >
                                    Browse Jobs
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}
