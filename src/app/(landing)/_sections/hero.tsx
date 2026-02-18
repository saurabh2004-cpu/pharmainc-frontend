"use client";

import Image from 'next/image';
import React from 'react'
import { FaArrowRight } from 'react-icons/fa';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import AnimatedText from '@/components/AnimatedText';
import Link from 'next/link';

const Hero = () => {
  const count = useMotionValue(100);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    const controls = animate(count, 500, {
      duration: 2,
      delay: 1,
      ease: "easeOut"
    });

    return controls.stop;
  }, [count]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between p-4 md:p-6 lg:p-10 gap-8 lg:gap-12 min-h-screen pt-20 lg:pt-10">

      <div className="flex flex-col space-y-4 md:space-y-6 w-full lg:w-1/2 order-2 lg:order-1">
        <div className="flex flex-col text-[#010205] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold space-y-2 md:space-y-3">
          <h1>
            <AnimatedText text="Building the future" delay={0} />
          </h1>
          <h1>
            <AnimatedText text="of healthcare" delay={0.4} />
          </h1>
          <h1>
            <AnimatedText text="careers." delay={0.8} />
          </h1>
        </div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className='text-[#5D5D5D] max-w-md text-sm md:text-base'
        >
          Hire faster. Find better opportunities.
          Pharminc makes medical hiring simpler, transparent, and data-driven.
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
        >
          {/* <Link href={"/auth?type=signup"} className='flex items-center space-x-3 md:space-x-8 px-4 md:px-6 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-white hover:text-black hover:outline-1 hover:outline-black hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-fit'>
                    <span>Join Pharminc Today</span>
                    <FaArrowRight />
                </Link> */}
          <a
            href="mailto:contact@pharminc.in"
            className="flex items-center space-x-3 md:space-x-8 px-4 md:px-6 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-white hover:text-black hover:outline-1 hover:outline-black hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-fit"
          >
            <span>Join Pharminc Today</span>
            <FaArrowRight />
          </a>


          <button className='font-semibold text-sm text-black underline transition-all duration-200 hover:text-gray-600 active:scale-95 focus:outline-none w-fit'>
            <span>See How it Works</span>
          </button>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="flex flex-col sm:flex-row sm:items-center mt-6 md:mt-8 space-y-4 sm:space-y-0"
        >
          <span className='text-xs font-semibold w-full sm:w-40'>Trusted by the world&apos;s biggest institutions</span>
          <div className="flex items-center space-x-2 sm:ml-4">
            <Image className='h-12 md:h-16 w-auto' src='/landing/aims-logo.png' alt='AIMS-1' width={1250} height={834} />
            <Image className='h-12 md:h-16 w-auto' src='/landing/aims-logo.png' alt='AIMS-2' width={1250} height={834} />
          </div>
        </motion.div>
      </div>


      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-col w-full lg:w-1/2 order-1 lg:order-2"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="col-span-1 order-1">
            <Image className='h-full w-full object-cover rounded-lg' src='/landing/hero-1.png' alt='Hero 1' width={376} height={379} />
          </div>
          <div className="col-span-1 self-end order-3 md:order-2">
            <div className="flex flex-col space-y-3 md:space-y-4 justify-end bg-[#F0F0F0] p-4 md:p-6 rounded-2xl w-full">
              <span className='text-4xl md:text-5xl lg:text-7xl font-bold'>
                <motion.span>{rounded}</motion.span>K+
              </span>
              <span className='text-[#5C5D5F] text-sm md:text-base'>healthcare professionals are already on Pharminc. </span>

              <div className="flex space-x-2">
                <Image className='size-12 md:size-16 lg:size-20 rounded-full border border-white' src="/landing/demo1.png" alt="Demo Person 1" width={1024} height={1024} />
                <Image className='size-12 md:size-16 lg:size-20 rounded-full border border-white' src="/landing/demo2.png" alt="Demo Person 2" width={1024} height={1024} />
                <Image className='size-12 md:size-16 lg:size-20 rounded-full border border-white' src="/landing/demo3.png" alt="Demo Person 3" width={1024} height={1024} />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 order-2 md:order-3">
            <div className="flex flex-col relative text-white bg-black p-4 md:p-6 overflow-hidden rounded-2xl">
              <Image className='absolute inset-0 opacity-50 rotate-[115deg] -left-1/3 -top-1/3' src="/landing/card-bg.png" alt="Card-BG" width={2940} height={1960} />
              <div className="flex relative z-10">

                <div className="flex flex-col">
                  <span className='text-sm md:text-base'>Trust & Reach Focused</span>
                  <p className='text-lg md:text-xl max-w-96 font-semibold mt-3 md:mt-5'>Pharminc connects doctors, nurses, and healthcare professionals with verified hospitals, clinics, and recruiters - all in one trusted platform.</p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </motion.div>

    </div>
  )
}

export default Hero;