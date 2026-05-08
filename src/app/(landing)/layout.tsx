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
      <div className="  w-full px-0">
        {children}
      </div>
    </div>
  )
}