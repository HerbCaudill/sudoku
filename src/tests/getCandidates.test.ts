import { describe, it, expect, assert } from 'vitest'
import { toGrid } from '../toGrid.js'
import { getCandidates } from '../getCandidatesNew.js'
import { printCandidates } from '../printCandidates.js'

describe('getCandidates', () => {
  it('finds candidates for an easy puzzle', () => {
    // cracking the cryptic #1
    const grid = toGrid(`
      7  .  4   .  .  6   .  .  9 
      .  8  .   .  1  .   .  .  . 
      .  .  3   .  2  .   4  5  . 
      .  .  .   .  .  .   .  .  2 
      .  5  6   .  .  .   7  8  . 
      1  .  .   .  .  .   .  .  . 
      .  2  5   .  3  .   1  .  . 
      .  .  .   .  4  .   .  6  . 
      9  .  .   5  .  .   3  .  7 `)
    const candidates = getCandidates(grid)
    assert(candidates)
    expect(printCandidates(candidates).slice(1)).toMatchInlineSnapshot(`
      "━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┓ 
      ┃       │       │       ┃     3 │       │       ┃   2   │ 1 2 3 │       ┃ 
      ┃   7   │   1   │   4   ┃       │   5   │   6   ┃       │       │   9   ┃ 
      ┃       │       │       ┃   8   │   8   │       ┃   8   │       │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃   2   │       │   2   ┃     3 │       │     3 ┃   2   │   2 3 │     3 ┃ 
      ┃   5 6 │   8   │       ┃ 4     │   1   │ 4 5   ┃     6 │       │     6 ┃ 
      ┃       │       │     9 ┃ 7   9 │       │ 7   9 ┃       │ 7     │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │ 1     │       ┃       │       │       ┃       │       │ 1     ┃ 
      ┃   6   │     6 │   3   ┃       │   2   │       ┃   4   │   5   │     6 ┃ 
      ┃       │     9 │       ┃ 7 8 9 │       │ 7 8 9 ┃       │       │   8   ┃ 
      ┣━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫ 
      ┃     3 │     3 │       ┃ 1   3 │       │ 1   3 ┃       │ 1   3 │       ┃ 
      ┃ 4     │ 4     │       ┃ 4   6 │   5 6 │ 4 5   ┃   5 6 │ 4     │   2   ┃ 
      ┃   8   │ 7   9 │ 7 8 9 ┃ 7 8 9 │ 7 8 9 │ 7 8 9 ┃     9 │     9 │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃   2 3 │       │       ┃ 1 2 3 │       │ 1 2 3 ┃       │       │ 1   3 ┃ 
      ┃ 4     │   5   │   6   ┃ 4     │   9   │ 4     ┃   7   │   8   │ 4     ┃ 
      ┃       │       │       ┃     9 │       │     9 ┃       │       │       ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │     3 │   2   ┃   2 3 │       │   2 3 ┃       │     3 │     3 ┃ 
      ┃   1   │ 4     │       ┃ 4   6 │   5 6 │ 4 5   ┃   5 6 │ 4     │ 4 5 6 ┃ 
      ┃       │ 7   9 │ 7 8 9 ┃ 7 8 9 │ 7 8 9 │ 7 8 9 ┃     9 │     9 │       ┃ 
      ┣━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫ 
      ┃       │       │       ┃       │       │       ┃       │       │       ┃ 
      ┃ 4   6 │   2   │   5   ┃     6 │   3   │       ┃   1   │ 4     │ 4     ┃ 
      ┃   8   │       │       ┃ 7 8 9 │       │ 7 8 9 ┃       │     9 │   8   ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃     3 │ 1   3 │ 1     ┃ 1 2   │       │ 1 2   ┃   2   │       │       ┃ 
      ┃       │       │       ┃       │   4   │       ┃   5   │   6   │   5   ┃ 
      ┃   8   │ 7     │ 7 8   ┃ 7 8 9 │       │ 7 8 9 ┃   8 9 │       │   8   ┃ 
      ┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ ──────┼───────┼───────┃ 
      ┃       │ 1     │ 1     ┃       │       │ 1 2   ┃       │   2   │       ┃ 
      ┃   9   │ 4   6 │       ┃   5   │     6 │       ┃   3   │ 4     │   7   ┃ 
      ┃       │       │   8   ┃       │   8   │   8   ┃       │       │       ┃ 
      ┗━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┛ "
    `)
  })

  describe('contradictions', () => {
    it('no candidates for a cell', () => {
      const grid = toGrid(`
      7 (.) 4   .  .  6   .  .  9 
      .  8  .   .  1  .   .  .  . 
      . [1] 3   .  2  .   4  5  . 
      .  .  .   .  .  .   .  .  2 
      .  5  6   .  .  .   7  8  . 
      1  .  .   .  .  .   .  .  . 
      .  2  5   .  3  .   1  .  . 
      .  .  .   .  4  .   .  6  . 
      9  .  .   5  .  .   3  .  7 `)
      // r1c2's only candidate was 1, but we put 1 in r3c2 and now r1c2 has no candidates
      const candidates = getCandidates(grid)
      expect(candidates).toBe(false)
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
      const candidates = getCandidates(grid)
      expect(candidates).toBe(false)
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
      const candidates = getCandidates(grid)
      expect(candidates).toBe(false)
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
      const candidates = getCandidates(grid)
      expect(candidates).toBe(false)
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
      const candidates = getCandidates(grid)
      expect(candidates).toBe(false)
    })
  })
})
