import { toGrid } from './helpers/toGrid.js'
import { Grid } from './types.js'

export const rows: Grid = toGrid(`
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

export const cols: Grid = toGrid(`
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

export const boxes: Grid = toGrid(`
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

export const emptyGrid: Grid = toGrid(`
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

export const cells = Object.keys(emptyGrid).map(Number)
