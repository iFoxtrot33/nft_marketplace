'use client'

import { STORIES_CONFIG } from './StoriesConfig'
import { Story } from './Story/Story'
import { IStoriesBlockProps, IStoryPreview } from './types'

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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md h-full max-h-[600px]">
            <button
              onClick={handleCloseStory}
              className="absolute top-4 right-4 z-[9999] text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>

            <div className="w-full h-full overflow-hidden rounded-xl">
              <Stories
                stories={selectedStory.stories}
                defaultInterval={5000}
                width="100%"
                height="100%"
                onAllStoriesEnd={handleCloseStory}
                storyStyles={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
                storyContainerStyles={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  padding: '0',
                  margin: '0',
                }}
                storyInnerContainerStyles={{
                  width: '100%',
                  height: '100%',
                  padding: '0',
                  margin: '0',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
