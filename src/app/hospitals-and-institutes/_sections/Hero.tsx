
'use client'
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const router = useRouter();

    // Smooth the mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const glowX = useSpring(mouseX, springConfig);
    const glowY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        // Calculate position relative to the container
        const x = clientX - left;
        const y = clientY - top;

        mouseX.set(x);
        mouseY.set(y);
    };

    const floatingVariants: Variants = {
        initial: { y: 0 },
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const bgtecTure = '/hospitals-and-institutes/bg-tecture.png'

    return (
        <div
            className="relative w-full overflow-hidden pb-46 md:pb-85 lg:pb-115 "
        >
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                onMouseMove={handleMouseMove}
                className="relative z-10 w-full overflow-hidden bg-[#112F52] mx-auto px-4 sm:px-6 lg:px-8 pt-15 xl:pt-35 pb-30 xl:pb-70"
                style={{
                    backgroundImage: `url(${bgtecTure})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute z-1 inset-0 bg-gradient-to-b from-transparent via-transparent to-[#112F52] pointer-events-none" />

                {/* Animated Glow Overlay */}
                <motion.div
                    className="absolute z-1 pointer-events-none opacity-100 blur-[80px]"
                    style={{
                        background: 'linear-gradient(180deg, #08D5CE 0%, #8DEFA4 100%)',
                        borderRadius: '50%',
                        width: '380px',
                        height: '340px',
                        x: glowX,
                        y: glowY,
                        translateX: '-50%',
                        translateY: '-50%',
                        left: 0,
                        top: 0,
                    }}
                />

                {/* Badge/Tagline */}
                <motion.div variants={itemVariants} className="flex relative -top-5 justify-center mb-8 sm:mb-2">
                    <div className="z-20 bg-white rounded-full px-4 sm:px-18 py-2 sm:py-2.7 shadow-sm inline-flex items-center gap-2">
                        <span className="text-black font-poppins font-medium text-[14px] sm:text-[16px] leading-[1] tracking-normal">
                            Verified Workforce Access
                        </span>
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    variants={itemVariants}
                    className="relative z-40 text-[40px] sm:text-[56px] md:text-[64px] lg:text-[73.22px] text-white text-center tracking-tight mb-6 sm:mb-8"
                    style={{
                        fontFamily: "'Figtree', sans-serif",
                        fontWeight: 800,
                        lineHeight: '120%',
                    }}
                >
                    Ditch Agencies.
                    <br />
                    Hire Directly.
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    variants={itemVariants}
                    className="relative z-30 text-[17px] sm:text-[20px] lg:text-[22.24px] w-full font-poppins font-normal text-white/90 text-center leading-[1.3] sm:leading-[1.4] tracking-normal mb-10 sm:mb-14 max-w-[90%] md:max-w-4xl mx-auto"
                >
                    We’re digitizing healthcare hiring in India.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex z-20 flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/auth/institute?type=signin')}
                        className="w-full z-30 sm:w-auto px-8 sm:px-14 h-[47px] bg-[linear-gradient(93.47deg,_#08D5CE_5.51%,_#8DEFA4_93.19%)] text-white rounded-full font-poppins font-normal text-[16px] sm:text-[18.2px] leading-none tracking-normal flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                    >
                        Post Requirement
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/auth/institute?type=signin')}
                        className="w-full z-30 sm:w-auto px-8 sm:px-14 h-[47px] border-[1.5px] border-white text-white rounded-full font-poppins font-normal text-[16px] sm:text-[18.2px] leading-none tracking-normal hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                        Review Professionals
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* <div className="absolute hidden lg:block z-10 w-[15.38rem] h-[11.44rem] top-115 lg:top-100 lg:right-0 right-5 opacity-100 rotate-15">
                <Image
                    src="/medical-professionals/qna-section-img-2.png"
                    alt="Hero Image"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
            </div> */}
            {/* <div className="absolute hidden lg:block z-10 w-[15.38rem] h-[11.44rem] top-25 lg:top-20 lg:left-0 left-5 opacity-100 -rotate-15">
                <Image
                    src="/medical-professionals/qna-section-img-2.png"
                    alt="Hero Image"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
            </div> */}
        </div>
    );
}