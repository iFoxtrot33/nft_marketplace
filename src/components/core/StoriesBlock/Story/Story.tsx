import { IStoryProps } from './types'

import React from 'react'

export const Story: React.FC<IStoryProps> = ({ story, onClick }) => {
  return (
    <div className="flex-shrink-0 cursor-pointer group mt-1" onClick={() => onClick(story)}>
      <div className="relative">
        <div className="w-[86px] h-[86px] p-0.5 group-hover:scale-105 transition-transform duration-200 rounded-2xl bg-[var(--color-purple-light)]">
          <div className="w-full h-full p-0.5 rounded-2xl bg-[var(--color-background-black)]">
            <div
              className="w-full h-full flex flex-col justify-between text-white font-semibold rounded-2xl py-2"
              style={{
                background: `linear-gradient(135deg, ${story.gradient?.from} 0%, ${story.gradient?.to} 100%)`,
              }}
            >
              {story.emoji && <span className="text-m px-2">{story.emoji}</span>}
              <span className="text-left text-[10px] leading-[12px] font-medium w-full px-2">{story.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
