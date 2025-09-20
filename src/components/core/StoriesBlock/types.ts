export interface IStoryPreview {
  id: string
  preview?: string
  backgroundColor?: string
  gradient?: {
    from: string
    to: string
  }
  stories: IStoryData[]
  title: string
  emoji?: string
}

export interface IStoryData {
  url: string
  duration?: number
  type?: 'image' | 'video'
  header?: {
    heading: string
    subheading: string
    profileImage: string
  }
}

export interface IStoriesBlockProps {
  stories?: IStoryPreview[]
}
