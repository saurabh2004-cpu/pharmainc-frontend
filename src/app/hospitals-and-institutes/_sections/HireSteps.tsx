'use client';

import { motion, Variants } from 'framer-motion';
import { File, FileText, FileTextIcon } from 'lucide-react';
import Image from 'next/image';

const HireSteps = () => {
    const steps = [
        {
            number: '01',
            title: 'Complete your profile',
            description:
                "To increase your chances of attracting the attention of recruiters, it's important to fully complete your profile",
            image: '/form-mockup-1.jpg',
            position: 'right',
        },
        {
            number: '02',
            title: 'Upload your resume',
            description:
                'Showcase your experience and skills by uploading a professional resume that highlights your achievements',
            image: '/form-mockup-2.jpg',
            position: 'left',
        },
        {
            number: '03',
            title: 'Browse opportunities',
            description:
                'Explore thousands of job listings tailored to your skills and preferences from top companies',
            image: '/form-mockup-3.jpg',
            position: 'right',
        },
    ];

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
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="w-full bg-white px-4 md:px-8 py-6 pb-14 xl:py-16">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="text-center mb-8 lg:mb-12 xl:mb-24"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-[28px] sm:text-[32px] md:text-[35px] font-semibold font-poppins leading-tight md:leading-none text-center text-gray-900 mb-4"
                    >
                        Hire in 4 Simple Steps
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-[18px] font-normal font-poppins leading-relaxed md:leading-none text-gray-600 max-w-2xl mx-auto text-center"
                    >
                        Streamline your healthcare hiring process with our intuitive platform
                    </motion.p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                    className="space-y-10 md:space-y-20 lg:space-y-12 xl:space-y-16"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col md:flex-row items-center xl:items-start lg:items-center  gap-10 lg:gap-24"
                        >
                            {/* Content */}
                            <div
                                className={`flex-1 flex flex-col ${step.position === 'right' ? 'md:order-1 items-start md:items-end text-left md:text-right' : 'md:order-2 items-start text-left'
                                    }`}
                            >
                                <div className='flex flex-col max-w-[26rem] lg:max-w-[22.75rem]'>
                                    <div className={`flex items-center gap-3 mb-4 ${step.position === 'right' ? 'md:justify-end' : 'md:justify-start'}`}>
                                        {step.position === 'right' ? (
                                            <>
                                                <span className="hidden md:block w-[64px] h-[4px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                                <span className="font-inter font-bold text-[40px] md:text-[60px] leading-tight md:leading-[60px] bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)] bg-clip-text text-transparent">
                                                    {step.number}
                                                </span>
                                                <span className="md:hidden w-[40px] h-[3px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-inter font-bold text-[40px] md:text-[60px] leading-tight md:leading-[60px] bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)] bg-clip-text text-transparent">
                                                    {step.number}
                                                </span>
                                                <span className="w-[40px] md:w-[64px] h-[3px] md:h-[4px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                            </>
                                        )}
                                    </div>
                                    <div className="">
                                        <h3 className="text-[26px] md:text-[30px] lg:text-[36px] font-medium font-inter leading-tight md:leading-[40px] text-gray-900 mb-4 text-left">
                                            {step.title}
                                        </h3>
                                        <p
                                            className={`text-base md:text-lg font-normal font-inter leading-relaxed md:leading-[1.625] tracking-normal text-gray-600 w-full  h-auto md:h-[5.5rem] text-left`}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Mockup */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`flex-1 w-full max-w-[27rem] mx-auto md:max-w-none flex justify-center ${step.position === 'right' ? 'md:order-2' : 'md:order-1'
                                    }`}
                            >
                                <div
                                    className="relative shadow-2xl flex items-center justify-center p-5 md:p-10 w-full aspect-[4/3] md:aspect-auto"
                                    style={{
                                        maxWidth: '27.043rem',
                                        height: 'auto',
                                        minHeight: '18rem',
                                        background: 'linear-gradient(123.89deg, #73E5A8 3.39%, #35D9BB 98.16%)',
                                        borderRadius: '0.95rem'
                                    }}
                                >
                                    <div className="bg-white rounded-2xl px-4 py-8 md:px-6 md:py-6 w-full shadow-lg flex flex-col gap-3 md:gap-4">
                                        {[
                                            { label: 'Curriculum Vitae', sub: 'pdf, doc' },
                                            { label: 'Personal Data', sub: 'Two file' },
                                            { label: 'Academic Information', sub: 'Two file or pdf' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between group border p-1 rounded-lg">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#56e0b1]/10 flex items-center justify-center">
                                                        {/* <div className="w-5 h-6 bg-indigo-200 rounded-sm"></div> */}
                                                        <FileTextIcon className="w-4 h-4 md:w-5 md:h-6 text-[#56e0b1]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[12px] font-inter md:text-[14px] font-semibold text-gray-800">{item.label}</span>
                                                        <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">{item.sub}</span>
                                                    </div>
                                                </div>
                                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#004643] flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HireSteps;