import { MAX_INDEX_OFFSET, MIN_INDEX } from './constants'

import { TONNFTData } from '@/common/types'

export const buildCandidateUrls = (nftData: TONNFTData | null | undefined): string[] => {
  if (!nftData) return []

  const urls: string[] = []

  const res1500 = nftData.previews?.find((p) => p.resolution === '1500x1500')?.url
  if (res1500) urls.push(res1500)

  const res500 = nftData.previews?.find((p) => p.resolution === '500x500')?.url
  if (res500) urls.push(res500)

  if (nftData.metadata?.image) urls.push(nftData.metadata.image)

  const res100 = nftData.previews?.find((p) => p.resolution === '100x100')?.url
  if (res100) urls.push(res100)

  return Array.from(new Set(urls))
}

export const getImageUrlByIndex = (candidates: string[], index: number): string => {
  if (!candidates || candidates.length === 0) return '/placeholder.png'
  const safeIndex = Math.min(Math.max(index, MIN_INDEX), candidates.length - MAX_INDEX_OFFSET)
  return candidates[safeIndex]
}

export const scheduleNextAttempt = (
  currentIndex: number,
  setIndex: (updater: (prev: number) => number) => void,
  delayMs = 0,
) => {
  if (delayMs <= 0) {
    setIndex((prev) => prev + 1)
    return
  }
  window.setTimeout(() => {
    setIndex((prev) => prev + 1)
  }, delayMs)
}

export const toProxy = (url: string) => `/api/image-proxy?url=${encodeURIComponent(url)}`

export const buildProxiedCandidateUrls = (nftData: TONNFTData | null | undefined): string[] => {
  const raw = buildCandidateUrls(nftData)
  return raw.map(toProxy)
}
