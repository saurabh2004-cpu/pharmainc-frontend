"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useEntity } from '@/hooks/useEntity'

const Logo = () => {

  const path = usePathname();
  const { isInstitute } = useEntity();

  // Determine redirect path based on entity type
  const getRedirectPath = () => {
    // If on landing pages, always go to '/'
    if (path === "/" || path === "/about-us") {
      return '/';
    }
    // If institution, go to dashboard, otherwise go to home
    return isInstitute ? '/dashboard' : '/home';
  };

  return (
    <Link href={getRedirectPath()} className="flex items-center">
      <div className="translate-y-2 max-h-3 h-4 w-fit md:h-4 md:w-fit flex items-center justify-start border-gray-200 flex-shrink-0 ml-2 mb-0 pt-4 relative">
        <Image height={30} width={120} src="/logo.png" alt="Logo" className="h-8 md:h-10 select-none" />
        <span className='text-xs absolute top-6 right-0 text-gray-800'>Beta</span>
      </div>
    </Link>
  )
}

export default Logo