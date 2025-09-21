import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export const AuthLoader = () => {
  const t = useTranslations('authPage')

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 relative z-10">
          <Image
            src="/logo.svg"
            alt="NFT TON Marketplace Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />

          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 animate-spin"
            style={{ animationDuration: '2s' }}
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-light rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      <h1 className="text-white text-xl font-semibold text-center whitespace-pre-line">{t('nftMarketplace')}</h1>
    </div>
  )
}
