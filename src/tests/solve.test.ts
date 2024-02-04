import { assert, describe, expect, it } from 'vitest'
import { Puzzle } from '../Puzzle.js'
import { toGrid } from '../toGrid.js'
import { load } from './helpers/load.js'
import { solve } from './helpers/solve.js'
import { Grid } from '../types.js'
import { printGrid } from '../printGrid.js'

describe('Puzzle.solve', () => {
  it('no vacancies', () => {
    const puzzle = `
      1 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 8 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 2 3 4
      8 9 1 2 3 4 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 9 1 2 3 4 5
      9 1 2 3 4 5 6 7 8
    `
    const result = new Puzzle(puzzle).solve()
    expect(result).toEqual(toGrid(puzzle))
  })

  it('1 vacancy', () => {
    const result = new Puzzle(`
    1 2 . 4 5 6 7 8 9
    4 5 6 7 8 9 1 2 3
    7 8 9 1 2 3 4 5 6
    2 3 4 5 6 7 8 9 1
    5 6 7 8 9 1 2 3 4
    8 9 1 2 3 4 5 6 7
    3 4 5 6 7 8 9 1 2
    6 7 8 9 1 2 3 4 5
    9 1 2 3 4 5 6 7 8
  `).solve()
    assert(result)
    expect(result[2]).toBe(3)
  })

  it('2 vacancies', () => {
    const result = new Puzzle(`
      1 2 3 4 5 6 7 8 9
      4 5 6 7 8 9 1 2 3
      7 8 9 1 2 3 4 5 6
      2 3 4 5 6 7 8 9 1
      5 6 7 8 9 1 2 3 4
      8 9 1 2 3 4 5 6 7
      3 4 5 6 7 8 9 1 2
      6 7 8 9 1 2 3 4 5
      . . 2 3 4 5 6 7 8
    `).solve()
    assert(result)
    expect(result[72]).toBe(9)
    expect(result[73]).toBe(1)
  })

  it('naked singles', () => {
    const result = new Puzzle(`
      3 . 5  4 2 .  8 1 . 
      4 8 7  9 . 1  5 . 6 
      . 2 9  . 5 6  3 7 4 
      8 5 .  7 9 3  . 4 1 
      6 1 3  2 . 8  9 5 7 
      . 7 4  . 6 5  2 8 . 
      2 4 1  3 . 9  . 6 5 
      5 . 8  6 7 .  1 9 2 
      . 9 6  5 1 2  4 . 8 
    `).solve()
    assert(result)
    compare(
      result,
      toGrid(`
        3 6 5  4 2 7  8 1 9 
        4 8 7  9 3 1  5 2 6 
        1 2 9  8 5 6  3 7 4 
        8 5 2  7 9 3  6 4 1 
        6 1 3  2 4 8  9 5 7 
        9 7 4  1 6 5  2 8 3 
        2 4 1  3 8 9  7 6 5 
        5 3 8  6 7 4  1 9 2 
        7 9 6  5 1 2  4 3 8`)
    )
  })

  it('hidden singles', () => {
    const result = new Puzzle(`
      . . 2  . 3 .  . . 8 
      . . .  . . 8  . . . 
      . 3 1  . 2 .  . . . 
      . 6 .  . 5 .  2 7 . 
      . 1 .  . . .  . 5 . 
      2 . 4  . 6 .  . 3 1 
      . . .  . 8 .  6 . 5 
      . . .  . . .  . 1 3 
      . . 5  3 1 .  4 . .
      `).solve()
    assert(result)
    compare(
      result,
      toGrid(`
        6 7 2  4 3 5  1 9 8 
        5 4 9  1 7 8  3 6 2 
        8 3 1  6 2 9  5 4 7 
        3 6 8  9 5 1  2 7 4 
        9 1 7  2 4 3  8 5 6 
        2 5 4  8 6 7  9 3 1 
        1 9 3  7 8 4  6 2 5 
        4 8 6  5 9 2  7 1 3 
        7 2 5  3 1 6  4 8 9 `)
    )
  })

  it('solves an "easy" puzzle', () => {
    const solution = solve(`
      5 3 .  8 . .  6 . . 
      . 4 9  5 . 2  8 3 1 
      . 2 7  1 . .  5 . 9 
      7 5 .  9 . 1  . . 4 
      2 . 8  4 . .  . . 6 
      4 . .  . . 8  . . . 
      . 6 .  . . 3  4 1 . 
      3 . .  . 1 .  . 2 . 
      1 8 .  2 . 4  . . . `)
    expect(printGrid(solution).slice(1)).toMatchInlineSnapshot(`
      "5 3 1  8 4 9  6 7 2 
       6 4 9  5 7 2  8 3 1 
       8 2 7  1 3 6  5 4 9 
       7 5 3  9 6 1  2 8 4 
       2 1 8  4 5 7  3 9 6 
       4 9 6  3 2 8  1 5 7 
       9 6 2  7 8 3  4 1 5 
       3 7 4  6 1 5  9 2 8 
       1 8 5  2 9 4  7 6 3 
      "
    `)
  })

  it('solves a "medium" puzzle', () => {
    solve(`
      3 . .  . 9 .  8 2 . 
      . 1 .  6 . .  . . . 
      . . .  4 3 .  . 7 6 
      . 9 1  . . .  6 4 . 
      . . .  . 2 .  . . 8 
      6 . 8  9 . .  . . . 
      7 . 6  3 . 9  2 5 4 
      1 2 3  5 . 8  . 6 9 
      . 4 .  2 . 7  . . . `)
  })

  it(`solves a "master" puzzle`, () => {
    solve(`
      . . 3  . 1 9  . . 7
      1 2 .  7 . 4  . . 5
      . . .  . . .  . 3 .
      . . .  . 6 8  7 2 .
      . 7 .  . . .  . . .
      2 . .  1 9 .  . . .
      . . 4  . . 6  1 7 .
      . . .  . . .  9 . .
      8 . .  4 7 3  . 5 .`)
  })

  it(`solves a 17-clue puzzle`, () => {
    const solution = solve(`
      . . .  . . .  . . 1 
      . . .  . . 2  . . . 
      . 1 3  . . .  . . 4 
      . . .  . . .  . 2 . 
      . . .  . 5 .  . 6 . 
      . . 7  1 . .  . . . 
      . . .  4 . .  7 . 8 
      . 9 .  . . .  . . . 
      6 2 .  3 . .  . . . `)
    expect(printGrid(solution).slice(1)).toMatchInlineSnapshot(`
      "5 6 2  7 3 4  9 8 1 
       4 7 9  8 1 2  3 5 6 
       8 1 3  6 9 5  2 7 4 
       3 5 6  9 4 8  1 2 7 
       9 4 1  2 5 7  8 6 3 
       2 8 7  1 6 3  5 4 9 
       1 3 5  4 2 6  7 9 8 
       7 9 4  5 8 1  6 3 2 
       6 2 8  3 7 9  4 1 5 
      "
    `)
  })

  it(`solves Arto Inkala's "hardest puzzle ever"`, () => {
    const solution = solve(`
      8 . .   . . .  . . . 
      . . 3   6 . .  . . . 
      . 7 .   . 9 .  2 . . 
      . 5 .   . . 7  . . . 
      . . .   . 4 5  7 . . 
      . . .   1 . .  . 3 . 
      . . 1   . . .  . 6 8 
      . . 8   5 . .  . 1 . 
      . 9 .   . . .  4 . . `)
    expect(printGrid(solution).slice(1)).toMatchInlineSnapshot(`
      "8 1 2  7 5 3  6 4 9 
       9 4 3  6 8 2  1 7 5 
       6 7 5  4 9 1  2 8 3 
       1 5 4  2 3 7  8 9 6 
       3 6 9  8 4 5  7 2 1 
       2 8 7  1 6 9  5 3 4 
       5 2 1  9 7 4  3 6 8 
       4 3 8  5 2 6  9 1 7 
       7 9 6  3 1 8  4 5 2 
      "
    `)
  })

  // 🤷 really does seem impossible
  it.skip(`solves Dr. Norvig's "impossible puzzle"`, () => {
    solve(
      `
      . . .   . . 5   . 8 . 
      . . .   6 . 1   . 4 3 
      . . .   . . .   . . . 
      . 1 .   5 . .   . . . 
      . . .   1 . 6   . . . 
      3 . .   . . .   . . 5 
      5 3 .   . . .   . 6 1 
      . . .   . . .   . . 4 
      . . .   . . .   . . .`
    )
  })

  it(`solves the Project Euler sudoku problem`, () => {
    const puzzles = load('project-euler.txt')
    const solutions = puzzles.map(puzzle => new Puzzle(puzzle).solve())
    const expected = solutions.map(solution => {
      assert(solution)
      return Number(solution.slice(0, 3).join(''))
    })
    expect(sum(expected)).toBe(24702)
  })
})

const compare = (actual: Grid, expected: Grid) => {
  const areEqual = actual.length === expected.length && actual.every((v, i) => v === expected[i])
  if (!areEqual) {
    throw new Error(['Expected:', printGrid(expected), 'Actual:', printGrid(actual)].join('\n'))
  }
}
const sum = (a: number[]) => a.reduce((a, b) => a + b, 0)
