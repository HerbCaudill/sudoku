import { emptyGrid, rows as units, cols, boxes, rows } from './constants.js'
import { Grid } from './types.js'

export const unitPeers = (
  index: number,
  /** pass rows, cols, or boxes */
  units: Grid
) => {
  const unit = units[index]
  return emptyGrid.reduce((result, _, i) => {
    if (units[i] === unit && i !== index) result.push(i)
    return result
  }, [] as number[])
}

export const rowPeers = emptyGrid.map((_, i) => unitPeers(i, rows))
export const colPeers = emptyGrid.map((_, i) => unitPeers(i, cols))
export const boxPeers = emptyGrid.map((_, i) => unitPeers(i, boxes))

/**
 * Constant mapping each cell index to a set containing the indices of all its peers
 * (cells in the same row, column, or box)
 */
export const peers = emptyGrid.map((_, i) =>
  Array.from(
    new Set([
      ...unitPeers(i, rows), //
      ...unitPeers(i, cols),
      ...unitPeers(i, boxes),
    ])
  )
)
