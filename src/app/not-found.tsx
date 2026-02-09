"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/Index/Navbar";
import { Footer } from "@/components/Index/Footer";

export default function NotFound() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20">
        <section className="text-center px-4 max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
              {/* Simple icon for professionalism */}
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2" />
                <path d="M12 8v4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#6b7280" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Feature Not Available</h1>
          <p className="text-gray-600 mb-8">
            We apologize, but this feature or page is not available yet<br />
            Thank you for your understanding as we continue to improve our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home">
              <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
                Return to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
