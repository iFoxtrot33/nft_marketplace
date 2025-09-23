import { Error } from './Error'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockT = vi.fn()
vi.mock('next-intl', () => ({
  useTranslations: () => mockT,
}))

describe('Error', () => {
  it('renders error message', () => {
    mockT.mockReturnValue('Something went wrong. Try again later.')

    render(<Error />)

    expect(screen.getByText('Something went wrong. Try again later.')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    mockT.mockReturnValue('Test error')

    render(<Error />)

    const errorElement = screen.getByText('Test error')
    expect(errorElement).toHaveClass('bg-[var(--color-red-dark)]', 'text-white', 'p-4', 'rounded-lg', 'text-center')
  })
})
