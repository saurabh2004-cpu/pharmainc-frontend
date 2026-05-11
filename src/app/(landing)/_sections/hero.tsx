'use client'

import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, Stethoscope } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

const cardHoverVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const cardImageVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
}

export default function Hero() {
  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden flex flex-col">

      <div className="flex items-center w-full justify-center pt-4 pb-2">
        <Image
          src="/logo.png"
          alt="Logo"
          width={140}
          height={40}
          className="object-contain"
        />
      </div>
      {/* Background Decor Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-white to-cyan-50 -z-20" />
      <div
        className="absolute top-0 right-0 w-[40%] h-[10%] md:w-[20%] md:h-[15%] lg:w-[15%] lg:h-[40%] blur-[80px] md:blur-[140px] opacity-35 pointer-events-none -z-10 rounded-md"
        style={{ background: 'linear-gradient(180deg, #8DEFA4 0%, #08D5CE 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[40%] h-[10%] md:w-[20%] md:h-[15%] lg:w-[15%] lg:h-[40%] blur-[80px] md:blur-[140px] opacity-35 pointer-events-none -z-10 rounded-md"
        style={{ background: 'linear-gradient(180deg, #8DEFA4 0%, #08D5CE 100%)' }}
      />
      <motion.div
        className="flex-1 w-full flex flex-col justify-between py-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            className="text-center mb-1"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Image src="/hero-img/Icon.png" alt="Logo" width={16} height={16} />
              <span className="text-[12px] sm:text-[14px] leading-tight font-medium font-poppins text-cyan-600 tracking-wide uppercase">
                Choose Your Path
              </span>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl  font-[900] font-figtree mb-2 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,_#000000_20%,_#08D5CE_40%,_#8DEFA4_60%,_#08D5CE_80%,_#000000_100%)] bg-[length:200%_auto] animate-gradient-flow inline-block">
              <motion.span
                className="block"
                custom={0}
                variants={textRevealVariants}
              >
                Healthcare Access  Network
              </motion.span>
              {/* <motion.span
                className="block"
                custom={1}
                variants={textRevealVariants}
              >
                Network
              </motion.span> */}
            </h1>

          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-center text-sm md:text-base lg:text-lg leading-relaxed font-normal font-poppins text-[#475467] mb-4 max-w-2xl mx-auto tracking-normal"
            variants={itemVariants}
          >
            Connecting the future of healthcare
          </motion.p>
        </div>

        {/* Cards Section */}
        <motion.div
          className="grid lg:grid-cols-2 gap-4 mb-2 w-full sm:px-6 px-4 flex-1 max-h-[550px]"
          variants={containerVariants}
        >
          {/* Medical Professionals Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-lg"
            variants={cardHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/home-images/left-image-1.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '100%',
              }}
              variants={cardImageVariants}
              initial="initial"
              whileHover="hover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[380px] lg:h-full p-6 sm:p-8 flex flex-col items-center md:items-start justify-end gap-3 text-white text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center ">
                    <Image src="/hero-img/healthcare-2.png" alt="Logo" width={50} height={50} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-[30px] leading-none font-bold font-poppins mb-2 tracking-normal">For Medical Professionals</h2>
                    <p className="text-sm sm:text-base md:text-[20px] leading-[26px] font-normal font-poppins opacity-90 tracking-normal">Your career. Your choice. No middlemen.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className='mt-3'
              >
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={'/medical-professionals'}
                    className="bg-white text-cyan-500 hover:bg-cyan-50 w-full max-w-[281px] h-[47.22px] rounded-[15px] p-[10.11px] gap-[10.11px] font-medium font-poppins text-[18.2px] leading-none tracking-normal shadow-sm"
                  >
                    Explore Opportunities
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hospitals & Institutions Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-lg"
            variants={cardHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/home-images/hospitals-and-institutes.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '100%',
              }}
              variants={cardImageVariants}
              initial="initial"
              whileHover="hover"
            />
            <div className="absolute inset-0 bg-slate-900/40" />

            <div className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[380px] lg:h-full p-6 sm:p-8 flex flex-col items-center md:items-start justify-end gap-3 text-white text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center ">
                    <Image src="/hero-img/healthcare-1.png" alt="Logo" width={40} height={40} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-[30px] leading-none font-bold font-poppins mb-2 tracking-normal">For Hospitals & Institutions</h2>
                    <p className="text-sm sm:text-base md:text-[20px] leading-[26px] font-normal font-poppins opacity-90 tracking-normal">Skip agencies. Hire verified healthcare talent
                      faster.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className='mt-3'
              >
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={'/hospitals-and-institutes'}
                    className="bg-white text-cyan-500 hover:bg-cyan-50 w-full px-6 max-w-[281px] h-[47.22px] rounded-[15px] p-[10.11px] gap-[10.11px] font-medium font-poppins text-[18.2px] leading-none tracking-normal shadow-sm"
                  >
                    Build Your Workforce
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <div className="container mx-auto px-4">
          {/* Trust Section */}
          <motion.div
            className="text-center pb-4"
            variants={itemVariants}
          >
            <p className="text-[#475467] text-xs md:text-[13px] leading-tight font-normal font-sans tracking-normal">
              <span className="font-semibold text-[#101828]">Trusted by 50,000+ healthcare professionals</span> and{' '}
              <span className="font-semibold text-[#101828]">500+ institutions</span> worldwide
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}