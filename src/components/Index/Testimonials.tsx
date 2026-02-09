"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Arjun Mehta",
    role: "Cardiothoracic Surgeon",
    hospital: "Cleveland Clinic",
    quote:
      "This platform helped me discover collaboration opportunities globally. I've connected with specialists I never would have met otherwise.",
    stars: 5,
  },
  {
    name: "Dr. Maria Gonzalez",
    role: "Pediatric Neurologist",
    hospital: "Boston Children's Hospital",
    quote:
      "The research sharing functionality has transformed how I stay current with developments in my field. Essential for any medical professional.",
    stars: 5,
  },
  {
    name: "Dr. David Choi",
    role: "Emergency Medicine",
    hospital: "Johns Hopkins",
    quote:
      "The case discussions have been invaluable. I've improved my diagnostic approach through feedback from colleagues around the world.",
    stars: 4,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Trusted by Physicians Worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See why thousands of medical professionals rely on our platform to
            build their networks
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 flex">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <Star
                    key={i + testimonial.stars}
                    className="w-5 h-5 text-gray-300"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-medical-light-teal mr-4 flex items-center justify-center">
                  <span className="text-medical-teal font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">
                    {testimonial.hospital}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
