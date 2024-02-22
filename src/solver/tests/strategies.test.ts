import { describe, expect, it } from 'vitest'
import { strategies } from '../strategies.js'
import { toCandidateGrid } from './toCandidateGrid'

describe('naked tuples', () => {
  it('finds naked singles in a row', () => {
    const candidates = toCandidateGrid(`
      1 1234 1234 . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      `)
    const { matches, removals } = strategies.nakedSingles(candidates)
    expect(matches).toEqual([0])
    expect(removals).toEqual([
      { index: 1, value: 1 },
      { index: 2, value: 1 },
    ])
  })

  it('finds naked doubles in a row', () => {
    const candidates = toCandidateGrid(`
      12 234 12 . . 123 134 . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      . . . . . . . . .
      `)
    const { matches, removals } = strategies.nakedDoubles(candidates)
    expect(matches).toEqual([0, 2])
    expect(removals).toEqual([
      { index: 1, value: 2 },
      { index: 5, value: 1 },
      { index: 5, value: 2 },
      { index: 6, value: 1 },
    ])
  })

  it('finds naked doubles in a box', () => {
    const candidates = toCandidateGrid(`
        12  .  .   . . . . . .
        .   12 134 . . . . . .
        234 .  123 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
      `)
    const { matches, removals } = strategies.nakedDoubles(candidates)
    expect(matches).toEqual([0, 10])
    expect(removals).toEqual([
      { index: 11, value: 1 },
      { index: 18, value: 2 },
      { index: 20, value: 1 },
      { index: 20, value: 2 },
    ])
  })

  it('finds naked doubles in a column', () => {
    const candidates = toCandidateGrid(`
        12  . . . . . . . .
        12  . . . . . . . .
        134 . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        123 . . . . . . . .
        .   . . . . . . . .
        234 . . . . . . . .
        .   . . . . . . . .
      `)
    const { matches, removals } = strategies.nakedDoubles(candidates)
    expect(matches).toEqual([0, 9])
    expect(removals).toEqual([
      { index: 18, value: 1 },
      { index: 45, value: 1 },
      { index: 45, value: 2 },
      { index: 63, value: 2 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const candidates = toCandidateGrid(`
        12  . . . . . . . .
        12  . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
        .   . . . . . . . .
      `)
    const { matches, removals } = strategies.nakedDoubles(candidates)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})

describe('hidden tuples', () => {
  it(`finds hidden singles`, () => {
    const candidates = toCandidateGrid(`
     234  234  234  1234 234  234  234  234  234
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
     1234 1234 1234 1234 1234 1234 1234 1234 1234 
      `)
    const { matches, removals } = strategies.hiddenSingles(candidates)
    expect(matches).toEqual([3])
    expect(removals).toEqual([
      { index: 3, value: 2 },
      { index: 3, value: 3 },
      { index: 3, value: 4 },
    ])
  })

  it(`finds hidden doubles`, () => {
    const candidates = toCandidateGrid(`
      34   34   1234 1234 34   34   34   34   34 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      1234 1234 1234 1234 1234 1234 1234 1234 1234 
      `)
    const { matches, removals } = strategies.hiddenDoubles(candidates)
    expect(matches).toEqual([2, 3])
    expect(removals).toEqual([
      { index: 2, value: 3 },
      { index: 2, value: 4 },
      { index: 3, value: 3 },
      { index: 3, value: 4 },
    ])
  })

  it('finds hidden triples', () => {
    const candidates = toCandidateGrid(`
    4    4    1234 1234 1234 4    4    4    4  
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    `)
    const { matches, removals } = strategies.hiddenTriples(candidates)
    expect(matches).toEqual([2, 3, 4])
    expect(removals).toEqual([
      { index: 2, value: 4 },
      { index: 3, value: 4 },
      { index: 4, value: 4 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const candidates = toCandidateGrid(`
    234  234  234  1    234  234  234  234  234
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
    1234 1234 1234 1234 1234 1234 1234 1234 1234 
   `)
    const { matches, removals } = strategies.hiddenSingles(candidates)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})

describe('locked tuples', () => {
  it('finds locked tuples in a row', () => {
    const candidates = toCandidateGrid(`
        2 2 2 . . . . . .
        2 2 2 . . . . . .
        2 2 2 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . 2 . . . . . . .
        . 2 . . . . . . .
        . 2 . . . . . . .
        `)

    const { matches, removals } = strategies.lockedTuples(candidates)
    expect(matches).toEqual([55, 64, 73])
    expect(removals).toEqual([
      { index: 1, value: 2 },
      { index: 10, value: 2 },
      { index: 19, value: 2 },
    ])
  })

  it('finds locked tuples in a column', () => {
    const candidates = toCandidateGrid(`
        2 2 2 . . . . . .
        2 2 2 . . . 2 2 2
        2 2 2 . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        . . . . . . . . .
        `)

    const { matches, removals } = strategies.lockedTuples(candidates)
    expect(matches).toEqual([15, 16, 17])
    expect(removals).toEqual([
      { index: 9, value: 2 },
      { index: 10, value: 2 },
      { index: 11, value: 2 },
    ])
  })

  it(`doesn't match if nothing is removed`, () => {
    const candidates = toCandidateGrid(`
          3 3 3 . . . . . .
          3 3 3 . . . 2 2 2
          3 3 3 . . . . . .
          . . . . . . . . .
          . . . . . . . . .
          . . . . . . . . .
          . . . . . . . . .
          . . . . . . . . .
          . . . . . . . . .
          `)

    const { matches, removals } = strategies.lockedTuples(candidates)
    expect(matches).toEqual([])
    expect(removals).toEqual([])
  })
})
