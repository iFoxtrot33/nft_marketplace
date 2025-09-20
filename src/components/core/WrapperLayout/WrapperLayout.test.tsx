import { WrapperLayout } from './WrapperLayout'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('WrapperLayout', () => {
  it('should render children inside wrapper', () => {
    const testContent = 'Test content'

    render(
      <WrapperLayout>
        <div>{testContent}</div>
      </WrapperLayout>,
    )

    expect(screen.getByText(testContent)).toBeInTheDocument()
  })
})
