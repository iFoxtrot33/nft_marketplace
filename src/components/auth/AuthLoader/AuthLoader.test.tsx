import { AuthLoader } from './AuthLoader'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      nftMarketplace: 'NFT TON Marketplace',
    }
    return translations[key] || key
  }),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

describe('AuthLoader', () => {
  it('renders without errors', () => {
    render(<AuthLoader />)

    const container = document.querySelector('.fixed.inset-0.z-50.bg-black')
    expect(container).toBeInTheDocument()
  })

  it('displays the logo image', () => {
    render(<AuthLoader />)

    const logoImage = screen.getByAltText('NFT TON Marketplace Logo')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', '/logo.svg')
  })

  it('displays the marketplace title from translations', () => {
    render(<AuthLoader />)

    const title = screen.getByText('NFT TON Marketplace')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-white', 'text-xl', 'font-semibold')
  })

  it('renders the animated spinning orbit', () => {
    render(<AuthLoader />)

    const orbit = document.querySelector('.animate-spin')
    expect(orbit).toBeInTheDocument()
    expect(orbit).toHaveStyle('animation-duration: 2s')
  })

  it('renders the blue dot comet', () => {
    render(<AuthLoader />)

    const comet = document.querySelector('.bg-blue-light.rounded-full')
    expect(comet).toBeInTheDocument()
    expect(comet).toHaveClass('w-2', 'h-2', 'shadow-lg')
  })

  it('applies correct layout classes', () => {
    render(<AuthLoader />)

    const container = document.querySelector('.fixed.inset-0')
    expect(container).toHaveClass(
      'fixed',
      'inset-0',
      'z-50',
      'bg-black',
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
    )
  })

  it('positions logo and orbit correctly', () => {
    render(<AuthLoader />)

    const logoContainer = document.querySelector('.w-16.h-16.relative.z-10')
    expect(logoContainer).toBeInTheDocument()

    const orbit = document.querySelector('.absolute.top-1\\/2.left-1\\/2')
    expect(orbit).toBeInTheDocument()
    expect(orbit).toHaveClass('w-24', 'h-24', '-translate-x-1/2', '-translate-y-1/2')
  })
})
