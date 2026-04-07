'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface JobCard {
    id: number;
    company: string;
    logo: string;
    title: string;
    experience: string;
    type: string;
    level: string;
    salary: string;
    jobType: string;
    location: string;
    featured?: boolean;
}

const jobsData: JobCard[] = [
    {
        id: 1,
        company: 'jobs.co',
        logo: '/medical-professionals/jobs-icon.png',
        title: 'Staff Nurse – ICU',
        experience: '2 years experience',
        type: 'Full Time',
        level: 'Junior',
        salary: '₹25,000 – ₹35,000',
        jobType: 'Full-time',
        location: 'Pune',
        featured: true,
    },
    {
        id: 2,
        company: 'jobs.co',
        logo: '/medical-professionals/jobs-icon.png',
        title: 'General Physician',
        experience: '3 years experience',
        type: 'Full Time',
        level: 'Mid-Level',
        salary: '₹50,000 – ₹70,000',
        jobType: 'Full-time',
        location: 'Bangalore',
    },
    {
        id: 3,
        company: 'jobs.co',
        logo: '/medical-professionals/jobs-icon.png',
        title: 'Staff Nurse – ICU',
        experience: '1 year experience',
        type: 'Part Time',
        level: 'Entry Level',
        salary: '₹15,000 – ₹25,000',
        jobType: 'Part-time',
        location: 'Hyderabad',
    },
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
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export default function Jobs() {
    return (
        <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-6"
                    >
                        <div className="inline-flex p-[1px] rounded-full bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4]">
                            <div className="bg-white px-4 sm:px-8 py-2 rounded-full">
                                <p className="text-gray-800 font-poppins font-normal text-[18px] leading-none text-center">
                                    Top Opportunities
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-poppins font-semibold text-[28px] sm:text-[35px] leading-none text-gray-900 mb-4 text-balance"
                    >
                        Popular jobs are here
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="font-poppins font-normal text-[16px] sm:text-[18px] leading-none text-gray-600 max-w-2xl mx-auto"
                    >
                        Encouraging users to explore widely sought-after positions that align with their ambitions.
                    </motion.p>
                </motion.div>

                {/* Job Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6 sm:space-y-8 mb-12 sm:mb-16"
                >
                    {jobsData.map((job) => (
                        <motion.div
                            key={job.id}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.3 } }}
                            className="relative group transition-all duration-300"
                        >
                            {/* Featured Badge Circle */}
                            {job.featured && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="absolute -right-8 sm:-right-6 -rotate-45 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-[#08D5CE] to-[#8DEFA4] rounded-full flex items-center justify-center text-white font-bold shadow-lg hidden sm:flex"
                                >
                                    <ArrowRight size={24} strokeWidth={1} className='text-black' />
                                </motion.div>
                            )}

                            <div className="bg-white border-1 border-gray-400 rounded-3xl p-6 sm:p-8 hover:shadow-[3px_3px_2px_0px_#50E3B9] transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                                    {/* Left Content */}
                                    <div className="flex-1">
                                        {/* Company Logo and Name */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                            className="flex items-center gap-2 mb-4"
                                        >
                                            <Image src={job.logo} alt={job.company} className="text-2xl" width={20} height={20} />
                                            <span className="font-poppins font-normal text-[18px] sm:text-[20px] leading-none text-gray-700">{job.company}</span>
                                        </motion.div>

                                        {/* Job Title */}
                                        <motion.h3
                                            initial={{ opacity: 0, y: 5 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className="font-poppins font-semibold text-[20px] sm:text-[25px] leading-none text-gray-900 mb-4"
                                        >
                                            {job.title}
                                        </motion.h3>

                                        {/* Badges */}
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="flex flex-wrap gap-3"
                                        >
                                            <motion.span
                                                variants={badgeVariants}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 font-poppins font-normal text-[15px] sm:text-[17px] leading-none text-center rounded-full border border-gray-200"
                                            >
                                                {job.experience}
                                            </motion.span>
                                            <motion.span
                                                variants={badgeVariants}
                                                transition={{ delay: 0.1 }}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 font-poppins font-normal text-[15px] sm:text-[17px] leading-none text-center rounded-full border border-gray-200"
                                            >
                                                {job.type}
                                            </motion.span>
                                            <motion.span
                                                variants={badgeVariants}
                                                transition={{ delay: 0.2 }}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 font-poppins font-normal text-[15px] sm:text-[17px] leading-none text-center rounded-full border border-gray-200"
                                            >
                                                {job.level}
                                            </motion.span>
                                        </motion.div>
                                    </div>

                                    {/* Right Content - Job Details */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="flex-1 flex flex-col items-start sm:items-end text-left sm:text-right space-y-4 sm:space-y-6"
                                    >
                                        {/* Salary */}
                                        <div className='flex flex-col items-start sm:items-end w-full'>
                                            <div className='text-left'>
                                                <p className="font-poppins font-normal text-[15px] sm:text-[16px] leading-none text-gray-500 mb-2">Salary:</p>
                                                <p className="font-poppins font-semibold text-[18px] sm:text-[22px] leading-none text-gray-900">{job.salary}</p>
                                            </div>
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <p className="font-poppins font-normal text-[16px] sm:text-[18px] text-left sm:text-end leading-none text-gray-500 mb-0">Type: {job.jobType}</p>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <p className="font-poppins font-normal text-[16px] sm:text-[18px] text-left sm:text-end leading-none text-gray-500 mb-1">Location: {job.location}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* See More Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 sm:px-10 py-3 sm:py-3 bg-[linear-gradient(93.47deg,_#08D5CE_5.51%,_#8DEFA4_93.19%)] text-black font-poppins font-normal text-[18.2px] leading-none rounded-full flex items-center gap-2 transition-all duration-300"
                    >
                        See more jobs
                        <ArrowRight size={20} strokeWidth={2} className='-rotate-45' />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
