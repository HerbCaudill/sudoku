import { Grid } from '../types.js'

export const printGrid = (grid: Grid) => {
  let result = ''
  for (let i = 0; i < 81; i += 1) {
    result += ' '
    result += grid[i] === 0 ? '.' : grid[i]
    if (i % 3 === 2) result += ' '
    if (i % 9 === 8) result += '\n'
  }
  return result
}
