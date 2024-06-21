import { Grid } from '../types.js'

export const toGrid = (str: string) =>
  str
    .trim()
    .split(/\s*/)
    .map(n => (isNumeric(n) ? Number(n) : 0)) as Grid

export const isNumeric = (n: string) => !isNaN(parseFloat(n.trim()))
