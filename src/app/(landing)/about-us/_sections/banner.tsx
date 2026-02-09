import Image from 'next/image';
import React from 'react'

const Banner = () => {
  return (
    <section className='rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10 mb-8 mt-20'>
        <div className="bg-[#7A3FF5] overflow-hidden relative py-3 sm:py-4 md:py-5 lg:py-6 px-4 sm:px-6 md:px-8 lg:px-12 rounded-2xl">
            <div 
                className="absolute top-0 left-0 pointer-events-none h-full w-full"
                style={{
                    backgroundImage: 'url(/landing/bg-noise.png)',
                    backgroundRepeat: 'repeat',
                    opacity: 0.05,
                    zIndex: 0
                }}
            />

            <Image 
                className='z-10 absolute inset-0 opacity-20 rotate-[115deg] -right-1/2 sm:-right-2/3 md:-right-2/3 -top-1/12 scale-150 sm:scale-125 md:scale-100' 
                src="/landing/card-bg.png" 
                alt="Card-BG" 
                width={2940} 
                height={1960} 
            /> 
            
            <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="inline-block">
                    <span className='text-white/80 text-sm sm:text-base font-medium uppercase tracking-widest mb-4 block'>
                        ABOUT US
                    </span>
                </div>

                <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl'>
                    About Our Company
                </h1>

                <p className='text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl font-light'>
                    A team of innovators and healthcare advocates reimagining how medical professionals and institutions connect in India.
                </p>
            </div>

        </div>
    </section>
  )
}

export default Banner;