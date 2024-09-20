import { Board } from 'solver/Board'
import { findNextMove, type Success } from 'solver/findNextMove'
import { describe, expect, it } from 'vitest'

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
    const { label, solved } = findNextMove(board) as Success
    expect(label).toBe('nakedSingle')
    expect(solved).toEqual({ index: 2, value: 3 })
  })

  it('no vacancies', () => {
    const board = new Board({
      grid: `
        1 2 3  4 5 6  7 8 9
        4 5 6  7 8 9  1 2 3
        7 8 9  1 2 3  4 5 6
        2 3 4  5 6 7  8 9 1
        5 6 7  8 9 1  2 3 4
        8 9 1  2 3 4  5 6 7
        3 4 5  6 7 8  9 1 2
        6 7 8  9 1 2  3 4 5
        9 1 2  3 4 5  6 7 8`,
    })
    expect(() => findNextMove(board)).toThrow(/solved/)
  })

  it('naked single', () => {
    const board = new Board({
      grid: `
      3 . 5  4 2 .  8 1 . 
      4 8 7  9 . 1  5 . 6 
      . 2 9  . 5 6  3 7 4 
      8 5 .  7 9 3  . 4 1 
      6 1 3  2 . 8  9 5 7 
      . 7 4  . 6 5  2 8 . 
      2 4 1  3 . 9  . 6 5 
      5 . 8  6 7 .  1 9 2 
      . 9 6  5 1 2  4 . 8`,
    })
    const { label, solved } = findNextMove(board) as Success
    expect(label).toBe('nakedSingle')
    expect(solved).toEqual({ index: 1, value: 6 })
  })

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
    const { label, matches } = findNextMove(board) as Success
    expect(label).toBe('hiddenSingle')
    expect(matches).toEqual([{ index: 15, value: 3 }])
  })
})
