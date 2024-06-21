import { stringToGrid } from 'lib/stringToGrid'
import { Grid } from 'types'

export const rows: Grid = stringToGrid(`
  1 1 1 1 1 1 1 1 1 
  2 2 2 2 2 2 2 2 2 
  3 3 3 3 3 3 3 3 3 
  4 4 4 4 4 4 4 4 4 
  5 5 5 5 5 5 5 5 5 
  6 6 6 6 6 6 6 6 6 
  7 7 7 7 7 7 7 7 7 
  8 8 8 8 8 8 8 8 8 
  9 9 9 9 9 9 9 9 9 
`)

export const cols: Grid = stringToGrid(`
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
  1 2 3 4 5 6 7 8 9 
`)

export const boxes: Grid = stringToGrid(`
  1 1 1 2 2 2 3 3 3 
  1 1 1 2 2 2 3 3 3 
  1 1 1 2 2 2 3 3 3 
  4 4 4 5 5 5 6 6 6 
  4 4 4 5 5 5 6 6 6 
  4 4 4 5 5 5 6 6 6 
  7 7 7 8 8 8 9 9 9 
  7 7 7 8 8 8 9 9 9 
  7 7 7 8 8 8 9 9 9 
`)

export const unitLookup = { row: rows, col: cols, box: boxes }

export const emptyGrid: Grid = stringToGrid(`
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
  . . . . . . . . . 
`)

export const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// numbers from 0 to 80
export const cells = Array.from({ length: 81 }, (_, i) => i)
