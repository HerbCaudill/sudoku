import { describe, expect, it } from 'vitest'
import { findNextMove, strategies } from '../strategies.js'
import { Board } from '../Board'

describe('naked tuples', () => {
  it('finds naked singles in a row', () => {
    const board = new Board({
      candidates: `
      1 1234 1234 . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      `,
    })
    const { matches, removals } = strategies.nakedSingles(board)
    expect(matches).toEqual([{ index: 0, value: 1 }])
    expect(removals).toEqual([
      { index: 1, value: 1 },
      { index: 2, value: 1 },
    ])
  })

  it('finds naked doubles in a row', () => {
    const board = new Board({
      candidates: `
      12 234 12 . . 123 134 . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      `,
    })
    const { matches, removals } = strategies.nakedDoubles(board)
    expect(matches).toEqual([
      { index: 0, value: 1 },
      { index: 0, value: 2 },
      { index: 2, value: 1 },
      { index: 2, value: 2 },
    ])
    expect(removals).toEqual([
      { index: 1, value: 2 },
      { index: 5, value: 1 },
      { index: 5, value: 2 },
      { index: 6, value: 1 },
    ])
  })

  it('finds naked doubles in a box', () => {
    const board = new Board({
      candidates: `
        12  .  .   . . . . . .
        .   12 134 . . . . . .
        234 .  123 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
      `,
    })
    const { matches, removals } = strategies.nakedDoubles(board)
    expect(matches).toEqual([
      { index: 0, value: 1 },
      { index: 0, value: 2 },
      { index: 10, value: 1 },
      { index: 10, value: 2 },
    ])
    expect(removals).toEqual([
      { index: 11, value: 1 },
      { index: 18, value: 2 },
      { index: 20, value: 1 },
      { index: 20, value: 2 },
    ])
  })

  it('finds naked doubles in a column', () => {
    const board = new Board({
      candidates: `
        12  . . . . . . . .
        12  . . . . . . . .
        134 . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        123 . . . . . . . .
        .   . . . . . . . .
        234 . . . . . . . .
        .   . . . . . . . .
      `,
    })
    const { matches, removals } = strategies.nakedDoubles(board)
    expect(removals).toEqual([
      { index: 18, value: 1 },
      { index: 45, value: 1 },
      { index: 45, value: 2 },
      { index: 63, value: 2 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const board = new Board({
      candidates: `
        12  . . . . . . . .
        12  . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
      `,
    })
    const { matches, removals } = strategies.nakedDoubles(board)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})

describe('hidden tuples', () => {
  it(`finds hidden singles`, () => {
    const board = new Board({
      candidates: `
     234  234  234  1234 234  234  234  234 } 234
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
      `,
    })
    const { matches, removals } = strategies.hiddenSingles(board)
    expect(matches).toEqual([{ index: 3, value: 1 }])
    expect(removals).toEqual([
      { index: 3, value: 2 },
      { index: 3, value: 3 },
      { index: 3, value: 4 },
    ])
  })

  it(`finds hidden doubles`, () => {
    const board = new Board({
      candidates: `
      34   34   1234 1234 34   34   34   34   34 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      `,
    })
    const { matches, removals } = strategies.hiddenDoubles(board)
    expect(matches).toEqual([
      { index: 2, value: 1 },
      { index: 2, value: 2 },
      { index: 3, value: 1 },
      { index: 3, value: 2 },
    ])
    expect(removals).toEqual([
      { index: 2, value: 3 },
      { index: 2, value: 4 },
      { index: 3, value: 3 },
      { index: 3, value: 4 },
    ])
  })

  it('finds hidden triples', () => {
    const board = new Board({
      candidates: `
    4    4    1234 1234 1234 4    4    4 }   4  
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    `,
    })
    const { matches, removals } = strategies.hiddenTriples(board)
    expect(matches).toEqual([
      { index: 2, value: 1 },
      { index: 2, value: 2 },
      { index: 2, value: 3 },
      { index: 3, value: 1 },
      { index: 3, value: 2 },
      { index: 3, value: 3 },
      { index: 4, value: 1 },
      { index: 4, value: 2 },
      { index: 4, value: 3 },
    ])
    expect(removals).toEqual([
      { index: 2, value: 4 },
      { index: 3, value: 4 },
      { index: 4, value: 4 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const board = new Board({
      candidates: `
    234  234  234  1    234  234  234  234 } 234
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
   `,
    })
    const { matches, removals } = strategies.hiddenSingles(board)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})

describe('locked tuples', () => {
  it('finds locked tuples in a row', () => {
    const board = new Board({
      candidates: `
        2 2 2 . . . . . .
        2 2 2 . . . . . .
        2 2 2 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . 2 . . . . . . .
        . 2 . . . . . . .
        . 2 . . . . . . .
        `,
    })

    const { matches, removals } = strategies.lockedTuples(board)
    expect(matches).toEqual([
      { index: 55, value: 2 },
      { index: 64, value: 2 },
      { index: 73, value: 2 },
    ])
    expect(removals).toEqual([
      { index: 1, value: 2 },
      { index: 10, value: 2 },
      { index: 19, value: 2 },
    ])
  })

  it('finds locked tuples in a column', () => {
    const board = new Board({
      candidates: `
        2 2 2 . . . . . .
        2 2 2 . . . 2 2 2
        2 2 2 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        `,
    })

    const { matches, removals } = strategies.lockedTuples(board)
    expect(matches).toEqual([
      { index: 15, value: 2 },
      { index: 16, value: 2 },
      { index: 17, value: 2 },
    ])
    expect(removals).toEqual([
      { index: 9, value: 2 },
      { index: 10, value: 2 },
      { index: 11, value: 2 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const board = new Board({
      candidates: `
        3 3 3 . . . . . .
        3 3 3 . . . 2 2 2
        3 3 3 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        `,
    })

    const { matches, removals } = strategies.lockedTuples(board)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})

describe('findNextMove', () => {
  it('naked single', () => {})

  it('hidden single', () => {
    const board = new Board({
      grid: `
      . . 2  . 3 .  . . 8 
      . . .  . . 8  . . . 
      . 3 1  . 2 .  . . . 
      . 6 .  . 5 .  2 7 . 
      . 1 .  . . .  . 5 . 
      2 . 4  . 6 .  . 3 1 
      . . .  . 8 .  6 . 5 
      . . .  . . .  . 1 3 
      . . 5  3 1 .  4 . .`,
    })
    const { strategy, result } = findNextMove(board)
    expect(strategy.label).toBe('hiddenSingles')
    expect(result.matches).toEqual([{ index: 15, value: 3 }])
  })
})
