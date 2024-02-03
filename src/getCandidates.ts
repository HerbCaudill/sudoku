import { isValidValue } from './isValidValue.js'
import { Grid } from './types.js'

export const getCandidates = (grid: Grid, index: number) => {
  const candidates: number[] = []
  for (let value = 1; value <= 9; value++) {
    if (isValidValue(grid, index, value)) {
      candidates.push(value)
    }
  }
  return candidates
}
