'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';

interface Testimonial {
    id: number;
    name: string;
    title: string;
    image: string;
    quote: string;
    company: string;
    companyLogo: React.ReactNode;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Dr Riya Kulkarni',
        title: 'Senior Medical Professional',
        image: '/medical-professionals/carousel-img-1.png',
        quote: 'This platform made it incredibly easy to discover hospital opportunities that match my specialization. I received interview calls within a week. Outstanding experience! The comprehensive job listings and matching algorithm helped me find roles that perfectly suited my qualifications.',
        company: 'Cleveland Clinic',
        companyLogo: <PlusCircle />,
    },
    {
        id: 2,
        name: 'Dr Arjun Sharma',
        title: 'General Practitioner',
        image: '/medical-professionals/carousel-img-1.png',
        quote: 'The platform is user-friendly and effective. I found the perfect position that aligns with my career goals and work-life balance preferences. Outstanding experience! The comprehensive job listings and matching algorithm helped me find roles that perfectly suited my qualifications.',
        company: 'Apollo Hospitals',
        companyLogo: <PlusCircle />,
    },
    {
        id: 3,
        name: 'Dr Sarah Mitchell',
        title: 'Healthcare Administrator',
        image: '/medical-professionals/carousel-img-1.png',
        quote: 'Outstanding experience! The comprehensive job listings and matching algorithm helped me find roles that perfectly suited my qualifications. Outstanding experience! The comprehensive job listings and matching algorithm helped me find roles that perfectly suited my qualifications.',
        company: 'Mayo Clinic',
        companyLogo: <PlusCircle />,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]); // Restart interval whenever the index changes to avoid double-paging if user clicks manually

    const cardVariants: Variants = {
        center: {
            x: '0%',
            scale: 1,
            zIndex: 10,
            opacity: 1,
            filter: 'blur(0px)',
        },
        left: {
            x: isMobile ? '-100%' : '-48%',
            scale: 0.8,
            zIndex: 5,
            opacity: isMobile ? 0 : 0.4,
            filter: 'blur(1px)',
        },
        right: {
            x: isMobile ? '100%' : '48%',
            scale: 0.8,
            zIndex: 5,
            opacity: isMobile ? 0 : 0.4,
            filter: 'blur(1px)',
        },
        hidden: {
            x: '0%',
            scale: 0.5,
            zIndex: 0,
            opacity: 0,
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="w-full bg-white px-1 md:px-8 py-12  lg:py-24 overflow-x-hidden pb-20 md:pb-0 lg:pb-0">
            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-16 md:mb-4">
                    <motion.div
                        className="inline-block mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="inline-flex p-[1.5px] rounded-full bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4]">
                            <div className="bg-white px-10 py-[8px] rounded-full flex items-center justify-center">
                                <span className="font-poppins font-normal text-[18px] leading-none text-gray-800 text-center">Testimonials</span>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="font-figtree font-semibold text-[28px] md:text-[35px] leading-none text-gray-900 mb-4 text-balance">
                        What Medical Professionals Say
                    </h2>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative h-auto min-h-[750px] sm:min-h-[650px] md:h-[450px] lg:h-[480px] w-full flex items-center justify-center overflow-visible">
                    {testimonials.map((testimonial, index) => {
                        let position = 'hidden';
                        const total = testimonials.length;

                        if (index === currentIndex) {
                            position = 'center';
                        } else if (index === (currentIndex - 1 + total) % total) {
                            position = 'left';
                        } else if (index === (currentIndex + 1) % total) {
                            position = 'right';
                        }

                        return (
                            <motion.div
                                key={testimonial.id}
                                variants={cardVariants}
                                animate={position}
                                initial="hidden"
                                transition={{
                                    x: { type: 'spring', stiffness: 260, damping: 25 },
                                    scale: { duration: 0.4 },
                                    opacity: { duration: 0.4 },
                                    zIndex: { duration: 0.1 }
                                }}
                                drag={position === 'center' ? 'x' : false}
                                dragElastic={1}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);

                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                                className="absolute w-[calc(100%-2rem)] max-w-[41.79rem] cursor-pointer"
                                style={{
                                    height: isMobile ? 'auto' : '24.5rem',
                                    borderRadius: '1.768rem',
                                }}
                                onClick={() => {
                                    if (position === 'left') paginate(-1);
                                    if (position === 'right') paginate(1);
                                }}
                            >
                                <div className={`bg-white border border-gray-100 transition-shadow duration-300 h-full ${position === 'center'
                                    ? 'shadow-[0_45px_80px_-15px_rgba(0,0,0,0.3)]'
                                    : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
                                    }`}
                                    style={{ borderRadius: '1.768rem' }}
                                >
                                    <div className={`flex flex-col md:flex-row ${position === 'right' ? 'md:flex-row-reverse' : ''} items-stretch gap-10`}>
                                        {/* Image section */}
                                        <div className="w-full md:w-2/5 relative">
                                            <div className="md:h-full flex items-center justify-center relative py-6 md:py-0">
                                                <div className="relative w-full max-w-[20rem] aspect-[4/5] md:absolute md:w-[18.05rem] md:h-[26.23rem] md:top-[-1.73rem] md:left-4 rounded-[1.768rem] md:rounded-r-none overflow-hidden shadow-xl z-20 mx-auto">
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        fill
                                                        className="object-cover"
                                                        priority={position === 'center'}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content section */}
                                        <div className={`w-full md:w-3/5 p-6 md:px-8 lg:px-15 flex flex-col justify-center transition-opacity duration-300 ${position !== 'center' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                            }`}>
                                            {/* Company Logo */}
                                            <div className="flex items-center align-center items-center gap-2 mb-4">
                                                <div className="w-5 h-5  rounded-full flex items-center justify-center text-black font-bold text-sm">
                                                    {testimonial.companyLogo}
                                                </div>
                                                <span className="font-inter font-bold text-[14.4px] leading-none text-[#00447C] uppercase">
                                                    {testimonial.company}
                                                </span>
                                            </div>

                                            {/* Quote */}
                                            <p className="font-poppins font-normal text-[17px] leading-[1.36] text-black mb-6 ">
                                                &quot;{testimonial.quote}&quot;
                                            </p>

                                            {/* Doctor name */}
                                            <p className="font-poppins font-semibold text-[17px] leading-none bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] bg-clip-text text-transparent">
                                                {testimonial.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Navigation Arrows */}
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(-1)}
                        className="absolute left-1 md:left-24 z-20 -translate-x-0 md:translate-x-0 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 md:p-3 shadow-lg transition-all border border-gray-100"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft strokeWidth={2.5} className="w-5 h-5 text-gray-800" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(1)}
                        className="absolute right-1 md:right-24 z-20 translate-x-0 md:translate-x-0 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 md:p-3 shadow-lg transition-all border border-gray-100"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight strokeWidth={2.5} className="w-5 h-5 text-gray-800" />
                    </motion.button>
                </div>

                {/* Indicators */}
                {/* <motion.div
                    variants={itemVariants}
                    className="flex justify-center gap-2 mt-8 md:mt-12"
                >
                    {testimonials.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-cyan-500 w-8' : 'bg-gray-300 w-2'
                                }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </motion.div> */}
            </motion.div>
        </section>
    );
}