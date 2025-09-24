import { HomePage } from './HomePage'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components', () => ({
  HeroBanner: vi.fn(() => <div data-testid="hero-banner">HeroBanner</div>),
  NFTCards: vi.fn(() => <div data-testid="nft-cards">NFTCards</div>),
  Payment: vi.fn(() => <div data-testid="payment">Payment</div>),
}))

describe('HomePage', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  )
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all main components', () => {
    render(<HomePage />, { wrapper })

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('payment')).toBeInTheDocument()
    expect(screen.getByTestId('nft-cards')).toBeInTheDocument()
  })

  it('renders with correct structure', () => {
    const { container } = render(<HomePage />, { wrapper })

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('w-full', 'h-full')
  })
})
