import { describe, it, expect, assert } from 'vitest'
import { toGrid } from '../toGrid.js'
import { logicalSolver } from '../logicalSolver.js'
import { printCandidates } from '../printCandidates.js'

describe('LogicalSolver', () => {
  it('cracking the cryptic #1', () => {
    const grid = toGrid(`
      7 . 4  . . 6  . . 9 
      . 8 .  . 1 .  . . . 
      . . 3  . 2 .  4 5 . 
      . . .  . . .  . . 2 
      . 5 6  . . .  7 8 . 
      1 . .  . . .  . . . 
      . 2 5  . 3 .  1 . . 
      . . .  . 4 .  . 6 . 
      9 . .  5 . .  3 . 7 `)
    const { failed, solved } = logicalSolver(grid)
    // the puzzle is completely solved
    expect(solved).toBe(true)
  })

  it('cracking the cryptic #19', () => {
    const grid = toGrid(`
    . . 2  . . 6  7 . 5
    . . .  . . .  6 1 .
    . . .  . 1 3  8 . .
    . . 3  9 8 .  . 4 .
    . . .  . . .  . . .
    . 6 .  . 5 2  3 . .
    . . 4  2 9 .  . . .
    . 7 9  . . .  . . .
    3 . 8  6 . .  4 . .
    `)
    const { candidates, solved } = logicalSolver(grid)
    expect(solved).toBe(true)
  })

  it('cracking the cryptic #28', () => {
    const grid = toGrid(`
    . . . 6 . . . . 5
    . . 2 . . . 1 . .
    . 5 . . 7 8 . . .
    6 . . 4 . . . . .
    . . 1 . 8 . 3 . .
    8 . . . . 7 . . 4
    . 2 . 9 4 . . 3 .
    . . 3 . . . 6 . .
    7 . . . . 5 . . .
    `)

    const { solved } = logicalSolver(grid)
    expect(solved).toBe(true)
  })

  it(`cracking the cryptic #100`, () => {
    const grid = toGrid(`
    2 . .  . 7 .  1 . 3
    . 7 .  . 8 .  . 5 .
    3 . .  . . 6  . . .
    . . 6  . . .  . . .
    9 1 .  . 5 .  . 2 8
    . . .  . . .  5 . .
    . . .  3 . .  . . 4
    . 2 .  . 9 .  . 7 .
    5 . 4  . 1 .  . . 6 `)
    const { candidates, failed } = logicalSolver(grid)
    assert(!failed)
    expect(printCandidates(candidates).slice(1)).toMatchInlineSnapshot(`
      "━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┓ 
      ┃       │       │       ┃       │       │       ┃       │       │       ┃ 
      ┃   2   │ 4   6 │   5   ┃ 4 5   │   7   │ 4     ┃   1   │ 4   6 │   3   ┃ 
      ┃       │   8 9 │   8 9 ┃     9 │       │     9 ┃       │   8 9 │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃ 1     │       │ 1     ┃ 1 2   │       │       ┃       │       │   2   ┃ 
      ┃ 4   6 │   7   │       ┃ 4     │   8   │   3   ┃ 4   6 │   5   │       ┃ 
      ┃       │       │     9 ┃     9 │       │       ┃     9 │       │     9 ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │       │ 1     ┃ 1 2   │   2   │       ┃       │       │   2   ┃ 
      ┃   3   │ 4     │   5   ┃ 4 5   │ 4     │   6   ┃ 4     │ 4     │       ┃ 
      ┃       │   8 9 │   8 9 ┃     9 │       │       ┃ 7 8 9 │   8 9 │ 7   9 ┃ 
      ┣━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫ 
      ┃       │       │       ┃   2   │   2 3 │ 1 2   ┃     3 │     3 │ 1     ┃ 
      ┃ 4     │   5   │   6   ┃ 4     │ 4     │ 4     ┃ 4     │ 4     │       ┃ 
      ┃ 7 8   │       │       ┃ 7 8 9 │       │ 7 8 9 ┃ 7   9 │     9 │ 7   9 ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │       │     3 ┃       │       │       ┃     3 │       │       ┃ 
      ┃   9   │   1   │       ┃ 4   6 │   5   │ 4     ┃ 4   6 │   2   │   8   ┃ 
      ┃       │       │ 7     ┃ 7     │       │ 7     ┃ 7     │       │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │     3 │       ┃       │     3 │ 1     ┃       │     3 │ 1     ┃ 
      ┃ 4     │ 4     │   2   ┃ 4   6 │ 4   6 │ 4     ┃   5   │ 4   6 │       ┃ 
      ┃ 7 8   │   8   │       ┃ 7 8 9 │       │ 7 8 9 ┃       │     9 │ 7   9 ┃ 
      ┣━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫ 
      ┃       │       │       ┃       │   2   │       ┃   2   │       │       ┃ 
      ┃     6 │     6 │       ┃   3   │     6 │   5   ┃       │   1   │   4   ┃ 
      ┃ 7 8   │   8 9 │ 7 8 9 ┃       │       │       ┃   8 9 │       │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃ 1     │       │ 1   3 ┃       │       │       ┃     3 │       │       ┃ 
      ┃     6 │   2   │       ┃ 4   6 │   9   │ 4     ┃       │   7   │   5   ┃ 
      ┃   8   │       │   8   ┃   8   │       │   8   ┃   8   │       │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │     3 │       ┃   2   │       │   2   ┃   2 3 │     3 │       ┃ 
      ┃   5   │       │   4   ┃       │   1   │       ┃       │       │   6   ┃ 
      ┃       │   8 9 │       ┃ 7 8   │       │ 7 8   ┃   8 9 │   8 9 │       ┃ 
      ┗━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┛ "
    `)
  })
})

