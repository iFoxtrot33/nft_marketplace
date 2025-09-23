'use client'

import { MAX_IMAGE_ATTEMPTS } from './constants'
import { INFTSmallCardProps } from './types'
import { canShowImage, getNFTImageSrc } from './utils'

import { Skeleton } from '@/ui/skeleton'
import Image from 'next/image'
import { useState } from 'react'

import { useGetNFT } from '@/common'

export const NFTSmallCard: React.FC<INFTSmallCardProps> = ({ data, onClick }) => {
  const { data: nftData, isLoading, error } = useGetNFT({ address: data.address })
  const [failedAttempts, setFailedAttempts] = useState(0)

  const imageSrc = getNFTImageSrc(nftData, failedAttempts)
  const shouldShowImage = canShowImage(failedAttempts)
  const hasImageFailed = failedAttempts >= MAX_IMAGE_ATTEMPTS

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
    </button>
  )
}
