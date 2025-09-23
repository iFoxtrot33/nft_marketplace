import { NFTSmallCard } from './NFTSmallCard'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, onError, ...props }) => (
    <img src={src} alt={alt} onError={onError} {...props} data-testid="nft-image" />
  )),
}))

vi.mock('@/common', () => ({
  useGetNFT: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useCart: vi.fn(() => ({
    cart: { nfts: [] },
  })),
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}))

vi.mock('./utils', () => ({
  getNFTImageSrc: vi.fn(() => 'test-image.jpg'),
  canShowImage: vi.fn(() => true),
}))

vi.mock('./constants', () => ({
  MAX_IMAGE_ATTEMPTS: 3,
}))

vi.mock('@/ui/Skeleton/Skeleton', () => ({
  Skeleton: vi.fn(({ className, ...props }) => (
    <div data-testid="skeleton" className={className} {...props}>
      Skeleton
    </div>
  )),
}))

describe('NFTSmallCard', () => {
  const mockOnClick = vi.fn()
  const defaultProps = {
    data: { address: 'test-address' },
    onClick: mockOnClick,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders skeleton when loading', async () => {
    const { useGetNFT } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<NFTSmallCard {...defaultProps} />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('renders nothing when error occurs', async () => {
    const { useGetNFT } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Test error'),
    })

    const { container } = render(<NFTSmallCard {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders NFT card when data is available', async () => {
    const { useGetNFT } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: {
        address: 'test-address',
        index: 1,
        owner: {
          address: 'owner-address',
          is_scam: false,
          is_wallet: true,
        },
        collection: {
          address: 'collection-address',
          name: 'Test Collection',
          description: 'Test collection description',
        },
        verified: true,
        metadata: {
          name: 'Test NFT',
          attributes: [],
          description: 'Test description',
          marketplace: 'Test marketplace',
          image: 'test-image.jpg',
        },
        previews: [],
        approved_by: [],
        trust: 'high',
      },
      isLoading: false,
      error: null,
    })

    render(<NFTSmallCard {...defaultProps} />)

    expect(screen.getByTestId('nft-image')).toBeInTheDocument()
    expect(screen.getByAltText('Test NFT')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const { useGetNFT } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: {
        address: 'test-address',
        index: 1,
        owner: {
          address: 'owner-address',
          is_scam: false,
          is_wallet: true,
        },
        collection: {
          address: 'collection-address',
          name: 'Test Collection',
          description: 'Test collection description',
        },
        verified: true,
        metadata: {
          name: 'Test NFT',
          attributes: [],
          description: 'Test description',
          marketplace: 'Test marketplace',
          image: 'test-image.jpg',
        },
        previews: [],
        approved_by: [],
        trust: 'high',
      },
      isLoading: false,
      error: null,
    })

    render(<NFTSmallCard {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('shows cart indicator when NFT is in cart', async () => {
    const { useGetNFT, useCart } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: {
        address: 'test-address',
        index: 1,
        owner: {
          address: 'owner-address',
          is_scam: false,
          is_wallet: true,
        },
        collection: {
          address: 'collection-address',
          name: 'Test Collection',
          description: 'Test collection description',
        },
        verified: true,
        metadata: {
          name: 'Test NFT',
          attributes: [],
          description: 'Test description',
          marketplace: 'Test marketplace',
          image: 'test-image.jpg',
        },
        previews: [],
        approved_by: [],
        trust: 'high',
      },
      isLoading: false,
      error: null,
    })

    vi.mocked(useCart).mockReturnValue({
      cart: {
        nfts: ['test-address'],
        page_id: '1',
        title: 'Test Cart',
        user_id: 'user1',
        created_time: '2023-01-01',
        last_edited_time: '2023-01-01',
      },
      isLoading: false,
      error: null,
    })

    render(<NFTSmallCard {...defaultProps} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    const cartIndicator = screen.getByRole('button').querySelector('.absolute')
    expect(cartIndicator).toBeInTheDocument()
  })
})
