'use client'

import { NFTModal } from './NFTModal'
import { NFTSmallCard } from './NFTSmallCard'
import { INFINITE_SCROLL_ROOT_MARGIN, INFINITE_SCROLL_THRESHOLD } from './constants'

import { Skeleton } from '@/ui/skeleton'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useGetNFTs, useInfiniteScroll } from '@/common'

import { Error } from '@/components'

export const NFTCards = () => {
  const { data, isLoading, error, canLoadMore, loadMore } = useGetNFTs()
  const t = useTranslations('homePage')
  const [selectedNFTAddress, setSelectedNFTAddress] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const triggerRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: canLoadMore,
    threshold: INFINITE_SCROLL_THRESHOLD,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
  })

  const handleNFTClick = (nft: { nft_address: string }) => {
    setSelectedNFTAddress(nft.nft_address)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNFTAddress(null), 750)
  }

  if (error) {
    return <Error />
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
        {data.map((nft) => (
          <NFTSmallCard key={nft.nft_address} data={{ address: nft.nft_address }} onClick={() => handleNFTClick(nft)} />
        ))}

        {isLoading &&
          Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="w-[100px] h-[100px] rounded-lg" />
          ))}
      </div>
      {canLoadMore && <div className=" mt-30" ref={triggerRef}></div>}

      {!isLoading && data.length === 0 && !error && (
        <div className="text-center p-8 bg-[var(--color-blue-light)] rounded-lg">
          <p className="text-white">{t('noNFTsFound')}</p>
        </div>
      )}

      <NFTModal isOpen={isModalOpen} onClose={handleCloseModal} nftAddress={selectedNFTAddress} />
    </div>
  )
}