describe('contradictions', () => {
  // these all modify the easy puzzle in the first test

  it('no candidates for a cell', () => {
    const grid = toGrid(`
      .  1  2   3  4  5   .  .  . 
      .  .  .   .  1  .   .  .  . 
      . [1] 3   .  2  .   4  5  . 
      .  .  .   .  .  .   .  .  2 
      .  5  6   .  .  .   7  8  . 
      1  .  .   .  .  .   .  .  . 
      .  2  5   .  3  .   1  .  . 
      .  .  .   .  4  .   .  6  . 
      9  .  .   5  .  .   3  .  7 `)
    // r1c2's only candidate was 1, but we put 1 in r3c2 and now r1c2 has no candidates
    const solver = logicalSolver(grid)
    expect(solver.failed).toBe(true)
  })

  it('no candidates for a value in a row', () => {
    const grid = toGrid(`
        7  .  4   . (.) 6   .  .  9 
        .  8  .   .  1 [5]  .  .  . 
        .  .  3   .  2  .   4  5  . 
        .  .  .   .  .  .   .  .  2 
        .  5  6   .  .  .   7  8  . 
        1  .  .   .  .  .   .  .  . 
        .  2  5   .  3  .   1  .  . 
        .  .  .   .  4  .   .  6  . 
        9  .  .   5  .  .   3  .  7 `)
    // in row 1, 5 could only go in r1c5; but we put a 5 in r2c6
    // so now there's no place for a 5 in row 1
    const solver = logicalSolver(grid)
    expect(solver.failed).toBe(true)
  })

  it('no candidates for a value in a column', () => {
    const grid = toGrid(`
        7  .  4   .  .  6   .  .  9 
        .  8  .  [7] 1  .   . (.) . 
        .  .  3   .  2  .   4  5  . 
        .  .  .   .  .  .   .  .  2 
        .  5  6   .  .  .   7  8  . 
        1  .  .   .  .  .   .  .  . 
        .  2  5   .  3  .   1  .  . 
        .  .  .   .  4  .   .  6  . 
        9  .  .   5  .  .   3  .  7 `)
    // in column 8, 7 could only go in r2c8; but we put a 7 in r2c4
    // so now there's no place for a 7 in column 8
    const solver = logicalSolver(grid)
    expect(solver.failed).toBe(true)
  })

  it('no candidates for a value in a box', () => {
    const grid = toGrid(`
        7  .  4   .  .  6   .  .  9 
        .  8  .   .  1  .   .  .  . 
        .  .  3   .  2  .   4  5  . 
        .  .  .  [6] .  .   .  .  2 
        .  5  6   .  .  .   7  8  . 
        1  .  .   .  .  .   .  .  . 
        .  2  5  (.) 3  .   1  .  . 
        .  .  .   .  4  .   .  6  . 
        9 [6] .   5 (.) .   3  .  7 `)
    // in box 8, 6 could only go in r7c4 and r9c5; but we put 6s in r9c2 and r4c4
    // so now there's no place for 6 in box 8
    const solver = logicalSolver(grid)
    expect(solver.failed).toBe(true)
  })

  it('two cells with the same single candidate in a row', () => {
    const grid = toGrid(`
        7  .  4   .  .  6   .  .  9 
        .  8  .   .  1  .   .  .  . 
        .  .  3   .  2  .   4  5  . 
        .  .  .   .  .  .   .  .  2 
        .  5  6   .  .  .   7  8  . 
        7  .  .   .  .  .   .  .  . 
        .  2  5   .  3  .   1  .  . 
        .  .  .   .  4  .   .  6  . 
        9  .  .   5  .  .   3  .  7 `)
    // r6c1 and r1c1 both have 7 as their only candidate
    const solver = logicalSolver(grid)
    expect(solver.failed).toBe(true)
  })
})
