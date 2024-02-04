import { describe, expect, it } from 'vitest'
import { rows } from '../constants.js'
import { box, col, row, unit } from '../units.js'

describe('units', () => {
  it('units', () => {
    expect(unit(rows)(1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(row(1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(col(1)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72])
    expect(box(1)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20])
  })
})
