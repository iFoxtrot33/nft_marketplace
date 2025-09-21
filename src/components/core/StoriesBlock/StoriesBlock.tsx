'use client'

import { STORIES_CONFIG } from './StoriesConfig'
import { Story } from './Story/Story'
import { IStoriesBlockProps, IStoryPreview } from './types'

import { X } from 'lucide-react'
import React, { useState } from 'react'
import Stories from 'react-insta-stories'

export const StoriesBlock: React.FC<IStoriesBlockProps> = ({ stories = STORIES_CONFIG }) => {
  const [selectedStory, setSelectedStory] = useState<IStoryPreview | null>(null)

  const handleStoryClick = (story: IStoryPreview) => {
    setSelectedStory(story)
  }

  const handleCloseStory = () => {
    setSelectedStory(null)
  }

  return (
    <div className="w-full mt-5">
      <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <Story key={story.id} story={story} onClick={handleStoryClick} />
        ))}
      </div>

      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50">
          <button
            onClick={handleCloseStory}
            data-testid="close-story-button"
            className="absolute top-4 right-4 z-[9999] text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-black/20"
          >
            <X size={24} />
          </button>

          <div className="w-full h-screen">
            <Stories
              stories={selectedStory.stories}
              defaultInterval={5000}
              width="100vw"
              height="100vh"
              onAllStoriesEnd={handleCloseStory}
              storyStyles={{
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
              }}
              storyContainerStyles={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                padding: '0',
                margin: '0',
                position: 'absolute',
                top: '0',
                left: '0',
              }}
              storyInnerContainerStyles={{
                width: '100vw',
                height: '100vh',
                padding: '0',
                margin: '0',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
