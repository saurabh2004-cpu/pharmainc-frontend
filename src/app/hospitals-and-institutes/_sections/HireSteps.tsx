'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const HireSteps = () => {
    const steps = [
        {
            number: '01',
            title: 'Workforce Requirements',
            description:
                `Specify hiring needs based on specialty, experience, shift type, location,
                and staffing urgency, all through a centralized hiring workflow.`,
            image: '/hospitals-and-institutes/step-1.png',
            position: 'right',
        },
        {
            number: '02',
            title: 'Access Verified Professionals',
            description:
                `Browse verified healthcare professionals with validated credentials,
                experience history, availability status, and specialization details.`,
            image: '/hospitals-and-institutes/step-2.png',
            position: 'left',
        },
        {
            number: '03',
            title: 'Shortlist & Connect',
            description:
                `Review profiles, shortlist candidates, coordinate interviews, and connect
                directly with healthcare professionals without third-party intermediaries.`,
            image: '/hospitals-and-institutes/step-3.png',
            position: 'right',
        },
        {
            number: '04',
            title: 'Deploy Workforce Faster',
            description:
                `Streamline onboarding and reduce hiring delays through a faster, more
                direct healthcare recruitment process.`,
            image: '/hospitals-and-institutes/step-4.png',
            position: 'left',
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
        <section id="hire-steps" className="w-full bg-white px-4 md:px-8 py-6 pb-14 xl:py-16 scroll-mt-24">
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
                        How PharmInc Works
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
                                    <div className={`flex items-center gap-3 xl:mb-4 ${step.position === 'right' ? 'md:justify-end' : 'md:justify-start'}`}>
                                        {step.position === 'right' ? (
                                            <>
                                                <span className="hidden md:block w-[64px] h-[4px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                                <span className="font-inter font-bold text-[30px] md:text-[30px] xl:text-[60px] leading-tight md:leading-[60px] bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)] bg-clip-text text-transparent">
                                                    {step.number}
                                                </span>
                                                <span className="md:hidden w-[40px] h-[3px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-inter font-bold text-[30px] md:text-[30px] xl:text-[60px] leading-tight md:leading-[60px] bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)] bg-clip-text text-transparent">
                                                    {step.number}
                                                </span>
                                                <span className="w-[40px] md:w-[64px] h-[3px] md:h-[4px] rounded-full bg-[linear-gradient(90deg,#08D5CE_0%,#8DEFA4_100%)]"></span>
                                            </>
                                        )}
                                    </div>
                                    <div className="">
                                        <h3 className="text-[26px] md:text-[20px] lg:text-[36px] font-medium font-inter leading-tight md:leading-[40px] text-gray-900 xl:mb-4 text-left">
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
                                className={`flex-1  w-full max-w-[27rem] mx-auto md:max-w-none flex justify-center ${step.position === 'right' ? 'md:order-2' : 'md:order-1'
                                    }`}
                            >
                                <div
                                    className="relative w-full  aspect-[4/3] md:aspect-auto  md:h-[250px] lg:h-[350px] rounded-2xl overflow-hidden shadow-md border border-gray-100"
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-fill"
                                        priority={index === 0}
                                    />
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