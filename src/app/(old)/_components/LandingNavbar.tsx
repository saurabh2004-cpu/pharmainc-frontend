"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useUserStore } from '@/store/userStore';

const LandingNavbar = () => {
  const { currentUser } = useUserStore();

  return (
    <motion.header 
      className="fixed w-full top-0 z-50 bg-white/95 border-b border-gray-100 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-18 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="PharmInc Logo"
              className="h-10 w-auto rounded-md"
            />
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Jobs</Link>
          <Link href="/research" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Research</Link>
          <Link href="/societies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Societies</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link href="/home">
              <Button className="bg-blue-700 hover:bg-blue-700 text-white">
                Home
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-white-700">
                  Log In
                </Button>
              </Link>
              <Link href="/signup?type=signup">
                <Button className="bg-blue-700 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default LandingNavbar;
