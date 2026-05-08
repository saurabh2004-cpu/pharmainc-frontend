'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Zap, Calendar } from 'lucide-react';

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

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

export default function RecruitmentProcess() {
    return (
        <div className="w-full bg-white overflow-hidden px-7 xl:px-0">
            {/* Trusted Partners Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={containerVariants}
                className="px-4 sm:px-8 lg:px-16 py-6 sm:py-16 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white "
            >
                <motion.div variants={itemVariants} className="text-center flex flex-col justify-center items-center gap-4 md:gap-6">
                    <div className="inline-flex p-[1px] rounded-full bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] mb-8 shadow-sm hover:shadow-md transition-shadow duration-300 ">
                        <div className="bg-white px-6 py-1.5 rounded-full">
                            <p className="text-[10px] sm:text-xs font-bold text-gray-600 tracking-[0.2em] uppercase">
                                Trusted Partners
                            </p>
                        </div>
                    </div>
                    <div className="w-6xl overflow-hidden relative mt-4 md:mt-0">
                        <motion.div
                            className="flex items-center gap-8 sm:gap-12 lg:gap-20 w-max"
                            animate={{
                                x: ["0%", "-50%"]
                            }}
                            transition={{
                                x: {
                                    duration: 30, // Slow, professional scroll
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        >
                            {/* Double the logos for seamless loop */}
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    <Image
                                        src="/medical-professionals/carousel-brands.png"
                                        alt="logoipsum"
                                        width={120}
                                        height={60}
                                        className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 h-auto w-auto max-w-[100px] sm:max-w-none"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Recruitment Process Header */}
            <motion.section
                id="recruitment-process"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={sectionVariants}
                className="  py-12 lg:py-16 max-w-6xl mx-auto scroll-mt-24"
            >
                <motion.div variants={containerVariants} className="text-center max-w-3xl mx-auto mb-10 lg:mb-20">
                    <motion.div variants={itemVariants} className="inline-flex p-[1px] rounded-full bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4] mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="bg-white px-6 py-1.5 rounded-full">
                            <p className="text-[10px] sm:text-xs font-bold text-gray-600 tracking-[0.2em] uppercase">
                                Recruitment Process
                            </p>
                        </div>
                    </motion.div>
                    <div className="flex flex-col items-center justify-center">
                        <motion.h2
                            variants={itemVariants}
                            className="font-poppins mr-2 xl:mr-3 text-base sm:text-[24px] md:text-[35px] font-semibold leading-[1.1] text-center text-gray-900 text-balance"
                        >
                            Smooth process,
                        </motion.h2>
                        <motion.h2
                            variants={itemVariants}
                            className="font-poppins text-base sm:text-[24px] md:text-[35px] font-semibold leading-[1.1] text-center text-gray-900 mb-4 text-balance"
                        >
                            outstanding achievements.
                        </motion.h2>
                    </div>
                    <motion.p variants={itemVariants} className="font-poppins text-xs sm:text-sm md:text-[18px] font-normal leading-[1.4] text-center text-gray-600">
                        Highlighting the excellent and transparent process from our post to selection in a
                        <br className="hidden sm:block" />
                        landing it real.
                    </motion.p>
                </motion.div>

                {/* Complete Your Profile Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="grid grid-cols-1   md:grid-cols-2 gap-8 lg:gap-20 items-center mb-10 lg:mb-30"
                >
                    {/* Left: Decorative Circles */}
                    <motion.div variants={itemVariants} className="relative h-[250px] sm:h-80 lg:h-96 w-full max-w-sm mx-auto lg:max-w-none block order-2 md:order-1 mt-8 lg:mt-0">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full relative border border-transparent flex flex-col"
                        >
                            <Image
                                src="/medical-professionals/steps-1.png"
                                alt="Decorative background elements"
                                fill
                                className="object-contain object-left"
                                priority
                            />


                        </motion.div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div variants={itemVariants} className='order-1 md:order-2 flex flex-col justify-center lg:ml-auto  lg:text-left items-center lg:items-start'>
                        <h3 className="font-poppins text-[24px] md:text-[30px] font-semibold leading-[1.2] text-gray-900 mb-4 lg:mb-6">
                            Complete Your Professional Profile
                        </h3>
                        <ul className="space-y-4 lg:space-y-8 max-w-md text-left">
                            {[
                                'Add specialty and department expertise',
                                'Mention years of clinical experience',
                                'Select preferred cities and institutions',
                                'Set full-time, part-time, or shift preferences',
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    className="flex gap-3 lg:gap-4 items-start text-gray-700"
                                >
                                    <span className="text-gray-900 font-bold text-lg lg:text-xl flex-shrink-0 ">•</span>
                                    <span className="font-poppins text-[16px] lg:text-[22px] font-normal leading-[1.3]">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Directly Portfolio Upload Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 lg:tems-center mb-5 sm:mb-10 md:mb-25 lg:mb-50"
                >
                    {/* Left: Text Content */}
                    <motion.div variants={itemVariants} className=" lg:text-left flex flex-col items-center lg:items-start">
                        <h3 className="font-poppins text-[24px] md:text-[30px] font-semibold leading-[1.2] text-gray-900 mb-4 lg:mb-6">
                            Upload Credentials & Resume
                        </h3>
                        <ul className="space-y-4 lg:space-y-8 max-w-md text-left">
                            {[
                                'Upload medical licenses and certifications',
                                'Add updated resume and portfolio',
                                'Verify qualifications and registrations',
                                'Improve profile trust and visibility',
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    className="flex gap-3 lg:gap-4 items-start text-gray-700"
                                >
                                    <span className="text-gray-900 font-bold text-lg lg:text-xl flex-shrink-0 ">•</span>
                                    <span className="font-poppins text-[16px] lg:text-[22px] font-normal leading-[1.3]">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right: Candidate Reports Visual */}
                    <div className="relative h-[250px] sm:h-[600px] md:h-full w-full mx-auto lg:ml-auto lg:mr-0 group mt-12 lg:mt-0 max-w-md lg:max-w-none">
                        <motion.div
                            variants={itemVariants}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8  md:-right-24 md:-top-10   lg:-right-2 w-[100%] md:w-[130%] h-[90%] md:h-[130%] z-10"
                        >
                            <div className="relative w-full h-full rounded-3xl">
                                <Image
                                    src="/medical-professionals/steps-2.png"
                                    alt="Candidate Analysis"
                                    fill
                                    className="object-contain lg:p-2 lg:object-right"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>


                {/* Discover Matching Opportunities Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 items-center mb-10 lg:mb-30"
                >
                    {/* Left: Visual Content */}
                    <motion.div variants={itemVariants} className="relative h-[250px] sm:h-80 lg:h-96 w-full max-w-sm mx-auto lg:max-w-none block order-2 md:order-1 mt-8 lg:mt-0">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full relative border border-transparent flex flex-col"
                        >
                            <Image
                                src="/medical-professionals/steps-3.png"
                                alt="Decorative background elements"
                                fill
                                className="object-contain object-left"
                            />


                        </motion.div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div variants={itemVariants} className='order-1 md:order-2 flex flex-col justify-center lg:ml-auto  lg:text-left items-center lg:items-start'>
                        <h3 className="font-poppins text-[24px] md:text-[30px] font-semibold leading-[1.2] text-gray-900 mb-4 lg:mb-6">
                            Discover Matching Opportunities
                        </h3>
                        <ul className="space-y-4 lg:space-y-8 max-w-md text-left">
                            {[
                                'Access verified healthcare institutions',
                                'Explore specialty-based job openings',
                                'Filter roles by location and availability',
                                'Apply directly without agency involvement',
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    className="flex gap-3 lg:gap-4 items-start text-gray-700"
                                >
                                    <span className="text-gray-900 font-bold text-lg lg:text-xl flex-shrink-0 ">•</span>
                                    <span className="font-poppins text-[16px] lg:text-[22px] font-normal leading-[1.3]">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Interview & Get Hired Faster Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-8 lg:gap-16 items-start"
                >
                    {/* Right: Profile Images and Chat (Flipped to Right on Desktop) */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center lg:items-end md:space-y-4 w-full order-2 md:order-2 mt-8 lg:mt-0"
                    >
                        {/* Profile Images */}
                        {/* <div className="flex justify-center lg:justify-end gap-3 sm:gap-6 xl:gap-10 relative z-10 w-full mr-3">
                            <Image
                                src="/medical-professionals/interview-person-1.png"
                                alt="Candidate 1 Analysis"
                                width={225}
                                height={220}
                                className="object-contain w-[42%] sm:w-[225px] md:w-[140px] lg:w-[188px] xl:w-[225px] h-auto"
                            />
                            <Image
                                src="/medical-professionals/interview-person-2.png"
                                alt="Candidate 2 Analysis"
                                width={225}
                                height={220}
                                className="object-contain w-[42%] sm:w-[225px] md:w-[140px] lg:w-[188px] xl:w-[225px] h-auto"
                            />
                        </div> */}
                        {/* Chat Interface Mockup */}
                        <div className="w-full flex justify-center lg:justify-end items-start relative z-0 mt-4 sm:mt-0">
                            <Image
                                src="/medical-professionals/steps-4.png"
                                alt="Interview Screen Mockup"
                                width={569}
                                height={344}
                                className="object-contain w-[98%] sm:w-[569px] h-auto max-w-full lg:object-right"
                            />
                        </div>
                    </motion.div>

                    {/* Left: Text Content (Flipped to Left on Desktop) */}
                    <motion.div variants={itemVariants} className="lg:mr-auto mt-0 md:mt-15 text-center md:text-left flex flex-col items-center lg:items-start order-1 md:order-1">
                        <h3 className="font-poppins text-[24px] md:text-[30px] font-semibold leading-[1.6] text-gray-900 mb-4 lg:mb-6">
                            Interview & Get Hired Faster
                        </h3>
                        <ul className="space-y-4 lg:space-y-8 max-w-md text-left">
                            {[
                                'Schedule interviews directly with recruiters',
                                'Track applications in one dashboard',
                                'Communicate with institutions easily',
                                'Reduce delays in onboarding and hiring',
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    variants={itemVariants}
                                    className="flex gap-3 lg:gap-4 items-start text-gray-700"
                                >
                                    <span className="text-gray-900 font-bold text-lg lg:text-xl flex-shrink-0 ">•</span>
                                    <span className="font-poppins text-[16px] lg:text-[22px] font-normal leading-[1.3]">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </motion.section>
        </div >
    );
}
