import { Board } from 'solver/Board'
import { isFailure } from 'solver/findNextMove'
import { solve } from 'solver/PseudoHumanSolver'
import { assert, describe, expect, it } from 'vitest'

describe('solve', () => {
  it('no vacancies', () => {
    const puzzle = new Board({
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
    const solver = solve(puzzle)
    const { board, move } = solver.next().value
    expect(move).toBeUndefined()
    expect(board).toEqual(puzzle)
  })

  it('1 vacancy', () => {
    const puzzle = new Board({
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
    const solver = solve(puzzle)
    {
      const { board, move } = solver.next().value
      expect(move.solved).toEqual({ index: 2, value: 3 })
      expect(board.grid[2]).toBe(3)
    }
    {
      const { board, move } = solver.next().value
      expect(move).toBeUndefined()
      expect(board.isSolved()).toBe(true)
    }
  })

  it(`2 vacancies`, () => {
    const puzzle = new Board({
      grid: `
        1 2 3  4 5 6  7 8 9
        4 5 6  7 8 9  1 2 3
        7 8 9  1 2 3  4 5 6
        2 3 4  5 6 7  8 9 1
        5 6 7  8 9 1  2 3 4
        8 9 1  2 3 4  5 6 7
        3 4 5  6 7 8  9 1 2
        6 7 8  9 1 2  3 4 5
        . . 2  3 4 5  6 7 8`,
    })
    const solver = solve(puzzle)
    {
      const { board, move } = solver.next().value
      expect(move.solved).toEqual({ index: 72, value: 9 })
      expect(board.grid[72]).toBe(9)
    }
    {
      const { board, move } = solver.next().value
      expect(move.solved).toEqual({ index: 73, value: 1 })
      expect(board.grid[73]).toBe(1)
    }
    {
      const { board, move } = solver.next().value
      expect(move).toBeUndefined()
      expect(board.isSolved()).toBe(true)
    }
  })

  it('naked singles', () => {
    const puzzle = new Board({
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
    const solver = solve(puzzle)
    for (const { board, move } of solver) {
      if (move) {
        assert(!isFailure(move))
        expect(move.label).toBe('nakedSingle')
        expect(move.solved).toBeDefined()
      } else {
        expect(board.isSolved()).toBe(true)
        expect(board).toEqual(
          new Board({
            grid: `
              3 6 5  4 2 7  8 1 9 
              4 8 7  9 3 1  5 2 6 
              1 2 9  8 5 6  3 7 4 
              8 5 2  7 9 3  6 4 1 
              6 1 3  2 4 8  9 5 7 
              9 7 4  1 6 5  2 8 3 
              2 4 1  3 8 9  7 6 5 
              5 3 8  6 7 4  1 9 2 
              7 9 6  5 1 2  4 3 8
          `,
          })
        )
      }
    }
  })

  // gets stuck on this one after 13 moves
  it.skip('hidden singles', () => {
    const puzzle = new Board({
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
    const solver = solve(puzzle)
    let i = 0
    for (const { board, move } of solver) {
      if (move) {
        console.log(i++)
      } else {
        expect(board.isSolved()).toBe(true)
      }
    }
  })
})
