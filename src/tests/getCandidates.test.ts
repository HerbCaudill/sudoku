import { describe, expect, it } from 'vitest'
import { getCandidates } from '../getCandidates.js'
import { toGrid } from '../toGrid.js'

describe('getCandidates', () => {
  it('works when there is only one possibility', () => {
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
    expect(getCandidates(grid, 2)).toEqual([3])
  })

  it('works when there are no constraints', () => {
    const grid = toGrid(`
      . ? . . . . . . .
      . . . 7 8 9 1 2 3
      . . . 1 2 3 4 5 6
      2 . 4 5 6 7 8 9 1
      5 . 7 8 9 1 2 3 4
      8 . 1 2 3 4 5 6 7
      3 . 5 6 7 8 9 1 2
      6 . 8 9 1 2 3 4 5
      9 . 2 3 4 5 6 7 8
    `)
    expect(getCandidates(grid, 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
