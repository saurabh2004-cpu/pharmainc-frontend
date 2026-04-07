'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        id: 1,
        question: 'How do hospitals or clinics post a job on the portal?',
        answer: 'Hospitals and clinics can post jobs by logging into their account, navigating to the job posting section, filling in the required details including position, qualifications, and location, and then submitting for approval. The process typically takes 24-48 hours for review.',
    },
    {
        id: 2,
        question: 'How do hospitals or clinics post a job on the portal?',
        answer: 'The same process applies to all healthcare institutions. Our platform provides templates and guided steps to make posting jobs quick and efficient. Support is available 24/7 if you need assistance.',
    },
    {
        id: 3,
        question: 'How do hospitals or clinics post a job on the portal?',
        answer: 'Job postings are visible to qualified candidates immediately after approval. You can manage postings, view applications, and communicate with candidates through the dashboard.',
    },
    {
        id: 4,
        question: 'How do hospitals or clinics post a job on the portal?',
        answer: 'The platform supports multiple languages and formats. You can also set specific requirements, salary ranges, and preferred qualifications for better candidate matching.',
    },
    {
        id: 5,
        question: 'How do hospitals or clinics post a job on the portal?',
        answer: 'Premium features include featured job listings, priority candidate matching, and advanced analytics. Contact our sales team to learn more about available plans.',
    },
];

export default function QnA() {
    const [activeId, setActiveId] = useState<number | null>(null);

    const toggleAccordion = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="w-full bg-white px-4 pt-8 md:pt-10 lg:pt-0  lg:py-20 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Side - QnA Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full"
                    >
                        <h2
                            className="font-semibold text-gray-900 mb-8 md:mb-12 text-[1.45rem] sm:text-[2.25rem] lg:text-[2.5rem]"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 600,
                                lineHeight: '118%',
                                letterSpacing: '0%'
                            }}
                        >
                            Your Questions, Answered
                        </h2>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => toggleAccordion(item.id)}
                                        className="w-full py-4 md:py-6 flex items-center justify-between hover:opacity-70 transition-opacity text-left"
                                    >
                                        <span
                                            className="text-gray-900 pr-4 text-[1.1rem] md:text-[1.25rem]"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontWeight: 400,
                                                lineHeight: '100%',
                                                letterSpacing: '0%',
                                                textAlign: 'left' // Reverted to left for better mobile flow
                                            }}
                                        >
                                            {index + 1}. {item.question}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: activeId === item.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown size={20} className="text-gray-600" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {activeId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="pb-4 md:pb-6 text-gray-600 text-[1rem] md:text-[1.2rem]"
                                                    style={{
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontWeight: 300,
                                                        lineHeight: '160%',
                                                        letterSpacing: '0%',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {item.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Gradient Border Bottom */}
                                    <div
                                        className="absolute bottom-0 left-0 w-full h-[2.5px]"
                                        style={{ background: 'linear-gradient(90deg, #08D5CE 0%, #8DEFA4 100%)', opacity: 0.3 }}
                                    />

                                    {/* Active Highlight Underline */}
                                    <motion.div
                                        animate={{
                                            scaleX: activeId === item.id ? 1 : 0,
                                            opacity: activeId === item.id ? 1 : 1, // Keep visible but scaled
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute bottom-0 left-0 w-full h-[2.5px] origin-left z-10"
                                        style={{ background: 'linear-gradient(90deg, #08D5CE 0%, #8DEFA4 100%)' }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full flex items-center justify-center p-6 sm:p-12 lg:p-12 lg:mt-12 lg:mt-0"
                    >
                        <div className="relative scale-[0.7] sm:scale-[0.85] lg:scale-100 transition-transform duration-300">
                            {/* Accent Gradient Glow */}
                            <div
                                className="absolute -inset-4 blur-2xl opacity-20 -z-10 rounded-full"
                                style={{ background: 'linear-gradient(90deg, #08D5CE 0%, #8DEFA4 100%)' }}
                            />

                            {/* Main Image Container */}
                            <div
                                className="relative shadow-2xl overflow-hidden z-0 h-[25.984rem] w-[22.984rem] md:h-[25.984rem] md:w-[45.984rem] lg:h-[25.984rem] lg:w-[22.984rem] xl:w-[25.984rem] xl:h-[24.375rem] rounded-[1.38rem] opacity-100"
                            >
                                <Image
                                    src="/medical-professionals/qnasection-img-1.png"
                                    alt="Activity Panel - Healthcare Professionals"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Overlay Card 1 - Top Left */}
                            <motion.div
                                initial={{ opacity: 0, y: -20, rotate: -20 }}
                                whileInView={{ opacity: 1, y: 0, rotate: -15 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="absolute  -top-12 -left-16 w-48 sm:w-56 h-32 sm:h-40 z-20  rounded-xl overflow-hidden"
                            >
                                <Image
                                    src="/medical-professionals/qna-section-img-2.png"
                                    alt="Activity Feed Card 1"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Overlay Card 2 - Bottom Right */}
                            <motion.div
                                initial={{ opacity: 0, y: 20, rotate: 10 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 15 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute bottom-12 sm:bottom-20 -right-16 sm:-right-25 w-56 sm:w-64 h-40 sm:h-48 z-10 rounded-xl overflow-hidden"
                            >
                                <Image
                                    src="/medical-professionals/qna-section-img-2.png"
                                    alt="Activity Feed Card 2"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}