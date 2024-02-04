import { Grid } from './types.js'

export const getUnsolvedCells = (grid: Grid) => {
  const unsolvedCells = []
  for (let index = 0; index < grid.length; index++) {
    if (grid[index] === 0) {
      unsolvedCells.push(index)
    }
  }
  return unsolvedCells
}
