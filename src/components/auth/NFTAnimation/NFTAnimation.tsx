'use client'

import { NFTRow } from './NFTRow'
import {
  BASE_DURATION,
  CARD_HEIGHT,
  DURATION_INCREMENT,
  HEADER_HEIGHT,
  MARGIN_BOTTOM,
  MIN_ROW_COUNT,
  NFTCardConstants,
} from './constants'
import { generateRows } from './utils/generateRows'

import { useEffect, useState } from 'react'

export function NFTAnimation() {
  const [rowCount, setRowCount] = useState(MIN_ROW_COUNT)

  useEffect(() => {
    const calculateRows = () => {
      const viewportHeight = window.innerHeight
      const rowHeight = CARD_HEIGHT + MARGIN_BOTTOM

      const availableHeight = viewportHeight - HEADER_HEIGHT
      const neededRows = Math.ceil(availableHeight / rowHeight)

      setRowCount(Math.max(neededRows, MIN_ROW_COUNT))
    }

    calculateRows()
    window.addEventListener('resize', calculateRows)

    return () => window.removeEventListener('resize', calculateRows)
  }, [])

  const rows = generateRows(NFTCardConstants, rowCount)

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {rows.map((row, rowIndex) => (
          <NFTRow
            key={rowIndex}
            direction={row.direction}
            nfts={row.nfts}
            duration={BASE_DURATION + rowIndex * DURATION_INCREMENT}
          />
        ))}
      </div>
    </div>
  )
}
