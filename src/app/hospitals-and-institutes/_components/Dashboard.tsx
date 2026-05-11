'use client'
import Image from "next/image"
import { motion } from "framer-motion"


const Dashboard = () => {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="z-30 w-full absolute top-150 sm:top-140  xl:top-180 flex justify-center pointer-events-none">
            <Image
                src="/hospitals-and-institutes/dashboard-3.png"
                alt="Dashboard Mockup"
                width={1920}
                height={1080} 
                className="w-full max-w-[20rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[70rem] rounded-2xl  object-cover"
            />
        </motion.div>
    )
}

export default Dashboard
