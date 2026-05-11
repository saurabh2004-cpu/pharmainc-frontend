'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

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

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            delay: custom * 0.15,
            ease: 'easeOut',
        },
    }),
};

export default function Insights() {
    const bulletPoints = [
        'Reduce staffing gaps during high-demand periods',
        'Coordinate workforce requirements with greater clarity',
        'Improve response time for urgent staffing needs',
    ];

    const desktopCards = [
        {
            id: 1,
            src: "/hospitals-and-institutes/candidate-pipeline.png",
            width: "13rem",
            height: "20rem",
            marginTop: "16rem",
        },
        {
            id: 2,
            src: "/hospitals-and-institutes/staffing-request-management.png",
            width: "14rem",
            height: "22rem",
            marginTop: "5rem",
        },
        {
            id: 3,
            src: "/hospitals-and-institutes/credential-verification-status.png",
            width: "12rem",
            height: "18rem",
            marginTop: "18rem",
        },
        {
            id: 4,
            src: "/hospitals-and-institutes/availability-dashboard.png",
            width: "12rem",
            height: "18rem",
            marginTop: "8rem",
        },
    ];

    return (
        <section className="w-full bg-white px-4 sm:px-6 pt-12 sm:pt-16 md:pt-0">
            <div className="max-w-7xl mx-auto ">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start"
                >
                    {/* ── Left Content ── */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-5 sm:space-y-6 pt-0 sm:pt-6 lg:pt-24"
                    >
                        <h2 className="font-poppins font-semibold text-[26px] sm:text-[34px] md:text-[42.92px] leading-[120%]">
                            Designed for{' '}
                            <span className="bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent">
                                Speed, Scale, and Efficiency
                            </span>
                        </h2>

                        <ul className="space-y-3">
                            {bulletPoints.map((point, index) => (
                                <motion.li
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-black font-bold text-lg leading-none">•</span>
                                    <span className="font-poppins font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[100%] text-gray-700">
                                        {point}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* ── Desktop (lg+): infinitely scrolling zig-zag layout ── */}
                    <motion.div
                        className="relative h-[650px] w-full hidden lg:block overflow-hidden"
                        variants={itemVariants}
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)'
                        }}
                    >

                        <motion.div
                            className="flex gap-8 w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 30,
                            }}
                        >
                            {[...desktopCards, ...desktopCards].map((card, index) => (
                                <div
                                    key={index}
                                    className="relative flex-shrink-0"
                                    style={{
                                        width: card.width,
                                        height: card.height,
                                        marginTop: card.marginTop,
                                    }}
                                >
                                    <Image
                                        src={card.src}
                                        alt={`Insights Card ${card.id}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── Mobile & Tablet (below lg): infinitely scrolling zig-zag row ── */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:hidden w-full mx-auto overflow-hidden pb-4 mt-8"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)'
                        }}
                    >
                        <motion.div
                            className="flex gap-4 w-max h-[280px]"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 20,
                            }}
                        >
                            {[...desktopCards, ...desktopCards].map((card, index) => {
                                let mWidth = "140px";
                                let mHeight = "200px";
                                let alignment = "self-end";

                                if (card.id === 2) {
                                    mWidth = "155px";
                                    mHeight = "260px";
                                    alignment = "self-start mt-2";
                                } else if (card.id === 3) {
                                    mWidth = "140px";
                                    mHeight = "220px";
                                    alignment = "self-end mb-4";
                                } else if (card.id === 4) {
                                    mWidth = "110px";
                                    mHeight = "190px";
                                    alignment = "self-start mt-6";
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`relative flex-shrink-0 ${alignment}`}
                                        style={{ width: mWidth, height: mHeight }}
                                    >
                                        <Image
                                            src={card.src}
                                            alt={`Insights Card ${card.id}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}