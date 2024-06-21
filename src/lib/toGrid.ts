import { Grid } from '../types'

export const toGrid = (str: string) => {
  const grid = str
    .trim()
    .split(/\s*/)
    .map(n => (isNumeric(n) ? Number(n) : 0)) as Grid
  return cells.map(i => grid[i] ?? 0)
}

export const isNumeric = (n: string) => !isNaN(parseFloat(n.trim()))

const cells = Array.from({ length: 81 }, (_, i) => i)
