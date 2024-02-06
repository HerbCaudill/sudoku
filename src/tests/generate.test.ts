import { describe, expect, it } from 'vitest'
import { generate } from '../generate.js'
import { printGrid } from '../helpers/printGrid.js'
import { makeRandom } from '@herbcaudill/random'

describe('generate', () => {
  it('generates a puzzle and a solution', () => {
    const start = performance.now()
    const { solution, puzzle } = generate('generate-test-1')
    const end = performance.now()
    console.log(`Time to generate: ${(end - start).toFixed(2)}ms`)

    expect(printGrid(puzzle).slice(1)).toMatchInlineSnapshot(`
      "3 5 7  6 . 1  8 9 2 
       . . 1  9 . 2  3 5 . 
       6 2 9  5 3 .  7 4 1 
       1 7 5  8 9 .  4 2 3 
       2 6 .  4 5 3  9 1 7 
       . . 3  . 1 7  6 8 5 
       5 3 6  1 . 9  2 7 4 
       7 9 4  3 2 5  1 6 . 
       8 1 .  7 6 .  5 . . 
      "
    `)

    expect(printGrid(solution).slice(1)).toMatchInlineSnapshot(`
      "3 5 7  6 4 1  8 9 2 
       4 8 1  9 7 2  3 5 6 
       6 2 9  5 3 8  7 4 1 
       1 7 5  8 9 6  4 2 3 
       2 6 8  4 5 3  9 1 7 
       9 4 3  2 1 7  6 8 5 
       5 3 6  1 8 9  2 7 4 
       7 9 4  3 2 5  1 6 8 
       8 1 2  7 6 4  5 3 9 
      "
    `)
  })

  it('see if we every generate puzzles with multiple solutions', () => {
    const random = makeRandom('generate-test-2')
    for (let i = 0; i < 100; i++) {
      const { solution, puzzle } = generate(random.alpha())
    }
  })
})
