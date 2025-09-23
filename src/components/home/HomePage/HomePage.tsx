'use client'

import { HeroBanner, NFTCards, Payment } from '@/components'

export const HomePage = () => {
  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Payment />
      <NFTCards />
    </div>
  )
}
