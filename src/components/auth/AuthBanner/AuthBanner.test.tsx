import { AuthBanner } from './AuthBanner'

import { render } from '@testing-library/react'
import Image from 'next/image'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'banner.companyName': 'DigiCollect',
      'banner.nft': 'NFT',
      'banner.marketplace': 'Marketplace',
    }
    return translations[key] || key
  }),
}))

vi.mock('../3Dbanner', () => ({
  ThreeBanner: vi.fn(({ width, height }: { width: number; height: number }) => (
    <div data-testid="three-banner" style={{ width: `${width}px`, height: `${height}px` }}>
      3D Banner Mock
    </div>
  )),
}))

vi.mock('next/image', () => ({
  default: vi.fn((props: { src: string; alt: string; width: number; height: number }) => (
    <Image src={props.src} alt={props.alt} width={props.width} height={props.height} data-testid="logo-image" />
  )),
}))

describe('AuthBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<AuthBanner />)
    }).not.toThrow()
  })

  it('renders company name', () => {
    const { getByText } = render(<AuthBanner />)

    expect(getByText('DigiCollect')).toBeInTheDocument()
  })

  it('renders logo image', () => {
    const { getByTestId } = render(<AuthBanner />)

    const logoImage = getByTestId('logo-image')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', '/logo.svg')
    expect(logoImage).toHaveAttribute('alt', 'logo')
  })

  it('renders 3D banner component', () => {
    const { getByTestId } = render(<AuthBanner />)

    const threeBanner = getByTestId('three-banner')
    expect(threeBanner).toBeInTheDocument()
    expect(threeBanner).toHaveStyle({
      width: '180px',
      height: '130px',
    })
  })

  it('renders NFT text for mobile and desktop versions', () => {
    const { getAllByText } = render(<AuthBanner />)

    const nftElements = getAllByText('NFT')
    expect(nftElements.length).toBeGreaterThan(0)
  })

  it('renders Marketplace text for mobile and desktop versions', () => {
    const { getAllByText } = render(<AuthBanner />)

    const marketplaceElements = getAllByText('Marketplace')
    expect(marketplaceElements.length).toBeGreaterThan(0)
  })
})
