'use client'

import { Button } from '@/ui/Button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
import React, { useState } from 'react'
import ConfettiBoom from 'react-confetti-boom'

import { useCart, useDeleteAllItemsInCart } from '@/common'

export const Payment = () => {
  const { cart } = useCart()
  const { deleteAllItemsInCart, isLoading: isClearingCart } = useDeleteAllItemsInCart()
  const cartItemsCount = cart?.nfts?.length || 0
  const hasItems = cartItemsCount > 0
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handlePaymentClick = () => {
    if (hasItems) {
      setIsPaymentModalOpen(true)
    }
  }

  const handleContinueShopping = () => {
    setIsPaymentModalOpen(false)
  }

  const handlePay = async () => {
    setShowConfetti(true)
    setIsPaymentModalOpen(false)
    setTimeout(() => setShowConfetti(false), 3000)

    try {
      await deleteAllItemsInCart()
    } catch (_error) {}
  }

  return (
    <>
      {showConfetti && <ConfettiBoom />}
      <div className="mt-4 mb-4 w-full relative">
        <Button disabled={!hasItems} onClick={handlePaymentClick}>
          Payment
        </Button>

        {hasItems && (
          <div className="absolute -top-1 -right-0 w-6 h-6 bg-[var(--color-purple-light)] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{cartItemsCount}</span>
          </div>
        )}
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-[calc(100%-2rem)] bg-[var(--color-background-black-2)] border-2 border-[var(--color-purple-light)] bottom-0 top-auto left-1/2 translate-x-[-50%] rounded-t-lg rounded-b-none md:top-[50%] md:translate-y-[-50%] md:rounded-lg md:bottom-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-center">You have {cartItemsCount} NFTs in your cart</DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="success" onClick={handleContinueShopping} className="w-full sm:w-auto ">
              Continue Shopping
            </Button>
            <Button variant="primary" onClick={handlePay} disabled={isClearingCart} className="w-full sm:w-auto">
              {isClearingCart ? 'Processing...' : 'Pay Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
