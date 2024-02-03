import { peers } from './peers.js'
import { Grid } from './types.js'

export const isValidValue = (grid: Grid, index: number, value: number) => {
  return !peers[index].some(i => grid[i] === value)
}
