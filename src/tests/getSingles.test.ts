import { describe, expect, it } from 'vitest'
import { emptyGrid } from '../constants.js'
import { getBoxSingles, getColSingles, getRowSingles, getSquareSingles } from '../getSingles.js'
import { toGrid } from '../toGrid.js'

describe('getSquareSingles', () => {
  it('empty grid', () => {
    expect(getSquareSingles(emptyGrid)).toEqual({})
  })

  it('full grid', () => {
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
    expect(getSquareSingles(grid)).toEqual({})
  })

  it('one vacancy', () => {
    const grid = toGrid(`
      1 2 . 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 8 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 2 3 4
      8 9 1 2 3 4 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 9 1 2 3 4 5
      9 1 2 3 4 5 6 7 8
    `)
    expect(getSquareSingles(grid)).toEqual({ 2: 3 })
  })

  it('multiple vacancies', () => {
    const grid = toGrid(`
      . 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 . 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 . 3 4
      8 9 . 2 3 4 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 . 1 2 3 4 5
      9 1 2 3 4 . 6 7 8
    `)

    expect(getSquareSingles(grid)).toEqual({
      0: 1, //
      19: 8,
      42: 2,
      47: 1,
      66: 9,
      77: 5,
    })
  })

  it('easy puzzle ', () => {
    const grid = toGrid(`
      . . 3 . 2 . 6 . .
      9 . . 3 . 5 . . 1
      . . 1 8 . 6 4 . .
      . . 8 1 . 2 9 . .
      7 . . . . . . . 8
      . . 6 7 . 8 2 . .
      . . 2 6 . 9 5 . .
      8 . . 2 . 3 . . 9
      . . 5 . 1 . 3 . .
    `)

    expect(getSquareSingles(grid)).toEqual({
      41: 4,
      42: 1,
      75: 4,
    })

    expect(getRowSingles(grid)).toEqual({
      5: 1,
      10: 6,
      37: 2,
      67: 5,
      73: 9,
      79: 8,
    })

    expect(getColSingles(grid)).toEqual({
      5: 1,
      15: 8,
      18: 2,
      38: 9,
      39: 5,
      58: 8,
      72: 6,
    })

    expect(getBoxSingles(grid)).toEqual({
      5: 1,
      10: 6,
      37: 2,
      58: 8,
      67: 5,
      73: 9,
    })
  })
})
