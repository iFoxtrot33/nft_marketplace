'use client'

import { ScrollingRow } from './NFTRow'
import { NFTCardConstants } from './constants'
import { generateRows } from './utils/generateRows'

import { useEffect, useState } from 'react'

export function NFTAnimation() {
  const [rowCount, setRowCount] = useState(4)

  useEffect(() => {
    const calculateRows = () => {
      const viewportHeight = window.innerHeight
      const cardHeight = 86
      const marginBottom = 16
      const rowHeight = cardHeight + marginBottom
      const headerHeight = 120

      const availableHeight = viewportHeight - headerHeight
      const neededRows = Math.ceil(availableHeight / rowHeight)

      setRowCount(Math.max(neededRows, 3))
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
          <ScrollingRow key={rowIndex} direction={row.direction} nfts={row.nfts} duration={60 + rowIndex * 5} />
        ))}
      </div>
    </div>
  )
}
