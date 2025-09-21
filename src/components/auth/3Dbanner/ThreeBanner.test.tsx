import { ThreeBanner } from './ThreeBanner'

import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('three', () => {
  const mockCanvas = document.createElement('canvas')

  return {
    Scene: vi.fn(() => ({
      add: vi.fn(),
    })),
    PerspectiveCamera: vi.fn(() => ({
      position: { x: 0, y: 0, z: 0 },
      lookAt: vi.fn(),
    })),
    WebGLRenderer: vi.fn(() => ({
      setSize: vi.fn(),
      setClearColor: vi.fn(),
      domElement: mockCanvas,
      render: vi.fn(),
      dispose: vi.fn(),
    })),
    AmbientLight: vi.fn(),
    Box3: vi.fn(() => ({
      setFromObject: vi.fn().mockReturnValue({
        getCenter: vi.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
      }),
    })),
    Vector3: vi.fn(() => ({
      x: 0,
      y: 0,
      z: 0,
      sub: vi.fn(),
    })),
    AnimationMixer: vi.fn(),
    Clock: vi.fn(() => ({
      getDelta: vi.fn(() => 0.016),
    })),
  }
})

vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: vi.fn(() => ({
    setDRACOLoader: vi.fn(),
    load: vi.fn(),
  })),
}))

vi.mock('three/examples/jsm/loaders/DRACOLoader.js', () => ({
  DRACOLoader: vi.fn(() => ({
    setDecoderPath: vi.fn(),
    dispose: vi.fn(),
  })),
}))

global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  setTimeout(callback, 16)
  return 1
})

describe('ThreeBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default props', () => {
    const { container } = render(<ThreeBanner />)

    const bannerDiv = container.firstChild as HTMLElement
    expect(bannerDiv).toBeInTheDocument()
    expect(bannerDiv).toHaveClass('select-none')
    expect(bannerDiv).toHaveStyle({ cursor: 'grab' })
  })

  it('renders with custom width and height', () => {
    const { container } = render(<ThreeBanner width={300} height={200} />)

    const bannerDiv = container.firstChild as HTMLElement
    expect(bannerDiv).toHaveStyle({
      width: '300px',
      height: '200px',
      cursor: 'grab',
    })
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<ThreeBanner width={150} height={100} />)

    const bannerDiv = container.firstChild as HTMLElement
    expect(bannerDiv).toHaveClass('select-none')
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<ThreeBanner />)
    }).not.toThrow()
  })
})
