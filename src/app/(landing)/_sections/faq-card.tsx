'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Why should I join Pharminc?",
    answer: "Because it's the only professional network built exclusively for healthcare in India—connecting you to jobs, societies, and peers."
  },
  {
    question: "Is it only for doctors?",
    answer: "No. Pharminc is for everyone in healthcare—students, doctors, dentists, nurses, researchers, and institutions."
  },
  {
    question: "Is Pharminc free to use?",
    answer: "Yes, building your profile and joining communities is completely free."
  },
  {
    question: "How secure is my data?",
    answer: "We use industry-standard encryption and verification to ensure your information is protected."
  }
]

const FaqCard = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? 0 : index)
  }

  return (
    <section className='px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 lg:py-16'>
      <div className="bg-white text-[#010205] overflow-hidden relative shadow-sm py-8 sm:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-10 rounded-2xl">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex flex-col lg:w-2/5 xl:w-1/3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4'
            >
              Your questions, answered
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-sm sm:text-base text-[#878C91] mb-6 max-w-md leading-relaxed'
            >
              Our FAQs are designed to guide doctors, researchers, and institutions in making the most of the platform. From security to engagement, we ensure you have clear answers to build trust and grow within the medical community.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
                    <button className='flex items-center space-x-3 md:space-x-8 px-4 md:px-6 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-white hover:text-black hover:outline-1 hover:outline-black hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-fit'>
                        <span>More Options</span>
                    </button>
                            
                    <button className='font-semibold text-sm text-black underline transition-all duration-200 hover:text-gray-600 active:scale-95 focus:outline-none w-fit'>
                        <span>Contact Us</span>
                    </button>
            </motion.div>
          </div>

          <div className="lg:w-3/5 xl:w-2/3">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="border-b border-[#E5E7EB] last:border-b-0"
                >
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full py-4 sm:py-5 text-left flex items-center justify-between group"
                  >
                    <span className="text-base sm:text-lg font-medium text-[#010205] pr-4 group-hover:text-[#4B5563] transition-colors duration-200">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        fill="none" 
                        className="text-[#878C91]"
                      >
                        <path 
                          d="M10 4V16M4 10H16" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 sm:pb-5 pr-8">
                          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqCard;