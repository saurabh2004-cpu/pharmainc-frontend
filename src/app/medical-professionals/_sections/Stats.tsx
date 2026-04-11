'use client';

import { motion, Variants, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

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

const statCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

interface StatItem {
    numericValue: number;
    suffix: string;
    description: string;
    decimals?: number;
}

const stats: StatItem[] = [
    {
        numericValue: 6.5,
        suffix: 'M+',
        description: 'Tech professionals\ntrrust on Us',
        decimals: 1,
    },
    {
        numericValue: 150,
        suffix: 'k+',
        description: 'Tech professionals\ntrrust on Us',
    },
    {
        numericValue: 50,
        suffix: 'k+',
        description: 'Tech professionals\ntrrust on Us',
    },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        return latest.toFixed(decimals);
    });

    useEffect(() => {
        if (isInView) {
            animate(count, value, {
                duration: 2,
                ease: "easeOut",
            });
        }
    }, [isInView, value, count]);

    return (
        <span ref={ref}>
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}

export default function Stats() {
    return (
        <section className="w-full bg-white px-4 py-12 md:py-16 lg:py-20">
            <div className="max-w-8xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="bg-[#233F64] p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full h-auto min-h-0 md:min-h-[25.9375rem] rounded-[1.875rem]"
                    style={{ opacity: 1 }}
                >
                    {/* Grid layout for responsive design */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 xl:gap-10 md:gap-0 items-center justify-items-center lg:justify-items-start xl:justify-items-center">
                        {/* Left Card - Agency Info */}
                        <motion.div
                            variants={itemVariants}
                            className="col-span-1 md:col-span-2 p-6 sm:p-8 w-full max-w-[28rem] md:max-w-none xl:w-[23.875rem] h-auto md:h-[19.5rem] rounded-[1.875rem] flex flex-col justify-center mb-6 md:mb-12 xl:mb-0 animate-gradient-flow"
                            style={{
                                background: 'linear-gradient(90deg, #08D5CE 0%, #8DEFA4 50%, #08D5CE 100%)',
                                backgroundSize: '200% auto',
                                opacity: 1
                            }}
                        >
                            <motion.h2
                                variants={itemVariants}
                                className="text-gray-900 mb-2 md:mb-3 text-[1.5rem] md:text-[2.5rem] lg:text-[3.285rem] font-medium leading-[100%] tracking-normal"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                #1
                            </motion.h2>
                            <motion.h3
                                variants={itemVariants}
                                className="text-gray-900 mb-4 md:mb-8 text-[1rem] md:text-[1.5rem] lg:text-[2.344rem] font-semibold leading-[100%] tracking-normal"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                Recruitment Agency
                            </motion.h3>
                            <motion.p
                                variants={itemVariants}
                                className="text-gray-800 text-[0.875rem] md:text-[1rem] lg:text-[1.3rem] font-medium leading-[150%] tracking-normal"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                We are world&apos;s #1 HR & Recruitment platform for any type of job seeker.
                            </motion.p>
                        </motion.div>

                        {/* Right Stats - Grid of 3 */}
                        <motion.div
                            variants={containerVariants}
                            className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={statCardVariants}
                                    className="flex flex-col items-center text-center"
                                >
                                    {/* Stat Value */}
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                        className="text-white mb-2 md:mb-4 text-[2.5rem] md:text-[3.2rem] font-medium leading-[100%] tracking-normal text-center"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                        }}
                                    >
                                        <Counter
                                            value={stat.numericValue}
                                            suffix={stat.suffix}
                                            decimals={stat.decimals}
                                        />
                                    </motion.p>

                                    {/* Stat Description */}
                                    <motion.p
                                        variants={itemVariants}
                                        className="text-white text-[0.875rem] md:text-[1rem] font-medium leading-[140%] tracking-normal text-center px-4 md:px-0"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                        }}
                                    >
                                        {stat.description}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
