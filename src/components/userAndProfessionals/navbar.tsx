'use client'

import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEntityStore } from '@/store/entityStore';
import { EntityType } from '@/lib/api/types';

const navVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const mobileMenuVariants: Variants = {
    closed: { opacity: 0, x: '100%' },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        opacity: 0,
        x: '100%',
        transition: {
            duration: 0.2
        }
    }
};

const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Resources', href: '#' },
];

export default function Navbar({ bg }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { entity, entityType } = useEntityStore();
    
    const ishospitalsAndInstitutePage = pathname?.toLowerCase() === '/hospitals-and-institutes';
    const isLoggedIn = !!entity;
    const homeHref = entityType === EntityType.INSTITUTE ? '/dashboard' : '/find-jobs';

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className=" left-0 w-full z-50 sticky top-0 "
        >
            <div className={`h-[70px] ${ishospitalsAndInstitutePage ? 'pt-0 xl:' : 'pt-8 pb-8'}   px-6 md:px-16 xl:py-12  mx-auto ${bg} flex items-center justify-between  `}>
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Image
                        src={`${ishospitalsAndInstitutePage ? '/logo.png' : '/logo.png'}`}
                        alt="Logo"
                        width={140}
                        height={140}
                        className=" rounded-full  "
                    />
                </div>

                {/* Desktop Login/Signup Buttons */}
                <div className='hidden lg:flex h-[47px] items-center justify-center gap-4' >
                    <nav className="flex items-center gap-14 mr-4">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`${index === 0 ? (ishospitalsAndInstitutePage ? 'text-black underline underline-offset-8' : 'text-white underline underline-offset-8') : (ishospitalsAndInstitutePage ? 'text-black/70' : 'text-white/70')} font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:text-black' : 'hover:text-white'} transition-colors`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {isLoggedIn ? (
                        <Link href={homeHref}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-8 h-[37px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                            >
                                Home
                            </motion.button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/auth?type=signin">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 h-[37px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link href="/auth?type=signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-8 h-[37px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                                >
                                    Sign Up
                                </motion.button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button - Only visible on small/medium screens */}
                <button
                    onClick={toggleMenu}
                    className={`lg:hidden p-2 ${ishospitalsAndInstitutePage ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'} transition-colors`}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="exit"
                        variants={mobileMenuVariants}
                        className="fixed top-0 right-0 h-screen w-2/3 bg-[#097083] shadow-2xl z-[60] flex flex-col p-8 backdrop-blur-md"
                    >
                        <div className="flex justify-end mb-12">
                            <button onClick={toggleMenu} className="text-white hover:text-white/80">
                                <X size={32} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-8 mb-12">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`${index === 0 ? (ishospitalsAndInstitutePage ? 'text-white underline underline-offset-8' : 'text-white underline underline-offset-8') : (ishospitalsAndInstitutePage ? 'text-white/80' : 'text-white/80')} font-poppins text-xl`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex flex-col gap-4">
                            {isLoggedIn ? (
                                <Link href={homeHref} onClick={() => setIsOpen(false)}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-full h-[47px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                                    >
                                        Home
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth?type=signin" onClick={() => setIsOpen(false)}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-full h-[47px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                                        >
                                            Login
                                        </motion.button>
                                    </Link>
                                    <Link href="/auth?type=signup" onClick={() => setIsOpen(false)}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-full h-[47px] ${ishospitalsAndInstitutePage ? 'bg-[#233F64] text-white' : 'bg-[#FFFFFF2B] backdrop-blur-[6px] text-white'} rounded-full flex items-center justify-center font-poppins font-normal text-[18px] leading-none tracking-normal ${ishospitalsAndInstitutePage ? 'hover:opacity-90' : 'hover:bg-white/25'} transition-all shadow-lg ${ishospitalsAndInstitutePage ? '' : 'border-t border-l border-white/50 border-b border-r border-white/10'}`}
                                        >
                                            Sign Up
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Background Fade when menu is open */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-[2px] md:hidden"
                    />
                )}
            </AnimatePresence>
        </motion.header>
    );
}

