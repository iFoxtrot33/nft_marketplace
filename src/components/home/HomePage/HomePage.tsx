'use client'

import { useTonWallet } from '@tonconnect/ui-react'

import { useGetNFTs } from '@/common'

import { HeroBanner, Payment } from '@/components'

export const HomePage = () => {
  const wallet = useTonWallet()
  console.log(wallet)
  const { data } = useGetNFTs()
  console.log(data)
  return (
    <div className="w-full h-full">
      <HeroBanner />

      <Payment />
    </div>
  )
}
