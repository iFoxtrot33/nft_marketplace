import { NFTModal } from './NFTModal'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, onLoad, onError, ...props }) => (
    <img src={src} alt={alt} onLoad={onLoad} onError={onError} {...props} data-testid="nft-image" />
  )),
}))

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      nftModalTitle: 'NFT Details',
      nftName: 'Name:',
      nftDescription: 'Description:',
      nftRawAddress: 'NFT Raw Address:',
      nftFriendlyAddress: 'NFT Friendly Address:',
      ownerAddress: 'Owner Address:',
      emptyStock: 'Sorry, we have some problems with this NFT, please try to check it later',
      'nftModal.removeItem': 'Remove Item',
      'nftModal.addToCart': 'Add to cart',
    }
    return translations[key] || key
  }),
}))

vi.mock('@/common', () => ({
  useGetNFT: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useAddToCart: vi.fn(() => ({
    addToCart: vi.fn(),
  })),
  useRemoveItemFromCart: vi.fn(() => ({
    removeFromCart: vi.fn(),
  })),
  useCart: vi.fn(() => ({
    cart: { nfts: [] },
  })),
  toFriendlyAddress: vi.fn((address) => `friendly-${address}`),
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}))

vi.mock('./utils', () => ({
  buildProxiedCandidateUrls: vi.fn(() => ['test-image.jpg']),
  getImageUrlByIndex: vi.fn(() => 'test-image.jpg'),
  scheduleNextAttempt: vi.fn(),
}))

vi.mock('./constants', () => ({
  NEXT_ATTEMPT_DELAY: 1000,
  TRANSITION_DURATION: 300,
  MIN_INDEX: 0,
  MAX_INDEX_OFFSET: 1,
  ARRAY_INDEX_OFFSET: -1,
  FALLBACK_INDEX: 0,
  INITIAL_IMAGE_INDEX: 0,
}))

vi.mock('@/ui/skeleton', () => ({
  Skeleton: vi.fn(({ className, ...props }) => (
    <div data-testid="skeleton" className={className} {...props}>
      Skeleton
    </div>
  )),
}))

vi.mock('@/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null)),
  DialogContent: vi.fn(({ children, className, ...props }) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  )),
  DialogHeader: vi.fn(({ children, className, ...props }) => (
    <div data-testid="dialog-header" className={className} {...props}>
      {children}
    </div>
  )),
  DialogTitle: vi.fn(({ children, className, ...props }) => (
    <div data-testid="dialog-title" className={className} {...props}>
      {children}
    </div>
  )),
}))

vi.mock('@/ui/Button', () => ({
  Button: vi.fn(({ children, onClick, variant, ...props }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {children}
    </button>
  )),
}))

vi.mock('lucide-react', () => ({
  X: vi.fn(() => <div data-testid="close-icon">X</div>),
}))

describe('NFTModal', () => {
  const mockOnClose = vi.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    nftAddress: 'test-address',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when not open', () => {
    render(<NFTModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('renders nothing when loading', async () => {
    const { useGetNFT } = await import('@/common')
    vi.mocked(useGetNFT).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<NFTModal {...defaultProps} />)

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('renders modal with NFT data', async () => {
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
          description: 'Test description',
          attributes: [],
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

    render(<NFTModal {...defaultProps} />)

    expect(screen.getByText('NFT Details')).toBeInTheDocument()
    expect(screen.getByText('Test NFT')).toBeInTheDocument()
  })

  it('shows add to cart button when NFT is not in cart', async () => {
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
          description: 'Test description',
          attributes: [],
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
        nfts: [],
        page_id: '1',
        title: 'Test Cart',
        user_id: 'user1',
        created_time: '2023-01-01',
        last_edited_time: '2023-01-01',
      },
      isLoading: false,
      error: null,
    })

    render(<NFTModal {...defaultProps} />)

    expect(screen.getByText('Add to cart')).toBeInTheDocument()
  })

  it('shows remove item button when NFT is in cart', async () => {
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
          description: 'Test description',
          attributes: [],
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

    render(<NFTModal {...defaultProps} />)

    expect(screen.getByText('Remove Item')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
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
          description: 'Test description',
          attributes: [],
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

    render(<NFTModal {...defaultProps} />)

    fireEvent.click(screen.getByTestId('close-icon'))

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
