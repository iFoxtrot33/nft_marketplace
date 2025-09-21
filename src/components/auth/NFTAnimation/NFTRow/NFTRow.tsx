import { NFTCard } from '../NFTCard'
import { ANIMATION_OFFSET_PERCENTAGE } from './constants'
import { INFTRowProps } from './types'

import { motion } from 'framer-motion'

export const NFTRow: React.FC<INFTRowProps> = ({ direction, nfts, duration = 60 }) => {
  const duplicatedNFTs = [...nfts, ...nfts, ...nfts]

  return (
    <div className="overflow-hidden mb-4 relative">
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex"
        animate={{
          x: direction === 'right' ? [0, `${ANIMATION_OFFSET_PERCENTAGE}%`] : [`${ANIMATION_OFFSET_PERCENTAGE}%`, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedNFTs.map((nft, index) => (
          <NFTCard key={`${nft.id}-${index}`} nft={nft} />
        ))}
      </motion.div>
    </div>
  )
}
