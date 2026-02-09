"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  id: number;
  quote: string;
  author: {
    name: string;
    title: string;
    image: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Pharminc made it easier to find verified jobs and connect with peers in my specialty. It's like LinkedIn, but built for me.",
    author: {
      name: "Dr. Aditi Sharma",
      title: "MBBS Intern",
      image: "/landing/demo1.png"
    }
  },
  {
    id: 2,
    quote: "Through Pharminc, I joined my alumni society and found mentors I definitely wouldn't have connected with otherwise.",
    author: {
      name: "Arjun Patel",
      title: "PG Resident",
      image: "/landing/demo2.png"
    }
  },
  {
    id: 3,
    quote: "Finally, a space where healthcare professionals can find jobs and communities without getting lost in the noise.",
    author: {
      name: "Dr. Meera Sharma",
      title: "MBBS Intern",
      image: "/landing/demo3.png"
    }
  },
  {
    id: 4,
    quote: "Pharminc helped me connect with mentors and peers that helped me through my journey.",
    author: {
      name: "Arjun Patel",
      title: "PG Resident",
      image: "/landing/demo1.png"
    }
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="bg-gray-50 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-11/12 mx-auto">
        <div className="flex flex-col">
          
          <div className="max-w-4xl mb-8 lg:mb-12">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
              >
                &quot;{currentTestimonial.quote}&quot;
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${currentTestimonial.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={currentTestimonial.author.image}
                    alt={currentTestimonial.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900">
                    {currentTestimonial.author.name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {currentTestimonial.author.title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4">
              
              <div className="text-gray-600 font-medium text-sm sm:text-base">
                {String(currentIndex + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  aria-label="Previous testimonial"
                >
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  aria-label="Next testimonial"
                >
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;