import { INFTCardProps } from '../NFTCard/types'
import { generateRows } from './generateRows'

import { describe, expect, it } from 'vitest'

describe('generateRows', () => {
  const mockNFTs: INFTCardProps['nft'][] = [
    { id: 1, imageUrl: '/nft1.webp' },
    { id: 2, imageUrl: '/nft2.webp' },
    { id: 3, imageUrl: '/nft3.webp' },
    { id: 4, imageUrl: '/nft4.webp' },
    { id: 5, imageUrl: '/nft5.webp' },
    { id: 6, imageUrl: '/nft6.webp' },
    { id: 7, imageUrl: '/nft7.webp' },
    { id: 8, imageUrl: '/nft8.webp' },
  ]

  it('generates correct number of rows', () => {
    const result = generateRows(mockNFTs, 3)

    expect(result).toHaveLength(3)
  })

  it('alternates direction between rows', () => {
    const result = generateRows(mockNFTs, 4)

    expect(result[0].direction).toBe('right')
    expect(result[1].direction).toBe('left')
    expect(result[2].direction).toBe('right')
    expect(result[3].direction).toBe('left')
  })

  it('limits NFTs per row to 6', () => {
    const result = generateRows(mockNFTs, 2)

    result.forEach((row) => {
      expect(row.nfts).toHaveLength(6)
    })
  })

  it('handles fewer NFTs than required per row', () => {
    const fewNFTs = mockNFTs.slice(0, 3)
    const result = generateRows(fewNFTs, 2)

    result.forEach((row) => {
      expect(row.nfts.length).toBeLessThanOrEqual(3)
    })
  })

  it('returns empty array for zero rows', () => {
    const result = generateRows(mockNFTs, 0)

    expect(result).toHaveLength(0)
  })
})
