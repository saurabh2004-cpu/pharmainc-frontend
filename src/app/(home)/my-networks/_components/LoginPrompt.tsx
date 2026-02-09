import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import Link from 'next/link'

export const LoginPrompt = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto pt-24 px-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 font-sans">Connect with professionals</h1>
          <p className="text-gray-600 text-lg font-sans">Sign up to view your networks</p>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Join PharmInc today</h2>
                <p className="text-gray-600 font-sans">Connect with healthcare professionals and expand your network</p>
              </div>

              <div className="flex justify-center">
                <Link href="/auth?type=signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 text-base font-sans">
                    Join now
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-500 font-sans">Already have an account?</span>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="border-2 border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors duration-200 text-base font-sans"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 font-sans">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-blue-500 hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-500 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
