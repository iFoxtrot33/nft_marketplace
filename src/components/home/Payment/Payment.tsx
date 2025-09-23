import { Button } from '@/ui/Button'
import React from 'react'

import { useCart } from '@/common'

export const Payment = () => {
  const { cart } = useCart()
  const cartItemsCount = cart?.nfts?.length || 0
  const hasItems = cartItemsCount > 0

  return (
    <div className="mt-4 mb-4 w-full relative">
      <Button disabled={!hasItems}>Payment</Button>

      {hasItems && (
        <div className="absolute -top-1 -right-0 w-6 h-6 bg-[var(--color-purple-light)] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{cartItemsCount}</span>
        </div>
      )}
    </div>
  )
}
