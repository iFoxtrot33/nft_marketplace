import { NFTCards } from './NFTCards'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      noNFTsFound: 'Unfortunately, we are currently out of stock. Please check back with us later.',
    }
    return translations[key] || key
  }),
}))

vi.mock('@/common', () => ({
  useGetNFTs: vi.fn(() => ({
    data: [] as any[],
    isLoading: false,
    error: null as Error | null,
    canLoadMore: false,
    loadMore: vi.fn(),
  })),
  useInfiniteScroll: vi.fn(() => vi.fn()),
}))

vi.mock('./NFTSmallCard', () => ({
  NFTSmallCard: vi.fn(({ onClick }) => (
    <button onClick={onClick} data-testid="nft-card">
      NFT Card
    </button>
  )),
}))

vi.mock('./NFTModal', () => ({
  NFTModal: vi.fn(({ isOpen }) => (isOpen ? <div data-testid="nft-modal">NFT Modal</div> : null)),
}))

vi.mock('@/components', () => ({
  Error: vi.fn(() => <div data-testid="error">Error</div>),
}))

vi.mock('@/ui/Skeleton/Skeleton', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton">Skeleton</div>),
}))

describe('NFTCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no NFTs', () => {
    render(<NFTCards />)

    expect(
      screen.getByText('Unfortunately, we are currently out of stock. Please check back with us later.'),
    ).toBeInTheDocument()
  })

  it('renders NFT cards when data is available', async () => {
    const { useGetNFTs } = await import('@/common')
    vi.mocked(useGetNFTs).mockReturnValue({
      data: [
        { nft_address: 'nft1', page_id: '1', id: 1, title: 'NFT 1', created_time: '2023-01-01' },
        { nft_address: 'nft2', page_id: '2', id: 2, title: 'NFT 2', created_time: '2023-01-02' },
      ],
      isLoading: false,
      error: null,
      canLoadMore: false,
      loadMore: vi.fn(),
    })

    render(<NFTCards />)

    expect(screen.getAllByTestId('nft-card')).toHaveLength(2)
  })

  it('renders loading skeletons when loading', async () => {
    const { useGetNFTs } = await import('@/common')
    vi.mocked(useGetNFTs).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      canLoadMore: false,
      loadMore: vi.fn(),
    })

    render(<NFTCards />)

    expect(screen.getAllByTestId('skeleton')).toHaveLength(6)
  })

  it('renders error component when error occurs', async () => {
    const { useGetNFTs } = await import('@/common')
    vi.mocked(useGetNFTs).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Test error'),
      canLoadMore: false,
      loadMore: vi.fn(),
    })

    render(<NFTCards />)

    expect(screen.getByTestId('error')).toBeInTheDocument()
  })

  it('opens modal when NFT card is clicked', async () => {
    const { useGetNFTs } = await import('@/common')
    vi.mocked(useGetNFTs).mockReturnValue({
      data: [{ nft_address: 'nft1', page_id: '1', id: 1, title: 'NFT 1', created_time: '2023-01-01' }],
      isLoading: false,
      error: null,
      canLoadMore: false,
      loadMore: vi.fn(),
    })

    render(<NFTCards />)

    fireEvent.click(screen.getByTestId('nft-card'))

    expect(screen.getByTestId('nft-modal')).toBeInTheDocument()
  })
})
