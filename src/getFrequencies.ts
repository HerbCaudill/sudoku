import { Grid } from './types.js'

export const getFrequencies = (grid: Grid) =>
  grid.reduce<Record<number, number>>((result, value) => {
    if (value) {
      result[value] = (result[value] || 0) + 1
    }
    return result
  }, {})
