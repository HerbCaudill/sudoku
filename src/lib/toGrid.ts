import { Grid } from '../types.js'

export const toGrid = (str: string) =>
  str
    .trim()
    .split(/\s*/)
    .map(n => (!isNumeric(n) ? 0 : Number(n))) as Grid

export const isNumeric = (n: string) => !isNaN(parseFloat(n.trim()))
