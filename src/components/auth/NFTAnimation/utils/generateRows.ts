import { INFTCardProps } from '../NFTCard/types'

export const generateRows = (nfts: INFTCardProps['nft'][], rowCount: number) => {
  const rows = []
  for (let i = 0; i < rowCount; i++) {
    const shuffledNFTs = [...nfts].sort(() => Math.random() - 0.5)
    const nftSet = shuffledNFTs.slice(0, 6)

    rows.push({
      direction: (i % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
      nfts: nftSet,
    })
  }
  return rows
}
