import { describe, expect, it } from 'vitest'
import { groupReducer } from 'lib/group'

describe('groupReducer', () => {
  const unitCandidates = [
    { value: 1, cell: 0 },
    { value: 1, cell: 10 },
    { value: 1, cell: 11 },
    { value: 1, cell: 20 },
    { value: 2, cell: 0 },
    { value: 2, cell: 10 },
    { value: 2, cell: 18 },
    { value: 2, cell: 20 },
    { value: 3, cell: 11 },
    { value: 3, cell: 18 },
    { value: 3, cell: 20 },
    { value: 4, cell: 11 },
    { value: 4, cell: 18 },
    { value: 5, cell: 2 },
    { value: 6, cell: 2 },
  ]

  it('groups cells by value', () => {
    const cellByValue = unitCandidates.reduce(
      groupReducer(
        d => d.cell,
        d => d.value
      ),
      {}
    )
    expect(cellByValue).toEqual({
      0: [1, 2],
      2: [5, 6],
      10: [1, 2],
      11: [1, 3, 4],
      18: [2, 3, 4],
      20: [1, 2, 3],
    })
  })

  it('groups values by cell', () => {
    const valueByCell = unitCandidates.reduce(
      groupReducer(
        d => d.value,
        d => d.cell
      ),
      {}
    )
    expect(valueByCell).toEqual({
      1: [0, 10, 11, 20],
      2: [0, 10, 18, 20],
      3: [11, 18, 20],
      4: [11, 18],
      5: [2],
      6: [2],
    })
  })
})
