'use client';

import { motion, Variants, easeOut, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

const TrustedBy = () => {
    const stats = [
        {
            number: 200,
            label: 'Healthcare Institutions',
            description: 'Hospitals onboarded',
        },
        {
            number: 10000,
            label: 'Healthcare Professionals',
            description: 'Verified Professionals',
        },
        {
            number: 50000,
            label: 'Placements Made',
            description: 'Successful shifts completed',
        },
    ];

    const institutionsLogos = [
        '/hospitals-and-institutes/brands-img-1.png',
        '/hospitals-and-institutes/brands-img-1.png',
        '/hospitals-and-institutes/brands-img-1.png',
        '/hospitals-and-institutes/brands-img-1.png',
        '/hospitals-and-institutes/brands-img-1.png',
    ];

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
            transition: { duration: 0.6, ease: easeOut },
        },
    };

    function Counter({ value }: { value: number; }) {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });
        const count = useMotionValue(0);
        const rounded = useTransform(count, (latest) => {
            return latest.toFixed(0);
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
            </span>
        );
    }

    return (
        <section className="w-full bg-white px-4 sm:px-6 md:px-8 pb-0 sm:pb-8 xl:pb-0">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="text-center mb-0 sm:mb-12 md:mb-2 lg:mb-16"
                >
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-900 mb-3 sm:mb-4 font-figtree font-semibold
                                   text-[24px] sm:text-[28px] md:text-[35px]
                                   leading-[120%] md:leading-[100%] tracking-normal"
                    >
                        Trusted by Leading Healthcare Institutions
                    </motion.p>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-500 max-w-xs sm:max-w-sm mx-auto font-poppins font-normal
                                   text-[12px] sm:text-[14px] md:text-[16px]
                                   leading-[130%] tracking-normal"
                    >
                        Hospitals and clinics across India rely on our platform for fast, reliable hiring.
                    </motion.p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="grid grid-cols-3 lg:grid-cols-3 gap-0 mb-6w-full bg-white px-0 sm:px-6 md:px-8 pb-0 sm:pb-0 xl:pb-0  lg:mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative text-center px-4 py-4 xl:py-0 lg:py-0"
                        >
                            {/* Horizontal divider on mobile only */}
                            {index < stats.length - 1 && (
                                <div
                                    className="hidden absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-[60px] md:w-[170px]"
                                    style={{
                                        background: 'linear-gradient(90deg, #08D5CE 0%, #8DEFA4 100%)',
                                    }}
                                />
                            )}

                            {/* Vertical divider on tablet and desktop */}
                            {index < stats.length - 1 && (
                                <div
                                    className=" absolute -right-0 top-1/2 -translate-y-1/2 w-[1px] h-[40px] md:h-[60px] xl:h-[111px]"
                                    style={{
                                        background: 'linear-gradient(180deg, #08D5CE 0%, #8DEFA4 100%)',
                                    }}
                                />
                            )}

                            <div className="flex flex-col justify-center items-center">
                                <div className="flex items-center justify-center mb-2">
                                    {/* <p className="text-[#112F52] font-figtree font-bold 
                                                  text-[22px] sm:text-[32px] md:text-[44px] xl:text-[56.31px] 
                                                  leading-none">
                                        {stat.number}
                                    </p> */}

                                    <motion.p
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                        className="text-[#112F52] font-figtree font-bold 
                                                  text-[22px] sm:text-[32px] md:text-[44px] xl:text-[56.31px] 
                                                  leading-none"
                                        style={{
                                            fontFamily: "'Poppins', sans-serif",
                                        }}
                                    >
                                        <Counter
                                            value={stat.number}
                                        />
                                    </motion.p>

                                    <p
                                        className="font-figtree font-bold 
                                                   text-[22px] sm:text-[32px] md:text-[44px] xl:text-[56.31px] 
                                                   leading-none text-transparent bg-clip-text"
                                        style={{
                                            backgroundImage: 'linear-gradient(180deg, #08D5CE 0%, #8DEFA4 100%)',
                                        }}
                                    >
                                        +
                                    </p>
                                </div>
                                <p className="text-[#000000]/54 font-poppins font-normal 
                                              text-[8px] sm:text-[12px] md:text-[14px] xl:text-[16px] 
                                              leading-none capitalize tracking-tight">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Institution Logos - Scrolling Carousel */}
                <div className="w-full overflow-hidden relative mt-4 md:mt-12 lg:mt-24 pb-8">
                    <motion.div
                        className="flex items-center gap-8 sm:gap-10 md:gap-12 lg:gap-[64px] w-max"
                        animate={{
                            x: ["0%", "-50%"]
                        }}
                        transition={{
                            x: {
                                duration: 25, // Slow, professional scroll
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                    >
                        {/* Double the logos for seamless loop */}
                        {[...institutionsLogos, ...institutionsLogos, ...institutionsLogos, ...institutionsLogos].map((logo, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex items-center justify-center h-[24px] sm:h-[30px] lg:h-[35.21px]"
                            >
                                <img
                                    src={logo}
                                    alt={`Partner Logo ${index + 1}`}
                                    className="h-full w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default TrustedBy;