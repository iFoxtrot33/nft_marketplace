'use client'

import { useTonWallet } from '@tonconnect/ui-react'

import { HeroBanner, Payment } from '@/components'

export const HomePage = () => {
  const wallet = useTonWallet()
  console.log(wallet)
  return (
    <div className="w-full h-full">
      <HeroBanner />

      <Payment />
    </div>
  )
}
