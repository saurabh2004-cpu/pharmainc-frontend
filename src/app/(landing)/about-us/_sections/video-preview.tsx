"use client";

import React, { useState } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa'
import { motion } from 'motion/react'

const VideoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    console.log('Toggle fullscreen')
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8 md:space-y-12 lg:space-y-16">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="self-start max-w-lg"
        >
          <p className="text-[#5D5D5D] text-base md:text-lg leading-relaxed">
            Founded with a simple goal - to make healthcare hiring smarter and more connected.
            Pharminc empowers doctors, nurses, and allied health professionals by bridging them with trusted hospitals and institutions through innovative technology, verified opportunities, and transparent recruitment.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative group self-center w-full max-w-4xl"
        >
          <div 
            className="relative w-full aspect-video bg-gradient-to-br from-[#7A3FF5] to-[#5A2FC7] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-white text-center space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                  <FaPlay className="text-white text-xl md:text-2xl ml-1" />
                </div>
                <p className="text-sm md:text-base font-medium">Healthcare Innovation Preview</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: showControls ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <FaPause className="text-[#7A3FF5] text-xl md:text-2xl lg:text-3xl" />
                  ) : (
                    <FaPlay className="text-[#7A3FF5] text-xl md:text-2xl lg:text-3xl ml-1" />
                  )}
                </motion.button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#7A3FF5] transition-colors duration-200 text-sm md:text-base"
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-[#7A3FF5] transition-colors duration-200 text-sm md:text-base"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  </div>

                  <div className="flex-1 mx-4 md:mx-6">
                    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#7A3FF5] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: isPlaying ? "45%" : "0%" }}
                        transition={{ duration: 2, ease: "linear" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 md:space-x-4">
                    <span className="text-white text-xs md:text-sm font-medium">
                      2:14 / 4:52
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="text-white hover:text-[#7A3FF5] transition-colors duration-200 text-sm md:text-base"
                    >
                      <FaExpand />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="self-end max-w-lg text-right"
        >
          <p className="text-[#5D5D5D] text-base md:text-lg leading-relaxed">
            Our mission is to unite healthcare professionals and institutions on a trusted digital platform that simplifies recruitment, fosters collaboration, and drives career growth.
            We&apos;re building the foundation for India&apos;s next-generation healthcare workforce, one connection at a time.
          </p>
        </motion.div>

      </div>
    </section>
  )
}

export default VideoPreview;