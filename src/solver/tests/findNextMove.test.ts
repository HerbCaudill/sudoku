import { describe, expect, it } from 'vitest'
import { findNextMove } from '../findNextMove.js'
import { Board } from '../Board.js'
import type { Elimination } from 'solver/strategies'

describe('findNextMove', () => {
  it('single vacancy', () => {
    const board = new Board({
      grid: `
        1 2 .  4 5 6  7 8 9
        4 5 6  7 8 9  1 2 3
        7 8 9  1 2 3  4 5 6
        2 3 4  5 6 7  8 9 1
        5 6 7  8 9 1  2 3 4
        8 9 1  2 3 4  5 6 7
        3 4 5  6 7 8  9 1 2
        6 7 8  9 1 2  3 4 5
        9 1 2  3 4 5  6 7 8`,
    })
    const { strategy, solved } = findNextMove(board)
    expect(strategy).toBe('nakedSingles')
    expect(solved).toEqual({ index: 2, value: 3 })
  })

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
    const { strategy, matches } = findNextMove(board) as Elimination
    expect(strategy).toBe('hiddenSingles')
    expect(matches).toEqual([{ index: 15, value: 3 }])
  })
})
