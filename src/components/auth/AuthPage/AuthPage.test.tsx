import { AuthPage } from './AuthPage'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/components', () => ({
  HeroBanner: vi.fn(() => <div data-testid="hero-banner">HeroBanner</div>),
  Login: vi.fn(() => <div data-testid="login">Login</div>),
  NFTAnimation: vi.fn(() => <div data-testid="nft-animation">NFTAnimation</div>),
}))

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<AuthPage />)
    }).not.toThrow()
  })

  it('renders all required components', () => {
    render(<AuthPage />)

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('login')).toBeInTheDocument()
    expect(screen.getByTestId('nft-animation')).toBeInTheDocument()
  })

  it('renders components in correct order', () => {
    const { container } = render(<AuthPage />)
    const div = container.firstChild as HTMLElement

    expect(div.children[0]).toHaveAttribute('data-testid', 'hero-banner')
    expect(div.children[1]).toHaveAttribute('data-testid', 'login')
    expect(div.children[2]).toHaveAttribute('data-testid', 'nft-animation')
  })
})
