"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Search and find your dream job is now easier than ever. Just browse a job and apply if you need to.",
    author: "Mas Parjono",
    role: "UI Designer at Google",
  },
  {
    quote: "Join a trusted network of healthcare professionals advancing care through collaboration.",
    author: "Aliah Lane",
    role: "Founder, Pharma-c",
  },
  {
    quote: "The platform has transformed how we connect with medical professionals worldwide.",
    author: "Dr. Sarah Mitchell",
    role: "Chief of Surgery at Mayo Clinic",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative z-10 flex-1 flex flex-col justify-center">
      <div className="max-w-xl flex flex-col gap-6">
        {/* Progress Indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="h-1 flex-1 rounded-full bg-gray-300 overflow-hidden"
            >
              <div
                className={`h-full bg-[#3B82F6] transition-all duration-300 ${index === currentIndex ? "w-full" : "w-0"
                  }`}
                style={{
                  animation:
                    index === currentIndex
                      ? "progress 5s linear forwards"
                      : "none",
                }}
              />
            </button>
          ))}
        </div>

        {/* Testimonial Content */}
        <div
          key={currentIndex}
          className="animate-fadeIn"
        >
          <h2 className="text-3xl font-semibold text-white leading-tight mb-6">
            {currentTestimonial.quote}
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                — {currentTestimonial.author}
              </p>
              <p className="text-white text-sm">{currentTestimonial.role}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
