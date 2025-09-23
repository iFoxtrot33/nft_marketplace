'use client'

import { NEXT_ATTEMPT_DELAY, TRANSITION_DURATION } from './constants'
import { INFTModalProps } from './types'
import { buildProxiedCandidateUrls, getImageUrlByIndex, scheduleNextAttempt } from './utils'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Skeleton } from '@/ui/skeleton'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { toFriendlyAddress, useGetNFT } from '@/common'

export const NFTModal: React.FC<INFTModalProps> = ({ isOpen, onClose, nftAddress }) => {
  const t = useTranslations('homePage')
  const { data: nftData, isLoading } = useGetNFT({ address: nftAddress || '' })
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const candidateUrls = useMemo(() => buildProxiedCandidateUrls(nftData), [nftData])

  const getImageUrl = () => getImageUrlByIndex(candidateUrls, currentImageIndex)

  useEffect(() => {
    if (!isOpen) return
    setImageLoading(true)
    setImageError(false)
    setCurrentImageIndex(0)
  }, [isOpen, nftAddress, candidateUrls.join('|')])

  const handleImageError = () => {
    const lastIndex = Math.max(candidateUrls.length - 1, 0)
    if (currentImageIndex < lastIndex) {
      setImageLoading(true)
      scheduleNextAttempt(currentImageIndex, setCurrentImageIndex, NEXT_ATTEMPT_DELAY)
    } else {
      setImageLoading(false)
      setImageError(true)
    }
  }

  if (!nftData || isLoading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-2rem)] max-h-[80vh] overflow-y-auto bg-[var(--color-background-black-2)] border-2 border-[var(--color-purple-light)] bottom-0 top-auto left-1/2 translate-x-[-50%] rounded-t-lg rounded-b-none md:top-[50%] md:translate-y-[-50%] md:rounded-lg md:bottom-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-white">{t('nftModalTitle')}</DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          {/* Image */}
          <div className="flex justify-center relative">
            {imageLoading && <Skeleton className="w-[300px] h-[300px] rounded-lg" />}
            {!imageError ? (
              <Image
                key={currentImageIndex}
                src={getImageUrl()}
                alt={nftData.metadata.name || 'NFT'}
                width={300}
                height={300}
                className={`rounded-lg object-cover ${imageLoading ? 'absolute opacity-0' : 'opacity-100'} transition-opacity duration-${TRANSITION_DURATION}`}
                onLoad={() => setImageLoading(false)}
                onError={handleImageError}
              />
            ) : (
              <div className="w-[300px] h-[300px] rounded-lg bg-gray-400 flex items-center justify-center p-4 text-center">
                <p className="text-white text-sm">{t('emptyStock')}</p>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <h3 className="font-semibold text-[var(--color-mountain-dew-2)]">{t('nftName')}</h3>
            <p className="text-white">{nftData.metadata.name || 'N/A'}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-[var(--color-mountain-dew-2)]">{t('nftDescription')}</h3>
            <p className="text-white">{nftData.metadata.description || 'N/A'}</p>
          </div>

          {/* NFT Address */}
          <div>
            <h3 className="font-semibold text-[var(--color-mountain-dew-2)]	">{t('nftRawAddress')}</h3>
            <p className="text-white break-all text-sm">{nftData.address || 'N/A'}</p>
          </div>

          {/* NFT Friendly Address */}
          <div>
            <h3 className="font-semibold text-[var(--color-mountain-dew-2)]">{t('nftFriendlyAddress')}</h3>
            <p className="text-white break-all text-sm">{toFriendlyAddress(nftData.address)}</p>
          </div>

          {/* Owner Address */}
          <div>
            <h3 className="font-semibold text-[var(--color-mountain-dew-2)]">{t('ownerAddress')}</h3>
            <p className="text-white break-all text-sm">{nftData.owner?.address || 'N/A'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
