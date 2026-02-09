"use client";
import Image from 'next/image';
import React from 'react';
import { motion } from 'motion/react';

const Info = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-6 lg:px-10 py-5 gap-6 md:gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-2 text-3xl md:text-4xl lg:text-5xl font-semibold"
            >
                Uniting medical talent and opportunity
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-2 text-gray-600 text-sm md:text-base"
            >
                Healthcare deserves its own professional network. Pharminc bridges the gap between skilled medical professionals and the institutions that need them most.
                Whether you&apos;re a doctor looking for the right hospital, a nurse seeking growth, or an HR manager hiring at scale,  Pharminc makes recruitment easy, authentic, and fast.
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-1 lg:col-span-1"
            >
                <div className="flex flex-col relative text-white bg-black p-4 md:p-6 overflow-hidden rounded-2xl h-full min-h-[200px] md:min-h-[250px]">
                    <Image className='absolute inset-0 opacity-50 rotate-[115deg] -right-2/3 -top-1/12' src="/landing/card-bg.png" alt="Card-BG" width={2940} height={1960} />
                        <div className="flex relative z-10 h-full">
            
                            <div className="flex flex-col justify-center">
                                <span className='text-[#1D9BF0] text-4xl md:text-5xl lg:text-6xl font-bold'>10k+</span>
                                <p className='text-xs md:text-sm lg:text-base max-w-96 font-semibold mt-2 md:mt-3 lg:mt-5'>10K+ trusted medical institutions are building credibility and networks on Pharminc.</p>
                            </div>
            
                        </div>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-1 lg:col-span-3 bg-gray-200 rounded-2xl p-4 md:p-6"
            >
                <div className="w-full relative flex justify-center">
                    <div className="flex justify-center w-full">
                        <div className="relative rounded-2xl overflow-hidden bg-gray-900 w-full max-w-full max-h-[300px]">
                            <video 
                                className="w-full max-h-[300px] object-cover"
                                poster="/landing/demo1.png"
                                controls={false}
                                id="info-video"
                            >
                                <source src="/landing/demo-video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            
                            <div className="absolute inset-0 bg-black/40">
                                <div className="text-white p-4 md:p-6">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">How We Work</h3>
                                    <p className="text-sm md:text-base lg:text-lg opacity-90">Pharminc is designed to simplify your professional journey. From verified profiles to specialized communities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                      viewport={{ once: true }}
                      className="absolute bottom-2 md:bottom-4 right-2 md:right-4"
                    >
                        <button 
                            onClick={() => {
                                const video = document.getElementById('info-video') as HTMLVideoElement;
                                if (video.paused) {
                                    video.play();
                                    video.controls = true;
                                }
                            }}
                            className="bg-violet-500 border-2 md:border-4 border-white backdrop-blur-sm hover:bg-violet-600 transition-all duration-200 rounded-full p-2 md:p-3 lg:p-4 group hover:scale-105 active:scale-95"
                            aria-label="Play video"
                        >
                            <svg 
                                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white group-hover:scale-110 transition-transform duration-200" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </section>
  )
}

export default Info;