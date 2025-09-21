import { INFTCardProps } from '../NFTCard/types'
import { NFTS_PER_ROW, SHUFFLE_RANDOM_OFFSET } from './constants'

export const generateRows = (nfts: INFTCardProps['nft'][], rowCount: number) => {
  const rows = []
  for (let i = 0; i < rowCount; i++) {
    const shuffledNFTs = [...nfts].sort(() => Math.random() - SHUFFLE_RANDOM_OFFSET)
    const nftSet = shuffledNFTs.slice(0, NFTS_PER_ROW)

    rows.push({
      direction: (i % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
      nfts: nftSet,
    })
  }
  return rows
}
