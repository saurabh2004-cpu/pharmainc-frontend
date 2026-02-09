import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Banner = () => {
  return (
    <section className='rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10'>
        <div className="bg-[#7A3FF5] overflow-hidden relative py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12 rounded-2xl">
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
            
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-8 lg:space-x-12">
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-tight max-w-full sm:max-w-none flex-1'>
                    Join the future of Healthcare
                </h1>

                <Link href={"/auth?type=signup"} className='flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full bg-white text-black font-semibold text-sm sm:text-base md:text-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 min-w-[140px] sm:min-w-[160px] flex-shrink-0'>
                    <span>Get Started</span>
                </Link>
            </div>

        </div>
    </section>
  )
}

export default Banner;