'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ footerHeading, footerSubHeading, FooterButtonText }: { footerHeading: string, footerSubHeading: string, FooterButtonText: string }) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const footerLinks = [
        {
            title: 'Useful Links',
            links: [
                { name: 'Contact Us', href: '#' },
                { name: 'Disclaimer', href: '#' },
                { name: 'End User license Agreement', href: '#' },
            ],
        },
        {
            title: 'Quick Links',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Disclaimer', href: '#' },
                { name: 'Work with us', href: '#' },
                { name: 'Refer & Earn', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'Contact Us', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Blog', href: '#' },
            ],
        },
    ];

    return (
        <footer className="w-full">
            {/* CTA Section with Overlap */}
            <div className="relative">
                {/* Background Split */}
                <div className="absolute inset-0 top-0 h-1/2 bg-white" />
                <div className="absolute inset-0 top-1/2 bottom-0 bg-black" />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="relative z-10 px-4 sm:px-8  lg:py-16"
                >
                    <motion.div
                        variants={itemVariants}
                        className="relative max-w-6xl mx-auto animate-gradient-flow rounded-[2rem] sm:rounded-[3rem] px-6 sm:px-12 py-12 sm:py-20 text-center overflow-hidden shadow-2xl"
                        style={{
                            background: 'linear-gradient(90deg, #80EDA9 0%, #26DBC5 50%, #80EDA9 100%)',
                            backgroundSize: '200% auto',
                        }}
                    >
                        {/* Decorative Large Ring */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="absolute -top-16 -left-16 w-32 h-32 sm:w-48 sm:h-48 border-[12px] sm:border-[16px] border-white rounded-full opacity-30 sm:opacity-100"
                        ></motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="relative text-gray-900 mb-4 sm:mb-6 font-['Figtree'] font-semibold text-[1.75rem] sm:text-[2.25rem] md:text-[39.63px] leading-[118%] text-center"
                        >
                            {footerHeading}
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="relative text-gray-800 mb-8 max-w-3xl mx-auto font-['Poppins'] font-normal text-sm sm:text-[16px] leading-[130%] text-center px-2"
                        >
                            {footerSubHeading}
                        </motion.p>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full transition hover:opacity-90 font-['Poppins'] font-normal text-[16px] leading-[100%] bg-[#233F64]"
                        >
                            {FooterButtonText}
                            <ArrowUpRight size={20} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer Content */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="px-4 sm:px-8 pt-12 bg-black sm:pt-16 border-t border-gray-800 "
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 md:gap-8 mb-8">
                        {/* Useful Links */}
                        <motion.div variants={itemVariants} >
                            <h3 className="text-white mb-4 sm:mb-6 font-['Poppins'] font-bold text-[15px] leading-[100%]">
                                Useful Links
                            </h3>
                            <ul className="space-y-2 sm:space-y-3 ">
                                {footerLinks[0].links.map((link) => (
                                    <li key={link.name} >
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-[#06b6d4] transition font-['Poppins'] font-normal text-[15px] leading-[100%]"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div variants={itemVariants}>
                            <h3
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    lineHeight: '100%',
                                }}
                                className="text-white mb-4 sm:mb-6"
                            >
                                Quick Links
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks[1].links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-[#06b6d4] transition font-['Poppins'] font-normal text-[15px] leading-[100%]"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Support */}
                        <motion.div variants={itemVariants}>
                            <h3
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    lineHeight: '100%',
                                }}
                                className="text-white mb-4 sm:mb-6"
                            >
                                Support
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks[2].links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-[#06b6d4] transition font-['Poppins'] font-normal text-[15px] leading-[100%]"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact Us */}
                        <motion.div variants={itemVariants}>
                            <h3
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    lineHeight: '100%',
                                }}
                                className="text-white mb-4 sm:mb-6"
                            >
                                Contact Us
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                                <li>
                                    <a
                                        href="mailto:support@gmail.com"
                                        className="text-gray-300 hover:text-[#06b6d4] transition break-all font-['Poppins'] font-normal text-[15px] leading-[100%]"
                                    >
                                        support@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <p className="text-gray-300 font-['Poppins'] font-normal text-[15px] leading-[100%]">
                                        123 Street wellness city,Indonesia
                                    </p>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Separator Line */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full h-[1px] mb-6 bg-gradient-to-r from-[#08D5CE] to-[#8DEFA4]"
                    />

                    <div
                        className="flex flex-col sm:flex-row sm:justify-end justify-center items-center h-full text-white bg-black "
                    >
                        <p className="font-['Poppins'] font-normal text-[15px] leading-[100%] mb-4 ">
                            @2026 job portal.All rights reserved
                        </p>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}