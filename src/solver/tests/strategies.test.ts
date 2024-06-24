import { Board } from 'solver/Board'
import { strategies } from 'solver/strategies'
import { assert, describe, expect, it } from 'vitest'

describe('naked tuples', () => {
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
    const { matches, removals } = strategies.nakedDouble(board)!
    expect(matches).toEqual([
      { cell: 0, value: 1 },
      { cell: 0, value: 2 },
      { cell: 2, value: 1 },
      { cell: 2, value: 2 },
    ])
    expect(removals).toEqual([
      { cell: 1, value: 2 },
      { cell: 5, value: 1 },
      { cell: 5, value: 2 },
      { cell: 6, value: 1 },
    ])
  })

  it('finds naked doubles in a box', () => {
    const board = new Board({
      candidates: `
        12  .  .   . . . . . .
        .   12 134 . . . . . .
        234 .  123 . . . . . .
        .   .  .   . . . . . .
        .   .  .   . . . . . .
        .   .  .   . . . . . .
        .   .  .   . . . . . .
        .   .  .   . . . . . .
        .   .  .   . . . . . .
      `,
    })
    const result = strategies.nakedDouble(board)
    assert(result !== null)
    const { matches, removals } = result
    expect(matches).toEqual([
      { cell: 0, value: 1 },
      { cell: 0, value: 2 },
      { cell: 10, value: 1 },
      { cell: 10, value: 2 },
    ])
    expect(removals).toEqual([
      { cell: 11, value: 1 },
      { cell: 18, value: 2 },
      { cell: 20, value: 1 },
      { cell: 20, value: 2 },
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
    const result = strategies.nakedDouble(board)
    assert(result !== null)
    expect(result.removals).toEqual([
      { cell: 18, value: 1 },
      { cell: 45, value: 1 },
      { cell: 45, value: 2 },
      { cell: 63, value: 2 },
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
    const result = strategies.nakedDouble(board)
    expect(result).toBeNull()
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
    const { matches, removals } = strategies.hiddenSingle(board)!
    expect(matches).toEqual([{ cell: 3, value: 1 }])
    expect(removals).toEqual([
      { cell: 3, value: 2 },
      { cell: 3, value: 3 },
      { cell: 3, value: 4 },
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
    const { matches, removals } = strategies.hiddenDouble(board)!
    expect(matches).toEqual([
      { cell: 2, value: 1 },
      { cell: 2, value: 2 },
      { cell: 3, value: 1 },
      { cell: 3, value: 2 },
    ])
    expect(removals).toEqual([
      { cell: 2, value: 3 },
      { cell: 2, value: 4 },
      { cell: 3, value: 3 },
      { cell: 3, value: 4 },
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
    const { matches, removals } = strategies.hiddenTriple(board)!
    expect(matches).toEqual([
      { cell: 2, value: 1 },
      { cell: 2, value: 2 },
      { cell: 2, value: 3 },
      { cell: 3, value: 1 },
      { cell: 3, value: 2 },
      { cell: 3, value: 3 },
      { cell: 4, value: 1 },
      { cell: 4, value: 2 },
      { cell: 4, value: 3 },
    ])
    expect(removals).toEqual([
      { cell: 2, value: 4 },
      { cell: 3, value: 4 },
      { cell: 4, value: 4 },
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
    const result = strategies.hiddenSingle(board)
    expect(result).toBeNull()
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

    const { matches, removals } = strategies.lockedTuple(board)!
    expect(matches).toEqual([
      { cell: 55, value: 2 },
      { cell: 64, value: 2 },
      { cell: 73, value: 2 },
    ])
    expect(removals).toEqual([
      { cell: 1, value: 2 },
      { cell: 10, value: 2 },
      { cell: 19, value: 2 },
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

    const { matches, removals } = strategies.lockedTuple(board)!
    expect(matches).toEqual([
      { cell: 15, value: 2 },
      { cell: 16, value: 2 },
      { cell: 17, value: 2 },
    ])
    expect(removals).toEqual([
      { cell: 9, value: 2 },
      { cell: 10, value: 2 },
      { cell: 11, value: 2 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const board = new Board({
      candidates: `
        3 3 3 . . . . . .
        . . . . . . 3 3 3
        3 3 3 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        `,
    })

    const result = strategies.lockedTuple(board)
    expect(result).toBeNull()
  })
})

describe('box line reduction', () => {
  it('finds box line reduction in a row', () => {
    const board = new Board({
      candidates: `
        3 3 .  . . 3  3 . .
        . . .  3 3 3  . . .
        3 3 .  3 3 .  3 . 3
        . . .  . . .  . . .
        3 3 .  . . .  . . .
        . . .  . . .  . . .
        . . .  . . .  . . .
        . . .  . . .  . . .
        . . .  . . .  . . .
        `,
    })

    const result = strategies.boxLineReduction(board)
    expect(result).toEqual({
      matches: [
        { cell: 12, value: 3 },
        { cell: 13, value: 3 },
        { cell: 14, value: 3 },
      ],
      removals: [
        { cell: 5, value: 3 },
        { cell: 21, value: 3 },
        { cell: 22, value: 3 },
      ],
    })
  })
})
