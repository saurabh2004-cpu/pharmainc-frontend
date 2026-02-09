import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ShortLogo = () => {
  return (
    <Link href={"/home"}>
      <div className="-translate-y-2 flex-col max-h-3 h-4 w-fit md:h-4 md:w-fit flex items-center justify-start border-gray-200 flex-shrink-0 ml-2 mb-0 pt-4">
          <Image height={50} width={50} src="/short_logo.png" alt="Logo" className="h-8 md:h-10 select-none" />
          <span className='text-xs top-6 right-0 text-gray-800'>Beta</span>
      </div>
    </Link>
  )
}

export default ShortLogo