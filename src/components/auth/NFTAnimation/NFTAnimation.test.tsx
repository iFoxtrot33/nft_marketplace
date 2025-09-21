import { NFTAnimation } from './NFTAnimation'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./utils/generateRows', () => ({
  generateRows: vi.fn(() => [
    { direction: 'right', nfts: [{ id: 1, imageUrl: '/test1.webp' }] },
    { direction: 'left', nfts: [{ id: 2, imageUrl: '/test2.webp' }] },
  ]),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('NFTAnimation', () => {
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  it('renders without errors', () => {
    render(<NFTAnimation />)

    const container = document.querySelector('.min-h-screen')
    expect(container).toBeInTheDocument()
  })

  it('applies correct CSS classes to main container', () => {
    render(<NFTAnimation />)

    const container = document.querySelector('.min-h-screen')
    expect(container).toHaveClass('min-h-screen', 'bg-gray-900', 'py-8')
  })

  it('renders inner container with correct classes', () => {
    render(<NFTAnimation />)

    const innerContainer = document.querySelector('.container')
    expect(innerContainer).toHaveClass('container', 'mx-auto', 'px-4')
  })

  it('renders NFT rows from generated data', () => {
    render(<NFTAnimation />)

    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('handles window resize events', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<NFTAnimation />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })
})
