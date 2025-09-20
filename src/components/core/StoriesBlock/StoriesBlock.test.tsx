import { StoriesBlock } from './StoriesBlock'
import { IStoryPreview } from './types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-insta-stories', () => ({
  default: ({ onAllStoriesEnd }: { onAllStoriesEnd: () => void }) => (
    <div data-testid="stories-viewer">
      <button onClick={onAllStoriesEnd} data-testid="stories-end">
        End Stories
      </button>
    </div>
  ),
}))

describe('StoriesBlock', () => {
  const mockStories: IStoryPreview[] = [
    {
      id: '1',
      title: 'Test Story 1',
      emoji: '🎉',
      gradient: {
        from: '#ff0000',
        to: '#0000ff',
      },
      stories: [
        {
          url: '/test1.jpg',
          duration: 5000,
          type: 'image',
        },
      ],
    },
    {
      id: '2',
      title: 'Test Story 2',
      emoji: '🚀',
      gradient: {
        from: '#00ff00',
        to: '#ff00ff',
      },
      stories: [
        {
          url: '/test2.jpg',
          duration: 5000,
          type: 'image',
        },
      ],
    },
  ]

  it('renders stories list correctly', () => {
    render(<StoriesBlock stories={mockStories} />)

    expect(screen.getByText('Test Story 1')).toBeInTheDocument()
    expect(screen.getByText('Test Story 2')).toBeInTheDocument()
    expect(screen.getByText('🎉')).toBeInTheDocument()
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('renders with default STORIES_CONFIG when no stories provided', () => {
    render(<StoriesBlock />)

    expect(screen.getByText('Sketch to Mint')).toBeInTheDocument()
  })

  it('opens story viewer when story is clicked', () => {
    render(<StoriesBlock stories={mockStories} />)

    const storyElement = screen.getByText('Test Story 1')
    fireEvent.click(storyElement)

    expect(screen.getByTestId('stories-viewer')).toBeInTheDocument()
    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('closes story viewer when close button is clicked', () => {
    render(<StoriesBlock stories={mockStories} />)

    const storyElement = screen.getByText('Test Story 1')
    fireEvent.click(storyElement)

    expect(screen.getByTestId('stories-viewer')).toBeInTheDocument()

    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('stories-viewer')).not.toBeInTheDocument()
  })

  it('closes story viewer when all stories end', () => {
    render(<StoriesBlock stories={mockStories} />)

    const storyElement = screen.getByText('Test Story 1')
    fireEvent.click(storyElement)

    expect(screen.getByTestId('stories-viewer')).toBeInTheDocument()

    const endButton = screen.getByTestId('stories-end')
    fireEvent.click(endButton)

    expect(screen.queryByTestId('stories-viewer')).not.toBeInTheDocument()
  })
})
