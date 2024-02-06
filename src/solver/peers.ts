import { boxes, cells, cols, numbers, rows } from './constants.js'
import { row, col, box } from './units.js'

const exclude = (j: number) => (i: number) => i !== j

export const rowPeers = cells.map(i => row(rows[i]).filter(exclude(i)))
export const colPeers = cells.map(i => col(cols[i]).filter(exclude(i)))
export const boxPeers = cells.map(i => box(boxes[i]).filter(exclude(i)))

/**
 * Constant mapping each cell index to a set containing the indices of all its peers
 * (cells in the same row, column, or box)
 */
export const peers = cells.map(i =>
  Array.from(
    new Set([
      ...rowPeers[i], //
      ...colPeers[i],
      ...boxPeers[i],
    ])
  )
)
