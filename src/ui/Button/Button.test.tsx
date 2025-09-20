import { Button } from './Button'

import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies default base styles', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    expect(button).toHaveClass('h-9', 'px-4', 'py-2')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('passes additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Test
      </Button>,
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })

  it('applies custom classes', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('custom-class')
  })
})
