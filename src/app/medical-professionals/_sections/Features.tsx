'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
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
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
    hover: {
        y: -10,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

interface FeatureCard {
    id: number;
    title: string;
    description: string;
    image: string;
}



;

export default function Features({ features, heading }: { features: FeatureCard[], heading: string }) {
    const pathname = usePathname();
    const ishospitalsAndInstitutePage = pathname?.toLowerCase() === '/hospitals-and-institutes';

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        skipSnaps: false,
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);
    return (
        <section id="features" className="w-full bg-[#233F64] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20  relative overflow-hidden scroll-mt-24">
            {/* Decorative gradient elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="max-w-8xl mx-auto"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
                    <div className="bg-white text-gray-900 px-6 sm:px-8 py-[10px] rounded-full font-poppins font-normal text-[14px] sm:text-[16px] leading-none tracking-normal text-center flex items-center justify-center shadow-sm">
                        Our features
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    variants={itemVariants}
                    className="font-poppins font-semibold text-[25px] text-center lg:text-[35px] leading-none tracking-normal text-white mb-10 sm:mb-12 lg:mb-16 text-balance"
                >
                    {heading}
                </motion.h2>

                {/* Feature Carousel */}
                <div className="relative group/carousel">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {features.map((feature) => (
                                <div key={feature.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 px-3 sm:px-4">
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="group cursor-pointer h-full pb-4"
                                    >
                                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
                                            {/* Image Container */}
                                            <div className="relative w-full h-80 sm:h-72 md:h-80 overflow-hidden bg-gray-200">
                                                <Image
                                                    src={feature.image}
                                                    alt={feature.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Content Container */}
                                            <div className="p-6 sm:p-7 lg:p-8 flex-grow flex flex-col justify-between">
                                                {/* Title */}
                                                <h3 className="font-nunito font-semibold text-xl lg:text-lg xl:text-[24px] leading-tight tracking-[-0.01em] text-center bg-[linear-gradient(90deg,_#08D5CE_0%,_#8DEFA4_100%)] bg-clip-text text-transparent mb-3 sm:mb-4">
                                                    {feature.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="font-poppins font-normal lg:text-sm xl:text-[16px] leading-relaxed tracking-normal text-center text-gray-700">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-[#233F64] hover:bg-cyan-50 transition-colors z-30 disabled:opacity-50 disabled:cursor-not-allowed opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 translate-x-0 md:-translate-x-4 lg:-translate-x-12 md:group-hover/carousel:translate-x-0 lg:group-hover/carousel:-translate-x-6 transition-all duration-300"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-[#233F64] hover:bg-cyan-50 transition-colors z-30 disabled:opacity-50 disabled:cursor-not-allowed opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 translate-x-0 md:translate-x-4 lg:translate-x-12 md:group-hover/carousel:translate-x-0 lg:group-hover/carousel:translate-x-6 transition-all duration-300"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
