import { Login } from './Login'

import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockOpenModal = vi.fn()
const mockPush = vi.fn()

vi.mock('@tonconnect/ui-react', () => ({
  useTonConnectUI: vi.fn(() => [
    {
      openModal: mockOpenModal,
    },
  ]),
  useTonWallet: vi.fn(() => null),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}))

vi.mock('@/ui/Button', () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props} data-testid="login-button">
      {children}
    </button>
  )),
}))

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NextIntlClientProvider
    locale="en"
    messages={{ authPage: { signInWithTONConnect: 'Sign In with TON Connect' } } as any}
  >
    {children}
  </NextIntlClientProvider>
)

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => {
      render(<Login />, { wrapper: Wrapper })
    }).not.toThrow()
  })

  it('renders login button with correct text', () => {
    render(<Login />, { wrapper: Wrapper })

    expect(screen.getByTestId('login-button')).toBeInTheDocument()
    expect(screen.getByText('Sign In with TON Connect')).toBeInTheDocument()
  })

  it('calls openModal when button is clicked', () => {
    render(<Login />, { wrapper: Wrapper })

    const button = screen.getByTestId('login-button')
    fireEvent.click(button)

    expect(mockOpenModal).toHaveBeenCalledTimes(1)
  })

  it('redirects to home when wallet is connected', async () => {
    const { useTonWallet } = await import('@tonconnect/ui-react')
    vi.mocked(useTonWallet).mockReturnValue({
      account: { address: 'test-address' },
    } as any)

    render(<Login />, { wrapper: Wrapper })

    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
