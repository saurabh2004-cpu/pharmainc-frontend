import React from 'react'
import Navbar from './_components/navbar'
import Footer from './_sections/footer'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-jakarta">
      {/* <Navbar /> */}
      <div className="pt-10 pb-10 w-full px-0">
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}