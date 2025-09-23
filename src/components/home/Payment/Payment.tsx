'use client'

import { CONFETTI_TIMEOUT, DEFAULT_CART_ITEMS_COUNT } from './constants'

import { Button } from '@/ui/Button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/Dialog/Dialog'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import ConfettiBoom from 'react-confetti-boom'

import { useCart, useDeleteAllItemsInCart } from '@/common'

export const Payment = () => {
  const t = useTranslations('homePage')
  const { cart } = useCart()
  const { deleteAllItemsInCart, isLoading: isClearingCart } = useDeleteAllItemsInCart()
  const cartItemsCount = cart?.nfts?.length || DEFAULT_CART_ITEMS_COUNT
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
    setTimeout(() => setShowConfetti(false), CONFETTI_TIMEOUT)

    try {
      await deleteAllItemsInCart()
    } catch (_error) {}
  }

  return (
    <>
      {showConfetti && <ConfettiBoom />}
      <div className="mt-4 mb-4 w-full relative">
        {hasItems ? (
          <>
            <Button disabled={!hasItems} onClick={handlePaymentClick}>
              {t('payment.button')}
            </Button>
            <div className="absolute -top-1 -right-0 w-6 h-6 bg-[var(--color-purple-light)] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{cartItemsCount}</span>
            </div>
          </>
        ) : (
          <Button disabled={!hasItems} onClick={handlePaymentClick}>
            <p className="text-gray-400 text-sm">{t('payment.emptyCart')}</p>
          </Button>
        )}
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-[calc(100%-2rem)] bg-[var(--color-background-black-2)] border-2 border-[var(--color-purple-light)] bottom-0 top-auto left-1/2 translate-x-[-50%] rounded-t-lg rounded-b-none md:top-[50%] md:translate-y-[-50%] md:rounded-lg md:bottom-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              {t('payment.modal.title', { count: cartItemsCount })}
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="success" onClick={handleContinueShopping} className="w-full sm:w-auto ">
              {t('payment.modal.continueShopping')}
            </Button>
            <Button variant="primary" onClick={handlePay} disabled={isClearingCart} className="w-full sm:w-auto">
              {isClearingCart ? t('payment.modal.processing') : t('payment.modal.payNow')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
