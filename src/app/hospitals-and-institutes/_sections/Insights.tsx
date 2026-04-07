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
        'Hire within 24 hours',
        'Reduce hiring costs by up to 50%',
        'Access 10,000+ verified professionals',
        'Scale workforce instantly based on demand',
    ];

    return (
        <section className="w-full bg-white px-4 sm:px-6 pt-12 sm:pt-16 md:pt-0">
            <div className="max-w-6xl mx-auto">
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

                    {/* ── Desktop (lg+): original absolute zig-zag layout — UNCHANGED ── */}
                    <motion.div
                        className="relative h-[650px] w-full hidden lg:block over"
                        variants={itemVariants}
                    >
                        <motion.div
                            custom={0}
                            variants={cardVariants}
                            className="absolute top-[16rem] -left-20 w-[13rem] h-[20rem]"
                        >
                            <Image
                                src="/hospitals-and-institutes/insights-card-1.png"
                                alt="Insights Card 1"
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        <motion.div
                            custom={1}
                            variants={cardVariants}
                            className="absolute top-20 left-[9rem] w-[14rem] h-[22rem]"
                        >
                            <Image
                                src="/hospitals-and-institutes/insights-card-2.png"
                                alt="Insights Card 2"
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        <motion.div
                            custom={2}
                            variants={cardVariants}
                            className="absolute top-[18rem] left-[24rem] w-[12rem] h-[18rem]"
                        >
                            <Image
                                src="/hospitals-and-institutes/insights-card-3.png"
                                alt="Insights Card 3"
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        <motion.div
                            custom={3}
                            variants={cardVariants}
                            className="absolute top-[8rem] left-[38.7rem] w-[6.4rem] h-[15rem]"
                        >
                            <Image
                                src="/hospitals-and-institutes/insights-card-4.png"
                                alt="Insights Card 4"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>

                    {/* ── Mobile & Tablet (below lg): zig-zag row with snap scroll ── */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:hidden w-full mx-auto overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {/* Inner row with staggered vertical offsets to echo the zig-zag */}
                        <div className="flex gap-3 sm:gap-4 items-end w-max">

                            {/* Card 1 — profile, bottom-aligned (lowest) */}
                            <motion.div
                                custom={0}
                                variants={cardVariants}
                                className="relative flex-shrink-0 snap-start"
                                style={{ width: 140, height: 200 }}
                            >
                                <Image
                                    src="/hospitals-and-institutes/insights-card-1.png"
                                    alt="Insights Card 1"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>

                            {/* Card 2 — tallest, raised up via negative margin */}
                            <motion.div
                                custom={1}
                                variants={cardVariants}
                                className="relative flex-shrink-0 snap-start self-start"
                                style={{ width: 155, height: 260 }}
                            >
                                <Image
                                    src="/hospitals-and-institutes/insights-card-2.png"
                                    alt="Insights Card 2"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>

                            {/* Card 3 — medium, bottom-aligned */}
                            {/* <motion.div
                                custom={2}
                                variants={cardVariants}
                                className="relative flex-shrink-0 snap-start"
                                style={{ width: 140, height: 220 }}
                            >
                                <Image
                                    src="/hospitals-and-institutes/insights-card-3.png"
                                    alt="Insights Card 3"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div> */}
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}