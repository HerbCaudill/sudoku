import { Grid } from 'types'
import { isNumeric } from './isNumeric'

export const stringToGrid = (str: string) => {
  const grid = str
    .trim()
    .split(/\s*/)
    .map(n => (isNumeric(n) ? Number(n) : 0)) as Grid
  return cells.map(i => grid[i] ?? 0)
}

const cells = Array.from({ length: 81 }, (_, i) => i)
