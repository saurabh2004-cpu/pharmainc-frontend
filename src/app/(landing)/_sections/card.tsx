"use client";
import Image from 'next/image';
import React from 'react'
import { motion } from 'motion/react';

const Card = () => {
  return (
    <section className='rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10'>
        <div className="bg-[#7A3FF5] overflow-hidden relative py-8 sm:py-10 lg:py-12 px-4 sm:px-5 md:px-6 lg:px-8 rounded-2xl flex flex-col items-center justify-center">
            <div 
                className="absolute top-0 left-0 pointer-events-none h-full w-full"
                style={{
                    backgroundImage: 'url(/landing/bg-noise.png)',
                    backgroundRepeat: 'repeat',
                    opacity: 0.05,
                    zIndex: 0
                }}
            />
            <Image className='z-10 absolute inset-0 opacity-20 rotate-[115deg] -right-2/3 -top-1/12' src="/landing/card-bg.png" alt="Card-BG" width={2940} height={1960} /> 
            <h1 className='z-20 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center max-w-full sm:max-w-5/6 md:max-w-4/5 lg:max-w-3/4'>
                How Pharminc makes a difference
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8 z-20 justify-center">
                {

                    ["All Work","Institution Engagement","Pharma","HCP"].map((v,_)=>(
                        <motion.button 
                            key={_}
                            className="border-2 border-white text-white bg-transparent px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-[#7A3FF5] hover:border-transparent focus:bg-[#7A3FF5] focus:border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7A3FF5]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {v}
                        </motion.button>
                    ))

                }
            </div>


            <div className="flex overflow-x-auto z-20 w-full mt-8 sm:mt-10 gap-4 pb-4">

                {/* <div className="rounded-full bg-gray-100/20 p-2 flex-shrink-0">
                    <div className="flex bg-gray-300 rounded-full w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[300px] xl:h-[300px] relative">
                        <div className="flex items-center justify-center bg-[#7A3FF5] w-2/5 h-2/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full absolute">
                            <span className='text-white text-xs sm:text-sm'>See details</span>
                        </div>
                    </div>
                </div> */}


                {
                    [
                        {
                            title: "Case Study: Student Engagement",
                            description: "How Pharminc helped 5,000+ MBBS students access internships and mentorship opportunities across India."
                        },
                        {
                            title: "Case Study: Institutional Growth", 
                            description: "How a leading medical college used Pharminc to build verified alumni networks and attract new talent."
                        },
                        {
                            title: "Case Study: Professional Collaboration",
                            description: "Doctors from different specialties collaborating through Pharminc communities to share knowledge and best practices."
                        },
                        {
                            title: "Empowering Healthcare Network",
                            description: "Enabling collaboration between specialists across different cities through our verified platform."
                        }
                    ].map((item,_)=>(
                        <div key={_} className="rounded-3xl bg-gray-100/20 p-2 text-white flex-shrink-0">
                            <div className="flex flex-col px-4 py-4 justify-between bg-gray-300 rounded-3xl w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[300px] xl:h-[300px] relative">
                                <span className="text-sm sm:text-base font-semibold text-gray-800">{item.title}</span>
                                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item.description}</span>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    </section>
  )
}

export default Card;