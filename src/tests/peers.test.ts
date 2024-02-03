import { describe, it, expect } from 'vitest'
import { peers } from '../peers.js'

describe('peers', () => {
  it('every cell has 20 peers', () => {
    const peersCount = peers.map(set => set.length)
    expect(peersCount.every(count => count === 20)).toEqual(true)
  })

  it('has the correct peers', () => {
    expect(Array.from(peers[0]).sort(ascending)).toEqual([
      // row 1
      1, 2, 3, 4, 5, 6, 7, 8,
      // box 1: 1, 2, 3 +
      9, 10, 11, 18, 19, 20,
      // col 1: 1, 9, 18 +
      27, 36, 45, 54, 63, 72,
    ])
  })
})

const ascending = (a: number, b: number): number => a - b
