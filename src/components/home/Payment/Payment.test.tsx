import { Payment } from './Payment'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'payment.button': 'Payment',
      'payment.emptyCart': 'Add items to cart',
      'payment.modal.title': 'You have {count} NFTs in your cart',
      'payment.modal.continueShopping': 'Continue Shopping',
      'payment.modal.payNow': 'Pay Now',
      'payment.modal.processing': 'Processing...',
    }
    return translations[key] || key
  }),
}))

vi.mock('react-confetti-boom', () => ({
  default: vi.fn(() => <div data-testid="confetti">Confetti</div>),
}))

vi.mock('@/common', () => ({
  useCart: vi.fn(() => ({
    cart: { nfts: [] as any[] },
  })),
  useDeleteAllItemsInCart: vi.fn(() => ({
    deleteAllItemsInCart: vi.fn(),
    isLoading: false,
  })),
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}))

describe('Payment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty cart message when cart is empty', () => {
    render(<Payment />)

    expect(screen.getByText('Add items to cart')).toBeInTheDocument()
  })

  it('renders payment button when cart has items', async () => {
    const { useCart } = await import('@/common')
    vi.mocked(useCart).mockReturnValue({
      cart: {
        nfts: ['nft1', 'nft2'],
        page_id: '1',
        title: 'Test Cart',
        user_id: 'user1',
        created_time: '2023-01-01',
        last_edited_time: '2023-01-01',
      },
      isLoading: false,
      error: null,
    })

    render(<Payment />)

    expect(screen.getByText('Payment')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Badge count
  })
})
