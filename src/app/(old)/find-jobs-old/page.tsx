"use client";
import Navbar from "../_components/Navbar";
import HeroSection from "../_components/HeroSection";
import JobList from "../_components/JobList";

const FindJobs = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <HeroSection />
      <JobList />
    </div>
  );
};

export default FindJobs;