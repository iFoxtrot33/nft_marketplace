import { IStoryPreview } from '../types'
import { Story } from './Story'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Story', () => {
  const mockStory: IStoryPreview = {
    id: '1',
    title: 'Test Story',
    emoji: '🎉',
    gradient: {
      from: '#ff0000',
      to: '#0000ff',
    },
    stories: [],
  }

  const mockOnClick = vi.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders correctly with basic props', () => {
    render(<Story story={mockStory} onClick={mockOnClick} />)

    expect(screen.getByText('Test Story')).toBeInTheDocument()
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<Story story={mockStory} onClick={mockOnClick} />)

    const storyElement = screen.getByText('Test Story').closest('div')
    if (storyElement) {
      fireEvent.click(storyElement)
    }

    expect(mockOnClick).toHaveBeenCalledWith(mockStory)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('renders without emoji when not provided', () => {
    const storyWithoutEmoji = { ...mockStory, emoji: undefined }
    render(<Story story={storyWithoutEmoji} onClick={mockOnClick} />)

    expect(screen.getByText('Test Story')).toBeInTheDocument()
    expect(screen.queryByText('🎉')).not.toBeInTheDocument()
  })

  it('applies gradient as background style', () => {
    render(<Story story={mockStory} onClick={mockOnClick} />)

    const gradientElement = screen.getByText('Test Story').parentElement
    expect(gradientElement).toHaveStyle({
      background: 'linear-gradient(135deg, #ff0000 0%, #0000ff 100%)',
    })
  })
})
