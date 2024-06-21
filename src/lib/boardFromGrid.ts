import { Board } from 'solver/Board'
import { type Grid } from 'types'
import { gridToCandidates } from './gridToCandidates'

export const boardFromGrid = (grid: Grid) => {
  const candidates = gridToCandidates(grid)
  return new Board({ candidates })
}
