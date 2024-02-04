import { describe, it, expect } from 'vitest'
import { getUnsolvedCells } from '../getUnsolvedCells.js'
import { toGrid } from '../toGrid.js'
import { emptyGrid } from '../constants.js'

describe('getEmptyCells', () => {
  it('returns the numbers 0...80 for an empty grid', () => {
    expect(getUnsolvedCells(emptyGrid)).toEqual(Array.from(Array(81).keys()))
  })

  it('returns empty array if there are no empty cells ', () => {
    const grid = toGrid(`
      1 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 8 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 2 3 4
      8 9 1 2 3 4 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 9 1 2 3 4 5
      9 1 2 3 4 5 6 7 8
    `)
    expect(getUnsolvedCells(grid)).toEqual([])
  })

  it('returns the indexes of empty cells', () => {
    const grid = toGrid(`
      1 2 3 . 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 8 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 2 3 4
      8 9 1 2 3 . 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 9 1 2 3 4 5
      9 1 2 3 4 5 . 7 8
    `)
    expect(getUnsolvedCells(grid)).toEqual([3, 50, 78])
  })
})