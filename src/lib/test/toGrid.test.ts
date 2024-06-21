import { describe, expect, it } from 'vitest'
import { toGrid } from 'lib/toGrid'
import { printGrid } from 'lib/printGrid'
import { arraysMatch } from 'lib/arraysMatch'

describe('toGrid', () => {
  it('should fill in missing values', () => {
    const str = '1 2 3 4 5 6 7 8 9'
    const result = toGrid(str)
    expect(
      gridsMatch(
        printGrid(result),
        `1 2 3 4 5 6 7 8 9
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         . . . . . . . . .
         `
      )
    ).toBe(true)
  })
})

const gridsMatch = (a: string, b: string) => arraysMatch(a.trim().split(/\s*/s), b.trim().split(/\s*/s))
