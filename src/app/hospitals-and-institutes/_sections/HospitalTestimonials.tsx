'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const hospitalTestimonials = [
    {
        id: 1,
        logo: '🏥',
        hospital: 'Cleveland Clinic',
        quote: "Working with this team has significantly improved our operational clarity and helped us maintain smoother coordination across multiple departments. Their approach has been professional, reliable, and well-organized throughout the process. We have especially appreciated their consistent communication.",
        name: 'David Wilson',
        title: 'Director of Operations, Cleveland Clinic',
    },
    {
        id: 2,
        logo: '🏨',
        hospital: 'Mayo Clinic',
        quote: "The platform has transformed how we manage our hiring process. The efficiency gains and reduced time-to-hire have been remarkable. The team's dedication to understanding our unique needs has been exceptional.",
        name: 'Sarah Anderson',
        title: 'Chief Human Resources Officer, Mayo Clinic',
    },
    {
        id: 3,
        logo: '⚕️',
        hospital: 'Johns Hopkins',
        quote: "Outstanding support and seamless integration with our existing systems. The platform has enabled us to access a wider pool of qualified professionals while maintaining our rigorous standards.",
        name: 'Dr. Michael Chen',
        title: 'Chief Medical Officer, Johns Hopkins',
    },
];

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

export default function HospitalTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % hospitalTestimonials.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? hospitalTestimonials.length - 1 : prev - 1
        );
    };

    // Auto-pagination logic
    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]); // Interval resets when index changes to avoid double-paging if user clicks manually

    const current = hospitalTestimonials[currentIndex];

    return (
        <div className='bg-white pb-20'>
            <section id="hospital-testimonials" className="w-full bg-[#233F64] px-4 md:px-8 py-16 md:py-24 scroll-mt-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="max-w-6xl mx-auto"
                >
                    {/* Heading */}
                    <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
                        <h2 className="text-[35px] font-figtree font-semibold leading-[100%] text-white">
                            What Hospitals & Institutions Say
                        </h2>
                    </motion.div>

                    {/* Testimonial Card with Navigation */}
                    <motion.div variants={itemVariants} className="relative">
                        <div className="flex items-center justify-center relative md:gap-6">
                            {/* Left Arrow */}
                            <motion.button
                                whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToPrev}
                                className="absolute left-8 top-1/2 -translate-y-1/2 md:relative md:top-0 md:translate-y-0 md:left-12 xl:left-0 z-20 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full text-slate-900 flex items-center justify-center shadow-lg group relative overflow-hidden"
                                aria-label="Previous testimonial"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,#08D5CE_0%,#8DEFA4_100%)]"></div>
                                <ChevronLeft size={24} className="md:w-6 md:h-6 relative z-10" />
                            </motion.button>

                            {/* Main Testimonial Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.id}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full max-w-[55.8125rem] min-h-[20.375rem] bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] rounded-[1.875rem] pt-[12px] px-0 pb-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] mx-auto flex-shrink-0"
                                >
                                    <div className="bg-white rounded-t-[1.6rem] rounded-b-[1.8rem] p-6 md:p-8 lg:p-10 h-full relative flex flex-col items-start justify-center">
                                        <div className='w-full mx-auto  flex justify-center'>
                                            <div className='max-w-3xl flex flex-col items-start justify-start'>
                                                {/* Hospital Logo/Name */}
                                                <div className="flex items-center justify-start gap-3 mb-8">
                                                    <span className="text-4xl">{current.logo}</span>
                                                    <h3 className="text-[20px] font-figtree font-semibold leading-[100%] text-black whitespace-nowrap">
                                                        {current.hospital}
                                                    </h3>
                                                </div>

                                                {/* Testimonial Quote */}
                                                <p className="max-w-[650px] text-left text-black font-poppins font-normal text-[16px] leading-[26px] mb-10 opacity-100">
                                                    {`"${current.quote}"`}
                                                </p>

                                                {/* Testimonial Author */}
                                                <div className="flex flex-col items-start">
                                                    <p className="text-black font-poppins font-medium text-[16px] leading-[24px]">
                                                        {current.name}
                                                    </p>
                                                    <p className="text-[#6B7280] font-poppins font-normal text-[14px] leading-[20px]">
                                                        {current.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Right Arrow */}
                            <motion.button
                                whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToNext}
                                className="absolute right-8 top-1/2 -translate-y-1/2 md:relative md:top-0 md:translate-y-0 md:right-12 xl:right-0 z-20 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full text-slate-900 flex items-center justify-center shadow-lg group relative overflow-hidden"
                                aria-label="Next testimonial"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,#08D5CE_0%,#8DEFA4_100%)]"></div>
                                <ChevronRight size={24} className="md:w-6 md:h-6 relative z-10" />
                            </motion.button>
                        </div>

                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}
