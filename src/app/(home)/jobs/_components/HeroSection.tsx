"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Briefcase } from "lucide-react";

const filters = [
  { name: "Location", placeholder: "All locations", icon: MapPin },
  { name: "Experience", placeholder: "Any experience", icon: Clock },
  { name: "Job Type", placeholder: "All job types", icon: Briefcase },
];

const HeroSection = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-sans">
          Find Your Perfect Healthcare Job
        </h2>
        <p className="text-base md:text-lg text-gray-600">
          Connect with top institutions offering roles for doctors, nurses, and more.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
              placeholder="Search by specialty, city (e.g., Mumbai)"
            />
          </div>

          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <div key={filter.name} className="relative lg:w-44">
                <IconComponent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder={filter.placeholder}
                  aria-label={filter.name}
                />
              </div>
            );
          })}

          <Button className="h-12 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm text-white px-8 lg:px-6">
            Search Jobs
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600 mr-2">Popular:</span>
          {['Doctor', 'Nurse', 'Pharmacist', 'Mumbai', 'Delhi', 'Remote'].map((tag) => (
            <button
              key={tag}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
