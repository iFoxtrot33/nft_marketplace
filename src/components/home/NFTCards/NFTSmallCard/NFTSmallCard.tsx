'use client'

import { MAX_IMAGE_ATTEMPTS } from './constants'
import { INFTSmallCardProps } from './types'
import { canShowImage, getNFTImageSrc } from './utils'

import { Skeleton } from '@/ui/Skeleton/Skeleton'
import Image from 'next/image'
import { useState } from 'react'

import { useCart, useGetNFT } from '@/common'

export const NFTSmallCard: React.FC<INFTSmallCardProps> = ({ data, onClick }) => {
  const { data: nftData, isLoading, error } = useGetNFT({ address: data.address })
  const { cart } = useCart()
  const [failedAttempts, setFailedAttempts] = useState(0)

  const imageSrc = getNFTImageSrc(nftData, failedAttempts)
  const shouldShowImage = canShowImage(failedAttempts)
  const hasImageFailed = failedAttempts >= MAX_IMAGE_ATTEMPTS
  const isInCart = cart?.nfts?.includes(data.address) || false

  if (isLoading) {
    return <Skeleton className={`w-[100px] h-[100px] rounded-lg`} />
  }

  if (error || !nftData) {
    return null
  }

  if (hasImageFailed) {
    return null
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-[100px] 
        h-[100px] 
        p-0 
        bg-transparent 
        cursor-pointer 
        overflow-hidden 
        rounded-lg 
        transition-transform 
        duration-200 
        hover:scale-105 
        focus:outline-none 
        focus:ring-2 
        focus:ring-ring 
        focus:ring-offset-2
        border-2
        border-[var(--color-background-black)]
        ring-2
        ring-[var(--color-purple-light)]
        ring-inset
        relative
      `}
      type="button"
    >
      {imageSrc && shouldShowImage && (
        <Image
          src={imageSrc}
          alt={nftData.metadata.name || 'NFT'}
          width={96}
          height={96}
          className="w-full h-full object-cover rounded-lg p-1"
          onError={() => setFailedAttempts((prev) => prev + 1)}
        />
      )}

      {isInCart && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-[var(--color-green-dark)] rounded-full flex items-center justify-center">
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M8.5 1L3.5 6L1.5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
