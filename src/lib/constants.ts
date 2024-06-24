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

/** returns the indices of all elements of row/col/box #n */

export const unit = (unitMap: Grid) => (i: number) => {
  return unitMap
    .map((index, cell) => [index, cell])
    .filter(([index]) => index === i) // only include the units with index n
    .map(([_, cell]) => cell) // only return the cells
}

export const row = unit(rows)
export const col = unit(cols)
export const box = unit(boxes)

export const unitByType = { row, col, box }

export const unitTypes = ['row', 'col', 'box'] as const
export const lineTypes = ['row', 'col'] as const

export const units = unitTypes.flatMap(unitType => numbers.map(i => unitByType[unitType](i)))
export const lines = lineTypes.flatMap(lineType => numbers.map(i => unitByType[lineType](i)))
