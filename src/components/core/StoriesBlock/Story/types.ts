import { IStoryPreview } from '../types'

export interface IStoryProps {
  story: IStoryPreview
  onClick: (story: IStoryPreview) => void
}
