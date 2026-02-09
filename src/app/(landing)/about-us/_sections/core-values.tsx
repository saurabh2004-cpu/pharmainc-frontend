"use client";

import React from 'react'
import { motion } from 'motion/react';
import { 
  FaUserMd, 
  FaLightbulb, 
  FaShieldAlt, 
  FaGlobe, 
  FaUsers, 
  FaHandshake 
} from 'react-icons/fa';

const CoreValues = () => {
  const coreValues = [
    {
      icon: FaUserMd,
      title: "Patient-Centered Care",
      description: "Everything we do is driven by our commitment to improving patient outcomes and healthcare quality worldwide."
    },
    {
      icon: FaLightbulb,
      title: "Innovation and Excellence",
      description: "We continuously push the boundaries of medical technology to provide cutting-edge solutions for healthcare professionals."
    },
    {
      icon: FaShieldAlt,
      title: "Data Privacy & Security",
      description: "We maintain the highest standards of data protection and privacy, ensuring all medical information is secure."
    },
    {
      icon: FaGlobe,
      title: "Global Accessibility",
      description: "Our mission is to make advanced medical knowledge and resources accessible to healthcare professionals everywhere."
    },
    {
      icon: FaUsers,
      title: "Collaboration & Community",
      description: "We believe in the power of collective knowledge—connecting medical minds to share insights, foster growth, and advance healthcare together."
    },
    {
      icon: FaHandshake,
      title: "Integrity & Trust",
      description: "We operate with transparency and accountability, building a trusted platform where professionals and institutions can engage with confidence."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-left mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#010205] mb-4">
            Our Core Values
          </h2>
          <p className="text-[#5D5D5D] text-base md:text-lg max-w-2xl">
            These fundamental principles guide everything we do and shape our commitment to the medical community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-gray-800" />
                </div>
                
                <h3 className="text-xl font-semibold text-[#010205]">
                  {value.title}
                </h3>
                
                <p className="text-[#5D5D5D] text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoreValues;