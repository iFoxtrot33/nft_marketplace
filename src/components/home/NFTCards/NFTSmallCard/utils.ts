import { IMAGE_ATTEMPT_INDEX, MAX_IMAGE_ATTEMPTS } from './constants'

import { TONNFTData } from '@/common'

const toProxy = (url: string) => `/api/image-proxy?url=${encodeURIComponent(url)}`

export const getNFTImageSrc = (nftData: TONNFTData | undefined, failedAttempts: number): string => {
  if (!nftData) return ''

  const order = ['100x100', '500x500', '1500x1500']

  if (failedAttempts <= IMAGE_ATTEMPT_INDEX.THIRD) {
    const resolution = order[failedAttempts]
    const preview = nftData.previews?.find((p) => p.resolution === resolution)
    if (preview?.url) return toProxy(preview.url)
  }

  if (failedAttempts === IMAGE_ATTEMPT_INDEX.ORIGINAL) {
    if (nftData.metadata.image) {
      return toProxy(nftData.metadata.image)
    }
  }

  return ''
}

export const canShowImage = (failedAttempts: number): boolean => {
  return failedAttempts <= MAX_IMAGE_ATTEMPTS
}
