'use client'
import { useState, useEffect } from "react";
import { TestimonialCarousel, testimonials } from "./TestimonialCarousel";
import Image from "next/image";

export function SidePanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Same interval as progress bars

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="hidden lg:flex h-full animated-gradient flex-col justify-between p-12 relative overflow-hidden">
      <style>{`
        .animated-gradient {
          background: linear-gradient(135deg, #233F64, #169BA4, #4ADAAF, #0AD4CE);
          background-size: 400% 400%;
          animation: ocean-wave 12s ease infinite;
        }

        @keyframes ocean-wave {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
      <TestimonialCarousel currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

      <div className="relative z-10 flex justify-center items-end translate-y-8 w-full max-w-7xl xl:max-w-7xl 2xl:max-w-[150rem] mx-auto px-2">
        <div className="relative w-full">
          {/* Symmetrical Frame */}
          <div className="relative bg-slate-900 rounded-xl p-[6px] border border-white/10 shadow-2xl overflow-hidden">
            {/* Webcam / Camera Dot */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-800 rounded-full border border-white/5 flex items-center justify-center z-20">
              <div className="w-0.5 h-0.5 bg-blue-500/20 rounded-full"></div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-inner 2xl:rounded-2xl">
              <Image
                key={currentIndex}
                src={testimonials[currentIndex].image}
                alt="PharmInc Platform Preview"
                fill
                sizes="
                  (min-width: 1536px) 896px,
                  (min-width: 1280px) 672px,
                  (min-width: 1024px) 576px,
                  100vw
                "
                className="object-cover-cover animate-imageFade"
                priority
              />
            </div>
          </div>

          {/* Floor Shadow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black/30 blur-2xl rounded-full -z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes imageFade {
          from { opacity: 0.8; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-imageFade {
          animation: imageFade 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
