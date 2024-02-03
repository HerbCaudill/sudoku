import { Grid } from './types.js'

export const getUnsolvedSquares = (grid: Grid) =>
  grid.map((value, index) => (value === 0 ? index : -1)).filter(index => index !== -1)
