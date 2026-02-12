"use client";

import Logo from '@/components/logo';
import { useInstitutionStore } from "@/store/institutionStore";
import { useUserStore } from "@/store/userStore";
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { currentUser } = useUserStore();
    const { currentInstitution } = useInstitutionStore();

    const navLinks = [
        { title: "Jobs", href: "/jobs" },
        { title: "Resources", href: "/resources" },
        { title: "About us", href: "/about-us" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
            }`}>
            <div className='relative flex justify-between items-center p-4 md:p-6 w-full'>
                <div className="flex items-center">
                    <div className="flex -translate-y-4">
                        <Logo />
                    </div>

                    <div className="hidden md:flex space-x-4 ml-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className='text-black hover:text-gray-600 font-medium px-3 py-2 rounded-md text-sm flex items-center transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="hidden sm:flex items-center space-x-3">
                        {currentUser ? (
                            <Link href="/home">
                                <button className='px-3 md:px-4 py-2 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'>
                                    Home
                                </button>
                            </Link>
                        ) : currentInstitution ? (
                            <Link href="/dashboard">
                                <button className='px-3 md:px-4 py-2 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'>
                                    Home
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <button className='px-3 md:px-4 py-2 rounded-full outline-1 outline-black font-semibold text-sm transition-all duration-200 hover:bg-black hover:text-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'>
                                        Log In
                                    </button>
                                </Link>
                                <Link href="/auth?type=signup">
                                    <button className='px-3 md:px-4 py-2 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'>
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={toggleMobileMenu}
                        className='md:hidden p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className={`px-4 py-2 border-t border-gray-200 ${isScrolled ? 'bg-white' : 'bg-gray-50'
                    }`}>
                    <div className="flex flex-col space-y-2 mb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className='text-black hover:text-gray-600 font-medium px-3 py-3 rounded-md text-sm transition-all duration-200 hover:bg-white active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300'
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col sm:hidden space-y-3 pb-4">
                        {currentUser ? (
                            <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className='px-4 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full'>
                                    Home
                                </button>
                            </Link>
                        ) : currentInstitution ? (
                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className='px-4 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full'>
                                    Home
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className='px-4 py-3 rounded-full outline-1 outline-black font-semibold text-sm transition-all duration-200 hover:bg-black hover:text-white hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full'>
                                        Log In
                                    </button>
                                </Link>
                                <Link href="/auth?type=signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className='px-4 py-3 rounded-full bg-black text-white font-semibold text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-full'>
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;