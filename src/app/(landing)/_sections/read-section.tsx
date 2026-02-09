"use client";

import React from 'react'
import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';

interface InsightCard {
  id: number;
  readTime: string;
  title: string;
  description: string;
  color: string;
}

const insights: InsightCard[] = [
  {
    id: 1,
    readTime: "5 min read",
    title: "Insights, Innovations, and Ideas Shaping the Future of Healthcare",
    description: "The future of healthcare lies in community learning and shared opportunities.",
    color: "bg-blue-500"
  },
  {
    id: 2,
    readTime: "5 min read", 
    title: "Connecting Professionals, Advancing Medical Knowledge",
    description: "The future of healthcare lies in community learning and shared opportunities.",
    color: "bg-orange-500"
  },
  {
    id: 3,
    readTime: "5 min read",
    title: "Insights & Innovations Shaping the Future of Healthcare", 
    description: "The future of healthcare lies in community learning and shared opportunities.",
    color: "bg-purple-500"
  }
];

const ReadSection = () => {
  return (
    <section className='py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8'>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="flex-1 lg:max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#010205] leading-tight'
            >
              Insights That Power Medical Innovation
            </motion.h1>
          </div>
          
          <div className="flex flex-col space-y-6 lg:max-w-md">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className='text-[#878C91] text-sm md:text-base leading-relaxed'
            >
              We are the top digital marketing agency for branding corp. We offer a full range of services to help clients improve their search engine rankings and drive more traffic to their websites.
            </motion.span>
            
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='flex items-center justify-center space-x-3 px-6 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-white hover:text-black hover:outline-1 hover:outline-black hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-fit group'
            >
              <span>See more</span>
              <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 rounded-full ${insight.color}`}></div>
                  <span className="text-xs text-[#878C91] font-medium">
                    {insight.readTime}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-semibold text-[#010205] mb-4 transition-colors duration-200 leading-snug">
                      {insight.title}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[#878C91] text-xs lg:text-sm leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="flex justify-end">
                      <div className="size-10 rounded-full border border-gray-200 group-hover:border-black group-hover:bg-black flex items-center justify-center transition-all duration-200">
                        <FaArrowRight className="text-gray-400 group-hover:text-white text-sm transition-all duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReadSection;