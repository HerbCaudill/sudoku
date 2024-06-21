import { describe, expect, it } from 'vitest'
import { generate } from 'solver/generate'
import { printGrid } from 'lib/printGrid'
import { makeRandom } from '@herbcaudill/random'

describe('generate', () => {
  it('generates a puzzle and a solution', () => {
    const { solution, puzzle } = generate('generate-test-1')

    expect(printGrid(puzzle).slice(1)).toMatchInlineSnapshot(`
      ". . .  . . .  . 9 . 
       . 8 .  . . .  . 5 6 
       6 2 .  . 3 8  7 4 . 
       1 7 .  . . .  . 2 3 
       2 6 .  4 . .  . . . 
       . . .  2 . 7  . 8 5 
       8 . 6  . . .  . 7 9 
       . 9 .  1 . 4  . . 8 
       . 1 3  . 8 9  2 . . 
      "
    `)

    expect(printGrid(solution).slice(1)).toMatchInlineSnapshot(`
      "3 5 7  6 4 1  8 9 2 
       4 8 1  9 7 2  3 5 6 
       6 2 9  5 3 8  7 4 1 
       1 7 5  8 9 6  4 2 3 
       2 6 8  4 5 3  9 1 7 
       9 3 4  2 1 7  6 8 5 
       8 4 6  3 2 5  1 7 9 
       7 9 2  1 6 4  5 3 8 
       5 1 3  7 8 9  2 6 4 
      "
    `)
  })

  it.skip('see if we ever generate puzzles with multiple solutions', () => {
    const random = makeRandom('generate-test-2')
    const times = [] as number[]
    const N = 10
    for (let i = 0; i < N; i++) {
      const start = performance.now()

      const { solution, puzzle } = generate(random.alpha())

      const end = performance.now()
      times.push(end - start)
    }
    console.log(`average: ${(times.reduce((a, b) => a + b, 0) / N).toFixed(0)}ms`)
    console.log(`max: ${Math.max(...times).toFixed(0)}ms`)
  })
})
