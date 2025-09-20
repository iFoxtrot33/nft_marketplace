import { Providers } from './Providers'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Providers', () => {
  it('renders children correctly', () => {
    const testText = 'Test content'

    render(
      <Providers>
        <div>{testText}</div>
      </Providers>,
    )

    expect(screen.getByText(testText)).toBeInTheDocument()
  })
})
