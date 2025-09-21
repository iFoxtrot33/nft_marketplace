import { INFTCardProps } from '../NFTCard/types'

export interface INFTRowProps {
  direction: 'left' | 'right'
  nfts: INFTCardProps['nft'][]
  duration?: number
}
