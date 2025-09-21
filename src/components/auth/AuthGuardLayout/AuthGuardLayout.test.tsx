import { AuthGuardLayout } from './AuthGuardLayout'

import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseTonWallet = vi.fn()
vi.mock('@tonconnect/ui-react', () => ({
  useTonWallet: () => mockUseTonWallet(),
}))

const mockPush = vi.fn()
const mockPrefetch = vi.fn(() => Promise.resolve())
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: mockPrefetch,
  }),
}))

vi.mock('../AuthLoader', () => ({
  AuthLoader: () => <div data-testid="auth-loader">Loading...</div>,
}))

describe('AuthGuardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without errors', () => {
    mockUseTonWallet.mockReturnValue({ address: 'test-wallet' })

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    expect(screen.getByTestId('auth-loader')).toBeInTheDocument()
  })

  it('shows AuthLoader initially', () => {
    mockUseTonWallet.mockReturnValue({ address: 'test-wallet' })

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    expect(screen.getByTestId('auth-loader')).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('prefetches auth and home pages on mount', () => {
    mockUseTonWallet.mockReturnValue({ address: 'test-wallet' })

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    expect(mockPrefetch).toHaveBeenCalledWith('/auth')
    expect(mockPrefetch).toHaveBeenCalledWith('/')
    expect(mockPrefetch).toHaveBeenCalledTimes(2)
  })

  it('shows children when wallet is connected and loading is complete', async () => {
    mockUseTonWallet.mockReturnValue({ address: 'test-wallet' })

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    expect(screen.getByTestId('auth-loader')).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.queryByTestId('auth-loader')).not.toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('redirects to auth page when wallet is not connected', async () => {
    mockUseTonWallet.mockReturnValue(null)

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/auth')
      },
      { timeout: 3000 },
    )
  })

  it('renders null when wallet is not connected after loading', async () => {
    mockUseTonWallet.mockReturnValue(null)

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    await waitFor(
      () => {
        expect(screen.queryByTestId('auth-loader')).not.toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('handles prefetch errors gracefully', async () => {
    mockUseTonWallet.mockReturnValue({ address: 'test-wallet' })
    mockPrefetch.mockRejectedValue(new Error('Prefetch failed'))

    render(
      <AuthGuardLayout>
        <div>Test Content</div>
      </AuthGuardLayout>,
    )

    await waitFor(
      () => {
        expect(screen.queryByTestId('auth-loader')).not.toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
