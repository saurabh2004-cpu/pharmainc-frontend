'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

const features: FeatureCard[] = [
    {
        id: 1,
        title: 'Connect with Healthcare',
        description: 'Network with industry experts and expand your career opportunities.',
        image: '/medical-professionals/features-1.png',
    },
    {
        id: 2,
        title: 'Connect with Healthcare',
        description: 'Network with industry experts and expand your career opportunities.',
        image: '/medical-professionals/features-1.png'
    },
    {
        id: 3,
        title: 'Connect with Healthcare',
        description: 'Network with industry experts and expand your career opportunities.',
        image: '/medical-professionals/features-1.png',
    },
];

export default function Features() {
    const pathname = usePathname();
    const ishospitalsAndInstitutePage = pathname?.toLowerCase() === '/hospitals-and-institutes';
    return (
        <section className="w-full bg-[#233F64] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20  relative overflow-hidden">
            {/* Decorative gradient elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="max-w-6xl mx-auto"
            >
                {/* Badge */}
                {!ishospitalsAndInstitutePage && <motion.div variants={itemVariants} className="flex justify-start mb-6 sm:mb-8">
                    <div className="bg-white text-gray-900 px-4 sm:px-8  py-[7px] rounded-full font-poppins font-normal text-[18px] leading-none tracking-normal text-center flex items-center justify-center">
                        Our features
                    </div>
                </motion.div>}

                {/* Heading */}
                <motion.h2
                    variants={itemVariants}
                    className="font-poppins font-semibold text-[25px] lg:text-[35px] leading-none tracking-normal text-white mb-10 sm:mb-12 lg:mb-16 text-balance"
                >
                    Why Choose Our Platform?
                </motion.h2>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-15"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group cursor-pointer"
                        >
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
                                {/* Image Container */}
                                <div className="relative w-full h-96 sm:h-[360px] md:h-80 overflow-hidden bg-gray-200">
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
                                    <h3 className="font-nunito font-semibold text-xl lg:text-lg xl:text-[24px] leading-none tracking-[-0.01em] text-center bg-[linear-gradient(90deg,_#08D5CE_0%,_#8DEFA4_100%)] bg-clip-text text-transparent mb-3 sm:mb-4">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-poppins font-normal lg:text-sm xl:text-[16px] leading-none tracking-normal text-center text-gray-700">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
