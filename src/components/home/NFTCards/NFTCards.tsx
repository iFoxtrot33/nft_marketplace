'use client'

import { NFTModal } from './NFTModal'
import { NFTSmallCard } from './NFTSmallCard'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  INFINITE_SCROLL_THRESHOLD,
  INTRO_SKELETON_TIMEOUT,
  MODAL_CLOSE_TIMEOUT,
  SKELETON_COUNT,
} from './constants'

import { Skeleton } from '@/ui/Skeleton/Skeleton'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useGetNFTs, useInfiniteScroll } from '@/common'

import { Error } from '@/components'

export const NFTCards = () => {
  const { data, isLoading, error, canLoadMore, loadMore } = useGetNFTs()
  const t = useTranslations('homePage')
  const [selectedNFTAddress, setSelectedNFTAddress] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showIntroSkeleton, setShowIntroSkeleton] = useState(true)

  const triggerRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: canLoadMore,
    threshold: INFINITE_SCROLL_THRESHOLD,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
  })

  useEffect(() => {
    const timerId = setTimeout(() => setShowIntroSkeleton(false), INTRO_SKELETON_TIMEOUT)
    return () => clearTimeout(timerId)
  }, [])

  const handleNFTClick = (nft: { nft_address: string }) => {
    setSelectedNFTAddress(nft.nft_address)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNFTAddress(null), MODAL_CLOSE_TIMEOUT)
  }

  if (error) {
    return <Error />
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4 place-items-center">
          {data.map((nft) => (
            <NFTSmallCard key={nft.id} data={{ address: nft.nft_address }} onClick={() => handleNFTClick(nft)} />
          ))}

          {isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <Skeleton key={`skeleton-${index}`} className="w-[100px] h-[100px] rounded-lg" />
            ))}
        </div>

        {showIntroSkeleton && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-[var(--color-background-black)] rounded-2xl">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        )}
      </div>
      {canLoadMore && <div className="mt-30" ref={triggerRef}></div>}

      {!isLoading && data.length === 0 && !error && (
        <div className="text-center p-8 bg-[var(--color-blue-light)] rounded-lg">
          <p className="text-white">{t('noNFTsFound')}</p>
        </div>
      )}

      <NFTModal isOpen={isModalOpen} onClose={handleCloseModal} nftAddress={selectedNFTAddress} />
    </div>
  )
}
