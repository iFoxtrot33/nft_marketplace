'use client'

import React from 'react'

import { useAutoRefresh } from '@/common'

import { HeroBanner, NFTCards, Payment } from '@/components'

export const HomePage = () => {
  const refreshId = useAutoRefresh()

  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Payment />
      <NFTCards key={refreshId} />
    </div>
  )
}
