import { INFTCardProps } from './types'

import Image from 'next/image'

export const NFTCard: React.FC<INFTCardProps> = ({ nft }) => (
  <div className="flex-shrink-0 mx-2 rounded-lg overflow-hidden" style={{ width: '86px', height: '86px' }}>
    <Image src={nft.imageUrl} alt={`NFT ${nft.id}`} width={86} height={86} className="w-full h-full object-cover" />
  </div>
)
