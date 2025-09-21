import { NFTCard } from './NFTCard'
import { INFTCardProps } from './types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('NFTCard', () => {
  const mockNFT: INFTCardProps['nft'] = {
    id: 1,
    imageUrl: '/test-image.webp',
  }

  it('renders without errors', () => {
    render(<NFTCard nft={mockNFT} />)

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('displays correct alt text', () => {
    render(<NFTCard nft={mockNFT} />)

    const image = screen.getByAltText('NFT 1')
    expect(image).toBeInTheDocument()
  })

  it('uses correct image URL in optimized src', () => {
    render(<NFTCard nft={mockNFT} />)

    const image = screen.getByRole('img') as HTMLImageElement
    expect(image.src).toContain('test-image.webp')
  })

  it('has correct dimensions', () => {
    render(<NFTCard nft={mockNFT} />)

    const container = screen.getByRole('img').parentElement
    expect(container).toHaveStyle({ width: '86px', height: '86px' })
  })

  it('applies correct CSS classes', () => {
    render(<NFTCard nft={mockNFT} />)

    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('flex-shrink-0', 'mx-2', 'rounded-lg', 'overflow-hidden')

    const image = screen.getByRole('img')
    expect(image).toHaveClass('w-full', 'h-full', 'object-cover')
  })

  it('works correctly with different IDs', () => {
    const nftWithDifferentId = { ...mockNFT, id: 42 }
    render(<NFTCard nft={nftWithDifferentId} />)

    const image = screen.getByAltText('NFT 42')
    expect(image).toBeInTheDocument()
  })
})
