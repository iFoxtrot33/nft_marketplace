import { NFTRow } from './NFTRow'
import { INFTRowProps } from './types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('NFTRow', () => {
  const mockNFTs: INFTRowProps['nfts'] = [
    { id: 1, imageUrl: '/nft1.webp' },
    { id: 2, imageUrl: '/nft2.webp' },
  ]

  it('renders without errors', () => {
    render(<NFTRow direction="right" nfts={mockNFTs} />)

    const container = document.querySelector('.overflow-hidden')
    expect(container).toBeInTheDocument()
  })

  it('renders all NFT cards with triplication', () => {
    render(<NFTRow direction="right" nfts={mockNFTs} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
  })

  it('renders gradient overlays', () => {
    render(<NFTRow direction="right" nfts={mockNFTs} />)

    const container = document.querySelector('.overflow-hidden')
    const gradients = container?.querySelectorAll('.absolute')
    expect(gradients).toHaveLength(2)
  })

  it('applies correct CSS classes to container', () => {
    render(<NFTRow direction="right" nfts={mockNFTs} />)

    const container = document.querySelector('.overflow-hidden')
    expect(container).toHaveClass('overflow-hidden', 'mb-4', 'relative')
  })

  it('uses default duration when not provided', () => {
    render(<NFTRow direction="left" nfts={mockNFTs} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
  })

  it('works with custom duration', () => {
    render(<NFTRow direction="left" nfts={mockNFTs} duration={30} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(6)
  })
})
