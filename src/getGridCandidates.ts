import { getCandidates } from './getCandidates.js'
import { getUnsolvedSquares } from './getUnsolvedSquares.js'
import { Grid } from './types.js'

export const getGridCandidates = (grid: Grid) =>
  getUnsolvedSquares(grid).reduce(
    (result, index) => ({ ...result, [index]: getCandidates(grid, index) }),
    {} as Record<number, number[]>
  )
