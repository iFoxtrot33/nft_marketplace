import { HomePage } from './HomePage'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components', () => ({
  HeroBanner: vi.fn(() => <div data-testid="hero-banner">HeroBanner</div>),
  NFTCards: vi.fn(() => <div data-testid="nft-cards">NFTCards</div>),
  Payment: vi.fn(() => <div data-testid="payment">Payment</div>),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all main components', () => {
    render(<HomePage />)

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('payment')).toBeInTheDocument()
    expect(screen.getByTestId('nft-cards')).toBeInTheDocument()
  })

  it('renders with correct structure', () => {
    const { container } = render(<HomePage />)

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('w-full', 'h-full')
  })
})
