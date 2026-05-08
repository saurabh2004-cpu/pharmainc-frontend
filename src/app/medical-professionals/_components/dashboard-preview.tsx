'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function DashboardPreview() {
    return (
        <section className="bg-[#c6f7dd]  px-8 lg:pt-18 lg:pt-0">
            <div className=" mx-auto flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-5xl md:-mt-55 lg:-mt-80 -mt-20 md:-mt-30 z-10"
                >
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                        }}
                        // transition={{
                        //     duration: 5,
                        //     repeat: Infinity,
                        //     ease: "easeInOut",
                        // }}
                        className="relative rounded-2xl overflow-hidden"
                    >
                        <Image
                            src="/medical-professionals/job-listing.png"
                            alt="Pharminc Dashboard Preview"
                            className="w-full h-auto block"
                            width={1200}
                            height={800}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
