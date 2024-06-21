import { Grid } from 'types'

export const getUnsolved = (grid: Grid) =>
  grid
    .map((cell, index) => (cell === 0 ? index : -1)) //
    .filter(index => index !== -1)
